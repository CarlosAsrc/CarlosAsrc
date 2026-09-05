# Profile visuals

Upload the entire `assets/` directory alongside the root `README.md` when updating `CarlosAsrc/CarlosAsrc`. The README uses relative asset paths; copying only the Markdown would leave its images unavailable.

## Included assets

- `experience-light.svg` and `experience-dark.svg`: desktop career timeline.
- `experience-light-mobile.svg` and `experience-dark-mobile.svg`: compact stacked timeline used by the profile at all screen sizes.
- `experience-static.svg`: a still version, available if you prefer to remove animation later.
- `badges/`: labeled technology badges.
- `icons/`: consistent section and topic icons.
- `brands/`: local copies of technology logos used by the generator.

The timeline draws its connecting line and briefly highlights each career stage. The sequence finishes in 3.9 seconds and does not loop. All information is visible before and after the animation. Motion is enabled only under `prefers-reduced-motion: no-preference`; the default is a complete static diagram.

The README uses `<picture>` to choose the light/dark compact variant, capped at 420 pixels wide and shrinking to fit narrower screens. The desktop variants remain available as alternatives. It also retains full experience descriptions in a collapsible text section and supplies a descriptive image alternative.

These SVGs contain no scripts, remote fonts, external image references, or network calls. GitHub hosts the files with the profile repository. The local HTML preview approximates GitHub's Markdown layout.

## Updating content

Edit the `stages` data in `scripts/build-visuals.cjs` for company names, dates, technologies, and short descriptions. Edit the root README for the surrounding profile copy and full experience text.

Run `npm install`, then `npm run build:visuals` to regenerate the SVGs, badges, section icons, and `README-preview.html`. With the Codex bundled runtime, set `CODEX_NODE_MODULES` to its Node package directory instead of installing dependencies.

The generator and its dependency manifest are included for maintenance. `README-preview.html` is generated locally and ignored by Git. The live profile needs only `README.md` and `assets/`.

## Sources and licenses

- LangChain and LangGraph logos: [Simple Icons](https://github.com/simple-icons/simple-icons), revision `7f18aaa676087b8240b6f4ff58a6720be282da59`. License: `brands/LICENSE-simple-icons.md` (CC0). These icons and Kafka adapt to the light/dark badge text color.
- Other technology logos: [Devicon](https://github.com/devicons/devicon), copied September 5, 2026. The inspected source tree was `7330accdbc47e2dc0c19789a48533c4a3c50fe58`. Original license: `brands/LICENSE` (MIT). Kafka is recolored in the generated timeline for contrast; the source logo remains intact. Logos identify technologies, not endorsements.
- Section icons and the generic SDK, LLM gateway, MCP server, and component pictograms: [Lucide](https://lucide.dev), package version 1.8.0. License: `icons/LICENSE` (ISC). These pictograms label platform capabilities rather than official product logos.
- Career facts: [Carlos's LinkedIn profile](https://www.linkedin.com/in/carlos-asrc/) and his updated professional experience. The first stage combines cloud training at ilegra with subsequent work serving Agibank; it does not imply direct employment by Agibank throughout that period. The Nubank stage shows progression from customer-support AI to platform engineering without inventing an internal transfer date.
- Relative images and `<picture>`: [GitHub Markdown documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).
