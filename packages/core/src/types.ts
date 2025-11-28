export interface JXF {
    asset: Asset;
    units: string;
    layers?: Layer[];
    entities: Entity[];
    extensions?: Record<string, any>;
    extensionsUsed?: string[];
    extensionsRequired?: string[];
    metadata?: Record<string, any>;
}

export interface Asset {
    format: "JXF";
    version: string;
    generator?: string;
}

export interface Layer {
    id: string;
    name?: string;
    color?: string; // Hex "#RRGGBB" or name
    visible?: boolean;
}

export type Entity = Line | Arc | Polyline | Spline | Mesh;

export interface BaseEntity {
    type: string;
    id: string;
    layer?: string;
    attributes?: Record<string, any>;
}

export interface Line extends BaseEntity {
    type: "line";
    start: [number, number, number];
    end: [number, number, number];
    thickness?: number; // Default 0
}

export interface Arc extends BaseEntity {
    type: "arc";
    center: [number, number, number];
    radius: number;
    startAngle?: number; // Degrees, Default 0
    endAngle?: number;   // Degrees, Default 360
    thickness?: number; // Default 0
}

export type CapStyle = "butt" | "round" | "square";
export type JoinStyle = "miter" | "round" | "bevel";

export interface Polyline extends BaseEntity {
    type: "polyline";
    points: ([number, number] | [number, number, number])[];
    closed?: boolean;
    thickness?: number; // Default 0
    cap?: CapStyle;     // Default "butt"
    join?: JoinStyle;   // Default "miter"
}

export interface Spline extends BaseEntity {
    type: "spline";
    degree: number;
    controlPoints: ([number, number] | [number, number, number])[];
    knots?: number[];
    closed?: boolean;
}

export interface Mesh extends BaseEntity {
    type: "mesh";
    vertexCount: number;
    faceCount: number;
    // Simplified for core definition, binary data handling will be in loaders
    indices?: number[];
    positionBuffer?: BinaryReference;
}

export interface BinaryReference {
    uri: string;
    byteOffset: number;
    byteLength: number;
    componentType: string;
    components: number;
}
