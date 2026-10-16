# Model provenance and preparation

## Source and license

The runtime model combines two releases of **BodyParts3D / Anatomography**, retrieved **2026-10-16**, which share one coordinate frame:

- **BodyParts3D 3.0** (release 20110915, `BodyParts3D_3.0_obj_95`) for the prostate, seminal vesicles, testes, epididymides, deferent ducts, corpora cavernosa, corpus spongiosum, glans, bladder and rectum. In this region most 3.0 meshes are much denser than the 4.3 ones (the prostate has 1,754 triangles against 442, the bladder 4,016 against 226, the rectum 8,824 against 2,118).
- **BodyParts3D / Anatomography 4.3** (object set 4.3, ontology tree FMA3.0) for the urethra and the dorsal arteries and veins of the penis. 3.0 has no dorsal vessels, and its urethra ends 11 mm beyond the tip of the glans.

Both are distributed here under **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)** ([legal text](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)). The original service permits modification and redistribution of contour data and rendered images under that license; an inert [snapshot of its notice](model-source/original-license.html.txt), copied from the lungs explorer, and the [3.0 mirror's license text](model-source/bp30-mirror-LICENSE_content.txt) (SHA-256 `0e26340c…7ec84`, identical to the copy spleen-3d preserved) are included. This license governs `public/models/prostate.glb`, the manifest's model data and the model screenshots, separately from the MIT application code. It matches [lungs-3d](https://github.com/organui/lungs-3d), [pancreas-3d](https://github.com/organui/pancreas-3d) and [spleen-3d](https://github.com/organui/spleen-3d): the LSDB archive's CC BY 4.0 grant covers its 4.0 release and is not extended to these meshes.

Credit: **BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS).** Adapted by OrganUI. No endorsement is implied.

## Retrieval and pinning

The network policy of the sandbox this was built in blocked both `dbarchive.biosciencedbc.jp` and `lifesciencedb.jp`, so the official archives could not be downloaded. Both sets come from public GitHub mirrors, pinned by commit and checksum in [model-inputs.json](../scripts/model-inputs.json):

- **3.0:** [Kevin-Mattheus-Moerman/BodyParts3D](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D) at commit `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`, which converted the official OBJ release to binary STL without changing geometry and names each file by its FMA concept (the source spleen-3d uses). Each STL's SHA-256 is pinned, and its file ID must appear in the mirror's pinned `parts_list_e.txt` under a concept the structure claims. The STLs are unindexed; vertices are welded on exact position before normals are recomputed.
- **4.3:** [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) at commit `fd527e6f4daf732fd814314d9257df5877b844bc` (the commit lungs-3d and pancreas-3d pin). Each OBJ's SHA-256 matches the oid in its Git LFS pointer, its embedded `File ID` and `Concept ID` headers match, and the concept maps to that FJ element in the official 4.3 IS-A table [`FMA2Obj-4.3.tsv`](model-source/FMA2Obj-4.3.tsv) (SHA-256 `c3d16c89…935d4f`), the unchanged official download preserved by lungs-3d. `prepare-model.ts` refuses to run if any hash changes.

## Selected structures

| Structure | Release | Source concept(s) | Source files |
| --- | --- | --- | --- |
| Prostate | 3.0 | FMA9600 | FMA9600 |
| Seminal vesicles | 3.0 | FMA19387 right, FMA19388 left | FMA19387, FMA19388 |
| Testes | 3.0 | FMA7211 right, FMA7212 left | FMA7211, FMA7212 |
| Epididymides | 3.0 | FMA18256 right, FMA18257 left | FMA18256, FMA18257 |
| Deferent ducts | 3.0 | FMA19235 right, FMA19236 left | FMA19235, FMA19236 |
| Corpora cavernosa | 3.0 | FMA19618 corpus cavernosum of penis | FMA19618 |
| Corpus spongiosum | 3.0 | FMA19617 (file `FMA19617nsn`, "corpus spongiosum of penis, nsn") | FMA19617nsn |
| Glans penis | 3.0 | FMA18247 | FMA18247 |
| Urethra | 4.3 | FMA19667 | FJ3148 |
| Dorsal arteries of penis | 4.3 | FMA20818 right, FMA20819 left | FJ3592, FJ3593, FJ3496, FJ3497 |
| Dorsal veins of penis | 4.3 | FMA21354 deep, FMA21384 superficial | FJ2056, FJ2208 |
| Urinary bladder | 3.0 | FMA15900 | FMA15900 |
| Rectum | 3.0 | FMA14544 | FMA14544 |

21 source files, 50,694 triangles. Each file belongs to exactly one structure; the script refuses duplicates and unused inputs. Per-file hashes, sizes and counts are in the [manifest](../public/models/manifest.json) and [selected-mappings.tsv](model-source/selected-mappings.tsv).

Decisions:

- **Mixing releases.** Bounds of the same concept agree within a millimetre or two between 3.0 and 4.3 (for example the corpus spongiosum and the testes), so the two sets are placed together without any alignment step.
- **Paired organs are one structure each.** Left and right testes, epididymides, deferent ducts and seminal vesicles have separate concepts and meshes; each pair is grouped so the tree stays short and a selection shows both sides.
- **Left dorsal artery.** FMA20819 maps to FJ2070, FJ3496 and FJ3497. FJ2070 covers the same course as FJ3496 (same bounds, a quarter of its vertices within 1 mm), so rendering both would double the vessel. FJ3496 + FJ3497 are used, matching the right side's FJ3592 + FJ3593, and FJ2070 is excluded.
- **Superficial dorsal vein.** FMA21384 maps to the midline trunk FJ2208 and to FJ3426 and FJ3637 (its left and right concepts FMA21386, FMA21385). FJ3426 runs along the deep dorsal vein FJ2056 (about half of its vertices within 1 mm) and FJ3637 along FJ2208, so only the trunk FJ2208 is used with the deep vein.
- **Hip bones left out.** The hip bones would double the width of the frame and shrink the organs to half size in every named view, so the pelvis is omitted like the bones in the other explorers.
- Omitted: scrotum (no mesh in either mirror), skin, ureters (they run up to the kidneys), internal iliac and pudendal vessels, ejaculatory ducts and bulbourethral glands (no meshes), pubic hair and pelvic muscles.

## Transformation and orientation

Vertices are recentred on the selection's source bounding box and uniformly scaled by `0.016`; axes change from source `[x, y, z]` to display `[x, z, -y]` (source +x patient left, −y anterior, +z superior). The anterior view looks along display −Z, posterior along +Z, and the lateral view looks from the patient's right along display +X, the usual sagittal view with the bladder above the prostate, the rectum behind and the penis in front. In the anterior view the left testis is on the viewer's right, as expected. No anatomical reshaping or decimation is performed.

## Reproduce

```sh
bun run prepare:model   # downloads missing STLs and OBJs into .asset-cache, verifies, writes the GLB and manifest
bun run verify:model    # checks the GLB hash, structure IDs, element lists and geometry
```
