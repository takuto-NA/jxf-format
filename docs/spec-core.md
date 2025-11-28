# JXF Core Specification (Draft 0.1.0)

This document defines the core specification for the JSON eXchange Format (JXF) version 0.1.0.

> [!NOTE]
> **Status**: This specification is currently in **Draft** status. Features marked as "Stable" are expected to remain backward compatible in the 0.x series. Features marked as "Experimental" or "Future" are subject to change.

## 1. File Structure

### 1.1. Top-Level Schema
**Status: Stable**

A JXF file is a JSON object with the following top-level fields:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `asset` | Object | **Yes** | Metadata about the file format and version. |
| `units` | String | **Yes** | The unit system for coordinates (e.g., "millimeter"). |
| `layers` | Array | No | Definitions of layers used in the file. |
| `entities` | Array | **Yes** | A flat list of geometric entities. |
| `extensions` | Object | No | Dictionary of extension data (e.g., "CAM", "PCB"). |
| `extensionsUsed` | Array | No | List of names of extensions used in this file. |
| `extensionsRequired`| Array | No | List of extensions required to properly load/render the file. |
| `metadata` | Object | No | File-level metadata (author, description, etc.). |

### 1.2. Asset Definition
**Status: Stable**

```json
"asset": {
  "format": "JXF",
  "version": "0.1.0",
  "generator": "MyCADExporter v1.0"
}
```

### 1.3. Units and Coordinate System
**Status: Stable**

- **Coordinate System**: Right-handed Cartesian. Z is up.
- **Units**: The `units` field is required.
    - Supported values: `"millimeter"`, `"centimeter"`, `"meter"`, `"inch"`, `"foot"`.
    - **Default**: If missing (invalid per spec but for robustness), parsers should assume `"millimeter"`.
- **Angles**: All angles are in **degrees**.
    - Direction: Counter-clockwise (CCW) is positive.
    - Reference: 0 degrees is typically the +X axis in the XY plane.

### 1.4. Extensions Mechanism
**Status: Stable**

JXF uses a mechanism similar to glTF for extensions.

- `extensions`: Object containing the actual extension data.
- `extensionsUsed`: Array of strings listing all extensions present in the file.
- `extensionsRequired`: Array of strings listing extensions that are critical for understanding the file. If a parser does not support a required extension, it should likely fail or warn the user.

```json
{
  "extensionsUsed": ["JXF_CAM_v1"],
  "extensionsRequired": ["JXF_CAM_v1"],
  "extensions": {
    "JXF_CAM_v1": { ... }
  }
}
```

---

## 2. Entities

**Status: Stable** (Core primitives)

All entities are objects within the `entities` array.

### 2.1. Common Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | **Yes** | The type of entity (e.g., "line", "arc"). |
| `id` | String | **Yes** | Unique identifier for referencing this entity. |
| `layer` | String | No | ID of the layer this entity belongs to. |
| `attributes` | Object | No | Semantic key-value pairs (e.g., material, feature type). |

### 2.2. Line (Status: Stable)
A straight line segment.

```json
{
  "type": "line",
  "id": "e1",
  "start": [0, 0, 0],
  "end": [100, 50, 0],
  "layer": "0"
}
```

### 2.3. Arc / Circle (Status: Stable)
A circular arc.
- **Angles**: In degrees.
- **Full Circle**: `startAngle: 0`, `endAngle: 360`.

```json
{
  "type": "arc",
  "id": "e2",
  "center": [50, 50, 0],
  "radius": 25.0,
  "startAngle": 0,
  "endAngle": 90,
  "layer": "0"
}
```

### 2.4. Polyline (Status: Stable)
A connected series of segments.

- **Points**: Array of coordinates. Can be 2D `[x, y]` or 3D `[x, y, z]`. All points must have the same dimension.
- **Closed**: If `true`, an implicit segment connects the last point to the first.

```json
{
  "type": "polyline",
  "points": [[0,0], [10,0], [10,10]],
  "closed": true,
  "layer": "0"
}
```

### 2.5. Spline (B-Spline) (Status: Experimental)

Currently defined as a basic B-spline. NURBS support is planned.

```json
{
  "type": "spline",
  "degree": 3,
  "controlPoints": [[0,0], [10,50], [50,50], [60,0]],
  "closed": false
}
```

### 2.6. Mesh (Status: Draft)

A 3D mesh defined by vertices and faces. Data can be inline or referenced in binary.

```json
{
  "type": "mesh",
  "vertexCount": 8,
  "faceCount": 12,
  "positionBuffer": {
    "uri": "model.bin",
    "byteOffset": 0,
    "byteLength": 96,
    "componentType": "float32",
    "components": 3
  },
  "indices": [0, 1, 2, ...]
}
```

---

## 3. Hierarchy and Transforms
**Status: Future / Not Implemented**

In version 0.1.0, the `entities` list is flat. There is no scene graph or nested block/instance structure.
- **Future Plan**: We intend to introduce an `instances` or `nodes` concept to support assemblies and re-usable blocks with transform matrices (translation, rotation, scale).

---

## 4. Binary Data Layout (Status: Draft)

For large datasets (Meshes, NURBS control grids), JXF supports external binary files.

- **Endianness**: Little Endian.
- **Structure**: Tightly packed arrays (e.g., Float32Array for vertices).

### Binary Reference Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `uri` | String | Path to the binary file. |
| `byteOffset` | Integer | Offset in bytes from the start of the file. |
| `byteLength` | Integer | Length in bytes of the data buffer. |
| `componentType` | String | Data type of components (e.g., `"float32"`, `"uint32"`, `"uint16"`). |
| `components` | Integer | Number of components per element (e.g., 3 for XYZ). |

---

## 5. Semantic Attributes
**Status: Stable**

Entities can carry arbitrary metadata in the `attributes` object. Recommended common keys:

- `feature`: String (e.g., "hole", "pocket", "thread")
- `material`: String (e.g., "Aluminum 6061")
- `tolerance`: String or Number
- `net`: String (for PCB, e.g., "GND")

```json
"attributes": {
  "feature": "hole",
  "drill_diameter": 5.0
}
```
