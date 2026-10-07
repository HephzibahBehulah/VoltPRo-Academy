# VoltPRo Simulator

VoltPRo Simulator is the interactive simulation workspace for VoltPRo Academy.

## Current capabilities
- Browser-only schematic canvas with drag/drop components.
- Pin-to-pin wiring and editable component properties.
- DC educational engine with live current/voltage/resistance/continuity readings.
- Switch, source, resistor, lamp, LED, motor, heater, fuse, breaker and protection models.
- Undo/redo, project persistence, `.voltpro` JSON export/import.
- Component registry designed for progressive expansion.
- Schematic / Panel / Microcontroller workspace modes.
- No account, server or paid dependency is required.

## Project format
A `.voltpro` project contains `format`, `version`, `metadata`, `mode`, `components`, `wires` and `simulation`. Future versions must remain backward-compatible.

## Engineering boundary
This is an educational simulator. It is not a substitute for current IEC/DIN/VDE/NEC requirements, manufacturer instructions, design verification, inspection or qualified electrical work.

## Development roadmap
1. Expand the component registry into executable models.
2. Add full nodal/MNA analog solving and AC/transient analysis.
3. Add digital event simulation and MCU execution.
4. Add panel/DIN-rail layout, cable sizing and BOM.
5. Add SVG/PDF exports, PWA offline shell and multilingual content.
