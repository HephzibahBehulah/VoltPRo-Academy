# Contributing to VoltPRo

## Add a component
1. Add a stable JSON definition under `data/`.
2. Provide IEC and/or ANSI SVG symbols with provenance.
3. Define pins and engineering units.
4. Implement a simulation adapter or explicitly mark the component educational-only.
5. Add documentation, safety notes and a datasheet/source URL.
6. Add deterministic tests.
7. Keep all dependencies license-compatible with the project license.

## Definition of done
A component is not counted as a functional library component merely because it appears in a catalog. It needs rendering, interaction, valid pin topology, documented parameters and a tested simulation/educational behavior.
