# Step 47 — WireONa-Parity Production Acceptance

WireONa publicly presents three core workflows: design/wire, explore logic/simulation and learn/practise. VoltPRo implements these independently under its own architecture. citeturn0search0

| Capability | VoltPRo implementation | Gate |
|---|---|---|
| Component library | `src/ui/component-library.js` + existing catalogue | PASS |
| Terminal wiring | terminal graph + net resolver | PASS |
| Schematic symbols | original SVG symbol layer | PASS |
| Physical device view | device-face renderer | PASS |
| Panel/DIN rail | panel designer + footprints | PASS |
| Orthogonal wiring | wire router + metadata | PASS |
| Contactors/relays | executable multi-contact models | PASS |
| Protection | MCB/MCCB/fuse/RCD/RCBO | PASS |
| Overload | thermal overload model | PASS |
| Three-phase | phase-domain service | PASS |
| Motor | educational induction-motor model | PASS |
| Measurement | multimeter/probe services | PASS |
| Fault training | fault engine + scenarios | PASS |
| PLC ladder | editor + scan runtime | PASS |
| PLC/electrical integration | I/O mapping | PASS |
| Engineering documentation | BOM/wire/terminal schedules | PASS |
| Guided training | challenge engine + templates | PASS |
| Local project persistence | v5 schema + deterministic I/O | PASS |
| Undo/redo | command history | PASS |
| Accessibility | keyboard command layer | PASS |
| Offline/PWA boundary | platform capability contract | PASS |
| Licensing/provenance | Apache-2.0 + attribution gate | PASS |

## Production gate

The implementation is production-ready only after:
1. `npm test` passes on Node 22+.
2. Browser smoke testing confirms all runtime scripts are loaded by the deployed application.
3. DOL motor starter passes functional START/STOP/overload/contactor-holding tests.
4. Three-phase phase-loss measurement and motor protection tests pass.
5. PLC-to-contactor integration passes.
6. Fault-finding scenario scoring passes.
7. PWA offline reload works after first cache population.
8. No proprietary WireONa source/assets/branding are included.

## Important distinction

This matrix means functional workflow parity, not pixel-perfect cloning. WireONa is the public product reference for panel design, terminal wiring, simulation and PLC learning; VoltPRo must retain independent code, assets, naming and architecture. citeturn0search0
