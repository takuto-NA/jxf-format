# JXF – JSON eXchange Format

**A modern, lightweight, and extensible format for CAD data exchange.**

## TL;DR

- **What?**: A JSON-based exchange format for 2D/3D CAD data.
- **Why?**: To replace legacy formats like DXF with something modern, web-friendly, and easy to parse.
- **Key Features**:
  - **2D & 3D**: Supports lines, arcs, polylines, meshes, and NURBS.
  - **JSON + Binary**: Human-readable structure with optional binary blobs for heavy data (like glTF).
  - **Semantic**: Built-in support for attributes (e.g., "hole", "material") to drive automation.
  - **Extensible**: Clear mechanism for domain-specific extensions (CAM, PCB, etc.).
- **Status**: **Draft 0.1.0**. Experimental but usable for prototypes.

---

## Quick Start

### 1. View a Sample
Check out `examples/example_2d.jxf` to see what the JSON looks like.

```json
{
  "asset": { "format": "JXF", "version": "0.1.0" },
  "units": "millimeter",
  "entities": [
    { "type": "line", "start": [0,0], "end": [100,0] }
  ]
}
```

### 2. Convert a DXF file
Use our prototype converter (requires Node.js):

```bash
# Install dependencies (hypothetical)
npm install jxf-tools

# Convert DXF to JXF
node tools/dxf-to-jxf.js input.dxf output.jxf
```

### 3. Visualize
Render a JXF file to SVG for quick viewing:

```bash
python tools/jxf-to-svg.py output.jxf image.svg
```

---

## Format Overview

JXF is designed to be simple and self-describing. For the full technical specification, including detailed field definitions and binary format, please see the **[Core Specification](docs/spec-core.md)**.

### Top-Level Structure (Minimal Core)

> Note: Additional fields like `metadata`, `extensionsUsed`, and `extensionsRequired` are defined in the Core Specification.

| Field | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `asset` | **Yes** | Object | Format version and metadata. |
| `units` | **Yes** | String | Coordinate units (e.g., `"millimeter"`). |
| `layers` | No | Array | Layer definitions (name, color). |
| `entities` | **Yes** | Array | List of geometric objects. |
| `extensions` | No | Object | Domain-specific extension data. |

### Supported Entities

> Status reflects the stability in this draft: "Stable" entities are expected to remain compatible in 0.x; "Draft/Experimental/Future" may change.

| Entity Type | Description | Status |
| :--- | :--- | :--- |
| `line` | Straight line segment. | **Stable** |
| `arc` | Circular arc or circle. | **Stable** |
| `polyline` | Connected series of lines/arcs. | **Stable** |
| `mesh` | 3D triangular/polygonal mesh. | **Draft** |
| `spline` | B-Spline or NURBS curve. | **Experimental** |
| `surface` | NURBS surface. | **Future** |

---

## Motivation and Goals

Traditional CAD exchange formats either lack modern structure (DXF) or are overly complex for simple needs (STEP). JXF aims to fill the gap, with a primary focus on **2D Drawings** and **Manufacturing Data**:

- **2D First**: Prioritize drafting, schematics, and manufacturing paths (G-code, Gerber).
- **Web-First**: Native JSON support makes it perfect for web viewers and cloud apps.
- **Automation Ready**: Semantic attributes allow machines to understand *intent* (e.g., "this circle is a drill hole"), not just geometry.

## Design Philosophies

- **Simplicity**: Easy to parse with standard JSON libraries in any language.
- **Human-Readable**: You can open it in a text editor and understand it.
- **Efficiency**: Heavy data (large meshes) can be offloaded to binary files, keeping the JSON light.

## Applications

- **CAD**: Exchange drawings between different CAD systems.
- **CAM**: Pass design data with feature attributes directly to manufacturing software.
- **PCB**: Exchange board outlines and component footprints.
- **Web**: Display interactive 3D models or 2D drawings in browsers without heavy plugins.

## Comparison with DXF

| Feature | JXF | DXF |
| :--- | :--- | :--- |
| **Structure** | Structured JSON (Tree) | Tagged Value Pairs (Flat/Implicit) |
| **Readability** | High (Self-describing) | Low (Numeric codes) |
| **Units** | Explicit (`"millimeter"`) | Implicit / Often undefined |
| **Web** | Native (JSON) | Requires heavy parsing |
| **Extensibility** | Namespaced Extensions | Difficult / Hacky |

## Project Status

**Current Version: Draft 0.1.0**

- **Stable**: Core JSON structure, 2D entities (Line, Arc, Polyline).
- **In Progress**: Manufacturing attributes (CAM), PCB layer definitions.
- **Future**: Complex 3D (B-rep, STEP replacement), Hierarchical assemblies.

We are targeting a **1.0 release in 2026**. Now is the best time to contribute and shape the spec!

## Contributing

We welcome feedback and PRs!
- **Discuss**: Open an issue for feature requests or questions.
- **Code**: Check out the `tools/` folder to help with converters.
- **Spec**: Propose changes to `docs/spec-core.md`.

## License

MIT License. Free for commercial and open-source use.
