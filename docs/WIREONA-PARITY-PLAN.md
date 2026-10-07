# VoltPRo Academy — Free Personal Electrical Simulator / WireONa-Inspired Parity Plan

## Product decision

VoltPRo Academy will provide a **free, local-first, no-subscription electrical and electronics simulator**. The application is hosted as a static GitHub Pages site and projects remain in the browser unless the user explicitly exports them.

WireONa is being used as a **functional/product reference**, not as a source of proprietary code or assets. Its public product description confirms the useful target workflow: arrange panel components, connect terminals, simulate electrical behaviour, and work with PLC logic in one workspace. citeturn3search0

## What we will reproduce as original VoltPRo functionality

- Drag-and-drop component library
- Terminal-to-terminal wiring
- Schematic workspace
- DIN-rail/control-panel workspace
- Protection devices
- Relays and contactors
- Motors and loads
- Measurement instruments
- PLC ladder-logic learning workspace
- Fault injection and diagnosis
- Component reference cards
- Component symbols and original panel assets
- Project save/load/export
- Offline/PWA operation
- Engineering calculations and documentation
- Educational challenges and guided circuits

## What we will NOT copy

We will not copy WireONa source code, proprietary SVGs, screenshots, product images, private APIs, database content, account system, or other protected assets without an explicit licence or permission.

WireONa's current Terms require uploaded content to be owned or authorised by the uploader, and the service is commercially operated with Free/Professional/Advanced plans. citeturn1view0

Therefore, VoltPRo will achieve feature parity by **reimplementing the behaviour and workflow independently**.

## Open-source implementation strategy

Where an existing open-source implementation materially accelerates the simulator, we will prefer licences compatible with this repository and record the exact dependency and licence.

Examples evaluated:

- Repath: MIT-licensed browser mixed-signal simulator with MNA/Newton methods and local execution. citeturn2search2
- SimcirJS: MIT-licensed browser circuit simulator. citeturn2search5
- ngspice-wasm: browser WebAssembly build of ngspice, with the upstream mixed licensing obligations documented by the project. citeturn2search6
- OpenCircuits is free/open source but GPL-3.0, so it is **not automatically suitable for direct code incorporation into VoltPRo's current MIT codebase**. citeturn2search0

No dependency is copied into VoltPRo merely because it looks useful. Licence compatibility is checked first.

## Architecture target

```
Component Library
      ↓
Schematic / Panel / PLC Workspaces
      ↓
Typed terminals + topology
      ↓
Netlist
      ↓
MNA / device models / control logic
      ↓
Fault + protection evaluation
      ↓
Live state
      ↓
Meters / animation / diagnostics / reports
```

## Current implementation added

### Workbench modes

- Schematic
- Panel
- PLC Logic
- Microcontroller
- Reference

### Component reference

The reference workspace now reads the repository's 100+ component catalogue and provides searchable component cards and technical reference information.

### Panel workspace

A visual DIN-rail companion view now shows the current project devices and rail layout instead of only reporting panel coordinates.

### PLC workspace

A local educational ladder-logic workspace has been added for practising control logic. It does not claim to execute native PLC firmware.

### PWA

The new workbench is included in the offline cache, and the simulator's removed language assets are no longer part of the active simulator cache.

## Next engineering stages

1. Replace generic panel cards with original IEC/ANSI symbols and device faces.
2. Add terminal numbering and multi-pin device connectivity.
3. Add contactor coil → auxiliary/main-contact state propagation.
4. Add overload relay and breaker trip logic.
5. Add live Live/Neutral/Earth path tracing.
6. Add automatic orthogonal wire routing.
7. Add short-circuit, open-neutral, earth-fault and overload diagnosis.
8. Add guided DOL, forward/reverse, star-delta, lighting and distribution-board circuits.
9. Add waveform plots and richer transient/AC result visualisation.
10. Expand functional models beyond the current core MNA set.
11. Add import/export adapters for common educational circuit formats where licences permit.
12. Run the full browser/device matrix before declaring production completion.

## Definition of success

A user must be able to open VoltPRo without an account or subscription, place real electrical/electronic components, wire them, run an actual local simulation, operate switches/controls, observe calculated results, introduce faults, diagnose them, save the project and continue working offline.

This is the product target: **a personal electrical/electronics simulator, not a WireONa copy.**
