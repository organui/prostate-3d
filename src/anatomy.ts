export type Group =
  'Glands' | 'Testes and ducts' | 'Penis and urethra' | 'Vessels' | 'Neighbouring organs'
export type Structure = {
  id: string
  fma: string
  name: string
  sourceName: string
  group: Group
  // BodyParts3D release the meshes come from: 3.0 STLs for most organs (denser
  // meshes), 4.3 OBJs for the urethra (the 3.0 one runs past the glans) and
  // the dorsal vessels of the penis (absent from 3.0).
  source: '3.0' | '4.3'
  // FMA concepts this group draws its source meshes from.
  concepts: string[]
  // Source files: FMA file IDs for 3.0, FJ elements for 4.3. Each file
  // belongs to exactly one structure.
  elements: string[]
  color: string
  description: string
  note: string
}

export const anatomySource = 'https://training.seer.cancer.gov/anatomy/reproductive/male/'
export const structures: Structure[] = [
  {
    id: 'prostate',
    fma: 'FMA9600',
    name: 'Prostate',
    sourceName: 'prostate',
    group: 'Glands',
    source: '3.0',
    concepts: ['FMA9600'],
    elements: ['FMA9600'],
    color: '#c98a7d',
    description:
      'A walnut-sized gland below the bladder and in front of the rectum. The urethra runs through it, and it adds fluid to semen.',
    note: 'The gland is one surface. Its zones and lobes are not separate meshes, so they cannot be selected on their own.',
  },
  {
    id: 'seminal-vesicles',
    fma: 'FMA19387',
    name: 'Seminal vesicles',
    sourceName: 'right and left seminal vesicles',
    group: 'Glands',
    source: '3.0',
    concepts: ['FMA19387', 'FMA19388'],
    elements: ['FMA19387', 'FMA19388'],
    color: '#d6a95f',
    description:
      'Paired coiled glands behind the bladder. They make most of the fluid in semen and join the deferent ducts above the prostate.',
    note: 'Both sides are grouped as one selectable set. They lie between the bladder and the rectum, so select them or hide the rectum to see them.',
  },
  {
    id: 'testes',
    fma: 'FMA7211',
    name: 'Testes',
    sourceName: 'right and left testes',
    group: 'Testes and ducts',
    source: '3.0',
    concepts: ['FMA7211', 'FMA7212'],
    elements: ['FMA7211', 'FMA7212'],
    color: '#e0b9a0',
    description: 'Paired glands in the scrotum that produce sperm and testosterone.',
    note: 'Both sides are grouped as one selectable set. The scrotum and the coverings of the testes are omitted.',
  },
  {
    id: 'epididymides',
    fma: 'FMA18256',
    name: 'Epididymides',
    sourceName: 'right and left epididymides',
    group: 'Testes and ducts',
    source: '3.0',
    concepts: ['FMA18256', 'FMA18257'],
    elements: ['FMA18256', 'FMA18257'],
    color: '#9c7bb0',
    description:
      'Tightly coiled tubes on the back of each testis, where sperm mature and are stored.',
    note: 'Both sides are grouped as one selectable set.',
  },
  {
    id: 'deferent-ducts',
    fma: 'FMA19235',
    name: 'Deferent ducts',
    sourceName: 'right and left deferent ducts (vas deferens)',
    group: 'Testes and ducts',
    source: '3.0',
    concepts: ['FMA19235', 'FMA19236'],
    elements: ['FMA19235', 'FMA19236'],
    color: '#6f9a8b',
    description:
      'Carry sperm from each epididymis up through the groin, over the bladder and down behind it to the prostate.',
    note: 'Both sides are grouped as one selectable set. The ejaculatory ducts inside the prostate have no separate mesh.',
  },
  {
    id: 'corpora-cavernosa',
    fma: 'FMA19618',
    name: 'Corpora cavernosa',
    sourceName: 'corpus cavernosum of penis',
    group: 'Penis and urethra',
    source: '3.0',
    concepts: ['FMA19618'],
    elements: ['FMA19618'],
    color: '#b86f78',
    description:
      'Two columns of erectile tissue along the top of the penis. They fill with blood during an erection.',
    note: 'The source models both columns as one surface.',
  },
  {
    id: 'corpus-spongiosum',
    fma: 'FMA19617',
    name: 'Corpus spongiosum',
    sourceName: 'corpus spongiosum of penis, nsn',
    group: 'Penis and urethra',
    source: '3.0',
    concepts: ['FMA19617'],
    elements: ['FMA19617nsn'],
    color: '#d28f8f',
    description:
      'The column of erectile tissue along the underside of the penis. It surrounds the urethra and ends in the glans.',
    note: 'The urethra runs inside it. Isolate the urethra or hide this to see it.',
  },
  {
    id: 'glans-penis',
    fma: 'FMA18247',
    name: 'Glans penis',
    sourceName: 'glans penis',
    group: 'Penis and urethra',
    source: '3.0',
    concepts: ['FMA18247'],
    elements: ['FMA18247'],
    color: '#e3a6a0',
    description: 'The expanded tip of the corpus spongiosum, where the urethra opens.',
    note: 'Skin and foreskin are omitted.',
  },
  {
    id: 'urethra',
    fma: 'FMA19667',
    name: 'Urethra',
    sourceName: 'urethra',
    group: 'Penis and urethra',
    source: '4.3',
    concepts: ['FMA19667'],
    elements: ['FJ3148'],
    color: '#e8c76a',
    description:
      'Carries urine from the bladder and semen from the ejaculatory ducts. It passes through the prostate and the length of the penis.',
    note: 'It runs inside the prostate and the corpus spongiosum. Isolate it to follow it.',
  },
  {
    id: 'dorsal-arteries',
    fma: 'FMA20818',
    name: 'Dorsal arteries of penis',
    sourceName: 'right and left dorsal arteries of penis',
    group: 'Vessels',
    source: '4.3',
    concepts: ['FMA20818', 'FMA20819'],
    elements: ['FJ3592', 'FJ3593', 'FJ3496', 'FJ3497'],
    color: '#b8564c',
    description: 'Paired arteries along the top of the penis that supply its skin and the glans.',
    note: 'Four source vessels are grouped as one selectable set. The internal pudendal arteries they come from are omitted.',
  },
  {
    id: 'dorsal-veins',
    fma: 'FMA21354',
    name: 'Dorsal veins of penis',
    sourceName: 'deep and superficial dorsal veins of penis',
    group: 'Vessels',
    source: '4.3',
    concepts: ['FMA21354', 'FMA21384'],
    elements: ['FJ2056', 'FJ2208'],
    color: '#6d8db0',
    description:
      'Run along the midline of the penis. The deep vein drains the erectile tissue toward the veins around the prostate.',
    note: 'The deep vein and the superficial trunk are grouped as one selectable set.',
  },
  {
    id: 'urinary-bladder',
    fma: 'FMA15900',
    name: 'Urinary bladder',
    sourceName: 'urinary bladder',
    group: 'Neighbouring organs',
    source: '3.0',
    concepts: ['FMA15900'],
    elements: ['FMA15900'],
    color: '#c7b98e',
    description:
      'Stores urine. The prostate sits directly below it and the seminal vesicles lie against its back.',
    note: 'Included for orientation. The ureters are omitted.',
  },
  {
    id: 'rectum',
    fma: 'FMA14544',
    name: 'Rectum',
    sourceName: 'rectum',
    group: 'Neighbouring organs',
    source: '3.0',
    concepts: ['FMA14544'],
    elements: ['FMA14544'],
    color: '#a88a74',
    description:
      'The last part of the large intestine. It lies behind the prostate, which is why the prostate can be felt through its wall.',
    note: 'Included for orientation. The pelvic bones and muscles are omitted.',
  },
]
export const groups = [
  'Glands',
  'Testes and ducts',
  'Penis and urethra',
  'Vessels',
  'Neighbouring organs',
] as const satisfies readonly Group[]
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Right lateral' | 'Posterior'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'prostate',
    title: 'Below the bladder',
    text: 'From the side, the prostate sits just under the bladder, in front of the rectum and above the root of the penis.',
    view: 'Right lateral',
  },
  {
    id: 'testes',
    title: 'Where sperm begin',
    text: 'The testes hang below the penis. Each makes sperm and testosterone, with an epididymis along its back.',
    view: 'Anterior',
  },
  {
    id: 'deferent-ducts',
    title: 'A long way round',
    text: 'Each deferent duct climbs from the testis through the groin, arches over the bladder and comes down behind it to the prostate.',
    view: 'Anterior',
  },
  {
    id: 'seminal-vesicles',
    title: 'Behind the bladder',
    text: 'Turn to the back. The seminal vesicles sit between the bladder and the rectum, which is ghosted here. They add most of the fluid in semen and meet the deferent ducts above the prostate.',
    view: 'Posterior',
  },
  {
    id: 'urethra',
    title: 'One shared channel',
    text: 'The urethra is isolated here. It leaves the bladder, passes through the prostate and runs the length of the penis. Restore all to see what surrounds it.',
    view: 'Right lateral',
    isolate: true,
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry (urethra, seminal vesicles).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
