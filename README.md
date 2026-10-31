# OrganUI Prostate

A minimal, standalone, open-source explorer of the male reproductive organs built with React, TypeScript, Three.js, React Three Fiber, Vite, and Bun. It shares its interaction design and code with [OrganUI Heart](https://github.com/organui/heart-3d).

**Status:** working local demo. Thirteen selectable structures from a real, openly licensed model, responsive layouts, and checked desktop/mobile interactions. Public deployment and clinical anatomy review have not been completed.

![OrganUI Prostate desktop explorer](docs/screenshots/desktop.png)

## Run locally

Install [Bun](https://bun.sh/) **1.4.2 or newer**, then:

```sh
git clone https://github.com/organui/prostate-3d.git
cd prostate-3d
bun install --frozen-lockfile
bun run dev
```

Open **http://127.0.0.1:5173**. No environment variables, accounts, API keys, sibling repositories, model downloads, or external font services are needed after dependency installation. The ready-to-use 1.3 MB GLB is in `public/models/`.

```sh
bun run typecheck       # TypeScript checks, including conversion scripts
bun run test            # Unit tests for selection emphasis, picking, ownership, and the anatomy-tree adapter
bun run verify:model    # Check the GLB hash, source IDs, element lists, and valid geometry
bun run build           # Typecheck and create dist/
bun run preview         # Serve the production build at http://127.0.0.1:4173
bun run format:check    # Check formatting
```

The app is static and uses relative build paths. No deployment has been performed.

## Explore

- The organs open centred from the front: the prostate below the bladder, the seminal vesicles behind it, the testes with their epididymides and deferent ducts, and the penis with the urethra inside it. Open **Anatomy** in the header to browse structures.
- Drag to rotate; scroll or pinch to zoom. The view menu has anterior, lateral (from the right side) and posterior presets. Manual rotation changes its label to **Custom view**; zooming and selecting keep the view name.
- Select a mesh or use the anatomy tree (the OrganUI registry `anatomy-tree` component, see [registry integration](docs/REGISTRY_INTEGRATION.md)). The selected structure glows in its own colour and everything else is ghosted, so the urethra stays visible through the prostate and penis, and the seminal vesicles through the rectum.
- Isolate a structure, hide it, or restore all. **Reset explorer** restores the anterior camera, visibility, selection, tree state and tour.
- Follow five guided stops: the prostate from the side, the testes, the route of the deferent ducts, the seminal vesicles behind the bladder, and the urethra.
- Keyboard: Tab/Enter for controls, arrow keys to rotate the focused model, `+`/`-` to zoom, Escape closes the panel and returns focus to its toggle.

<details>
<summary>Selection, right lateral view and mobile screenshots</summary>

![Urethra selected with the rest ghosted](docs/screenshots/anatomy.png)

![Right lateral view showing the bladder, prostate, rectum and penis](docs/screenshots/lateral.png)

<img src="docs/screenshots/mobile.png" alt="Mobile male reproductive explorer" width="300" />

</details>

## Model, credits, and license

> BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS), licensed under Creative Commons Attribution-Share Alike 2.1 Japan. Adapted by OrganUI.

The model is a curated subset of **BodyParts3D 3.0** (most organs) and **BodyParts3D / Anatomography 4.3** (the urethra and the dorsal vessels of the penis): 21 source meshes grouped into 13 structures. The model data and screenshots of it are under **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)**, separately from this repository's **MIT code license**. Meshes come from two checksum-pinned public mirrors and are cross-checked against each release's own concept list. Read [model provenance](docs/MODEL_PROVENANCE.md), [asset attribution](public/models/ATTRIBUTION.md) and the [manifest](public/models/manifest.json).

Descriptions summarise the [NCI SEER Training male reproductive system page](https://training.seer.cancer.gov/anatomy/reproductive/male/) and general anatomy; that page could not be opened from the build sandbox, so the wording has not been checked against it. **Expert anatomical review is pending.** This is an educational interface demonstration, not a diagnostic or clinical tool.

Known limitations:

- The prostate is one mesh. Its zones and lobes cannot be selected separately, and the ejaculatory ducts, bulbourethral glands and prostatic venous plexus have no mesh in either release.
- Paired organs (testes, epididymides, deferent ducts, seminal vesicles) are selected as one set per pair. The two corpora cavernosa are one source surface.
- The scrotum, skin, spermatic cord coverings, pelvic bones, muscles, ureters and most vessels are omitted. The penis is modelled erect, as in the source.
- Colours are illustrative.
- Browser checks used headless Chromium with software WebGL at desktop and phone viewport sizes, not physical devices or a screen-reader audit.

## License

Original application code: [MIT](LICENSE). Anatomy model, derived model images, fonts, and icons retain their separately documented licenses.

Part of [OrganUI](https://github.com/organui).
