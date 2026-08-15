import type { Point } from '../types';

export function snapToGrid(value: number, gridSizeIn: number): number {
  if (gridSizeIn <= 0) return value;
  return Math.round(value / gridSizeIn) * gridSizeIn;
}

export function snapRotation(deg: number): number {
  return Math.round(deg / 90) * 90;
}

export function clampToOutline(point: Point, widthIn: number, depthIn: number): Point {
  return {
    x: Math.min(Math.max(point.x, 0), widthIn),
    y: Math.min(Math.max(point.y, 0), depthIn),
  };
}

export interface PolygonBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  widthIn: number;
  depthIn: number;
}

export function polygonBounds(points: Point[]): PolygonBounds {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, widthIn: maxX - minX, depthIn: maxY - minY };
}

/** Translates the polygon so its bounding box starts at (0, 0). */
export function normalizePolygon(points: Point[]): Point[] {
  const { minX, minY } = polygonBounds(points);
  if (minX === 0 && minY === 0) return points;
  return points.map((p) => ({ x: p.x - minX, y: p.y - minY }));
}

/** Inserts a new vertex at the midpoint of the edge between points[edgeIndex] and the next point. */
export function insertVertexAtEdge(points: Point[], edgeIndex: number): Point[] {
  const a = points[edgeIndex];
  const b = points[(edgeIndex + 1) % points.length];
  const midpoint: Point = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const next = [...points];
  next.splice(edgeIndex + 1, 0, midpoint);
  return next;
}

/** Removes the vertex at index, refusing to drop below a triangle (3 points). */
export function removeVertex(points: Point[], index: number): Point[] {
  if (points.length <= 3) return points;
  return points.filter((_, i) => i !== index);
}

/** Point-in-polygon test (ray casting). Used for wall/outline collision checks. */
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersects = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}
