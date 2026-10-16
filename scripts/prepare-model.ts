import { mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { Document, NodeIO } from '@gltf-transform/core'
import { BufferGeometry, Float32BufferAttribute, Color } from 'three'
import inputs from './model-inputs.json'
import { structures } from '../src/anatomy'

// Two releases share one coordinate frame: BodyParts3D 3.0 STLs for most organs
// (several times denser than the 4.3 meshes here) and 4.3 OBJs for the urethra
// (the 3.0 urethra ends 11 mm beyond the glans) and the dorsal vessels of the
// penis, which 3.0 does not contain.
const sha = (data: Uint8Array) => createHash('sha256').update(data).digest('hex')
const { bp30, bp43 } = inputs
const fetchPinned = async (path: string, input: { file: string; url: string; sha256: string }) => {
  const file = Bun.file(`${path}/${input.file}`)
  if (!(await file.exists())) {
    console.log(`Downloading ${input.file}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.file}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (sha(bytes) !== input.sha256)
    throw new Error(
      `Checksum mismatch: ${input.file}. Refusing changed upstream data; review it before updating the pin.`,
    )
  return bytes
}
await mkdir('.asset-cache/stl', { recursive: true })
await mkdir('.asset-cache/obj', { recursive: true })
await mkdir('public/models', { recursive: true })

const partNames = new Map(
  new TextDecoder()
    .decode(await fetchPinned('.asset-cache/stl', bp30.partsList))
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((l) => l.split('\t') as [string, string]),
)
const mapBytes = new Uint8Array(await Bun.file(bp43.mapping.file).arrayBuffer())
if (sha(mapBytes) !== bp43.mapping.sha256) throw new Error('Official concept mapping changed')
const isa = new Map(
  new TextDecoder()
    .decode(mapBytes)
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('\t'))
    .filter((r) => r[1] === 'is_a')
    .map((r) => [r[0], r[2].split('+')]),
)

type Element = {
  release: '3.0' | '4.3'
  element: string
  concept: string
  sourceName: string
  sha256: string
  bytes: number
  vertices: number
  triangles: number
}
const used = new Set<string>()
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity]
const grow = (v: number[]) =>
  v.forEach((p, i) => {
    min[i] = Math.min(min[i], p)
    max[i] = Math.max(max[i], p)
  })

// Binary STL stores unindexed triangles; vertices are welded on exact position
// so smooth normals can be recomputed. No geometry is added or removed.
async function readStl(id: string, concepts: string[], positions: number[], indices: number[]) {
  const input = bp30.stls.find((i) => i.id === id)
  if (!input) throw new Error(`Missing 3.0 input: ${id}`)
  const concept = id.replace(/nsn$/, '')
  const sourceName = partNames.get(id)
  if (!concepts.includes(concept) || !sourceName)
    throw new Error(`3.0 file does not match the structure's concepts: ${id}`)
  const bytes = await fetchPinned('.asset-cache/stl', input)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const triangles = view.getUint32(80, true)
  if (bytes.length !== 84 + triangles * 50) throw new Error(`Invalid binary STL: ${id}`)
  const offset = positions.length / 3
  const weld = new Map<string, number>()
  for (let t = 0; t < triangles; t++) {
    for (let k = 0; k < 3; k++) {
      const o = 84 + t * 50 + 12 + k * 12
      const v = [0, 1, 2].map((i) => view.getFloat32(o + i * 4, true))
      if (!v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${id}`)
      const key = v.join(',')
      let index = weld.get(key)
      if (index === undefined) {
        index = offset + weld.size
        weld.set(key, index)
        positions.push(...v)
        grow(v)
      }
      indices.push(index)
    }
  }
  return {
    release: '3.0',
    element: id,
    concept,
    sourceName,
    sha256: input.sha256,
    bytes: bytes.length,
    vertices: weld.size,
    triangles,
  } satisfies Element
}

async function readObj(id: string, concepts: string[], positions: number[], indices: number[]) {
  const mapped = concepts.flatMap((c) => isa.get(c) ?? [])
  if (!mapped.includes(id)) throw new Error(`${id} is not an IS-A element of its structure`)
  const input = bp43.objects.find((i) => i.id === id)
  if (!input) throw new Error(`Missing 4.3 input: ${id}`)
  const bytes = await fetchPinned('.asset-cache/obj', input)
  const text = new TextDecoder().decode(bytes)
  const header = (name: string) => text.match(new RegExp(`^# ${name} : (.+)$`, 'm'))?.[1].trim()
  const concept = header('Concept ID')
  if (
    header('File ID') !== id ||
    !concept ||
    !concepts.includes(concept) ||
    !isa.get(concept)!.includes(id) ||
    header('Compatibility version') !== '4.3'
  )
    throw new Error(`Geometry header does not match the official mapping: ${id}`)
  const offset = positions.length / 3
  let vertexCount = 0,
    triangles = 0
  for (const line of text.split(/\r?\n/)) {
    const tokens = line.trim().split(/\s+/)
    if (tokens[0] === 'v') {
      const v = tokens.slice(1, 4).map(Number)
      if (v.length !== 3 || !v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${id}`)
      grow(v)
      positions.push(...v)
      vertexCount++
    } else if (tokens[0] === 'f') {
      const face = tokens.slice(1).map((t) => {
        const i = Number(t.split('/')[0])
        return offset + (i > 0 ? i - 1 : vertexCount + i)
      })
      for (let i = 1; i < face.length - 1; i++) {
        indices.push(face[0], face[i], face[i + 1])
        triangles++
      }
    }
  }
  if (!vertexCount || !triangles) throw new Error(`Empty mesh: ${id}`)
  return {
    release: '4.3',
    element: id,
    concept,
    sourceName: header('English name') ?? '',
    sha256: input.sha256,
    bytes: bytes.length,
    vertices: vertexCount,
    triangles,
  } satisfies Element
}

const credit =
  'BodyParts3D / Anatomography, © The Database Center for Life Science. CC BY-SA 2.1 Japan. Adapted by OrganUI.'
const doc = new Document()
doc.getRoot().getAsset().copyright = credit
const scene = doc.createScene('OrganUI Prostate — BodyParts3D 3.0 and 4.3')
const buffer = doc.createBuffer()
const prepared = []
for (const structure of structures) {
  const positions: number[] = [],
    indices: number[] = []
  const elements: Element[] = []
  for (const id of structure.elements) {
    if (used.has(id)) throw new Error(`Duplicate ownership: ${id}`)
    used.add(id)
    const read = structure.source === '3.0' ? readStl : readObj
    elements.push(await read(id, structure.concepts, positions, indices))
  }
  prepared.push({ structure, positions, indices, elements })
}
const unused = [...bp30.stls, ...bp43.objects].filter((i) => !used.has(i.id))
if (unused.length) throw new Error(`Unused input meshes: ${unused.map((i) => i.id)}`)

const center = min.map((v, i) => (v + max[i]) / 2)
const scale = 0.016 // millimeters to display units; uniform scale, no anatomical reshaping
for (const { structure, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    transformed[i] = (positions[i] - center[0]) * scale
    transformed[i + 1] = (positions[i + 2] - center[2]) * scale
    transformed[i + 2] = -(positions[i + 1] - center[1]) * scale
  }
  const geometry = new BufferGeometry()
    .setAttribute('position', new Float32BufferAttribute(transformed, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(transformed).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc
        .createAccessor()
        .setType('VEC3')
        .setArray(new Float32Array(geometry.getAttribute('normal').array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(indices)).setBuffer(buffer),
    )
    .setMaterial(material)
  const mesh = doc.createMesh(structure.id).addPrimitive(primitive)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(mesh)
      .setExtras({ structureId: structure.id, fma: structure.fma, elements: structure.elements }),
  )
  geometry.dispose()
}
const runtime = await new NodeIO().writeBinary(doc)
await Bun.write('public/models/prostate.glb', runtime)
const manifest = {
  dataset: 'BodyParts3D / Anatomography',
  versions: ['3.0', '4.3'],
  retrieved: '2026-10-16',
  license: 'CC-BY-SA-2.1-JP',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  sourceLicenseStatement: 'https://lifesciencedb.jp/bp3d/info/index.html#License',
  credit,
  sources: {
    '3.0': {
      release: bp30.release,
      repository: bp30.repository,
      commit: bp30.commit,
      partsList: bp30.partsList,
    },
    '4.3': {
      variant: 'Object set 4.3, ontology tree FMA3.0; official IS-A concept-to-element mapping',
      repository: bp43.repository,
      commit: bp43.commit,
      mapping: bp43.mapping,
    },
  },
  transform: { sourceBoundsMm: { min, max }, centerMm: center, scale, axes: '[x, z, -y]' },
  runtime: { file: 'prostate.glb', bytes: runtime.byteLength, sha256: sha(runtime) },
  structures: prepared.map(({ structure, elements }) => ({
    id: structure.id,
    fma: structure.fma,
    source: structure.source,
    concepts: structure.concepts,
    sourceName: structure.sourceName,
    elements,
  })),
}
await Bun.write('public/models/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
await Bun.write(
  'docs/model-source/selected-mappings.tsv',
  'structure\trelease\tconcept id\tsource name\tsource file\tsha256\n' +
    prepared
      .flatMap(({ structure, elements }) =>
        elements.map((e) =>
          [structure.id, e.release, e.concept, e.sourceName, e.element, e.sha256].join('\t'),
        ),
      )
      .join('\n') +
    '\n',
)
console.log(
  `Prepared ${structures.length} groups, ${used.size} source meshes, ${runtime.byteLength} bytes. SHA-256 ${sha(runtime)}`,
)
