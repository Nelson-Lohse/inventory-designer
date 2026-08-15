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

export function edgeLength(outline: Point[], edgeIndex: number): number {
  const n = outline.length;
  const a = outline[edgeIndex];
  const b = outline[(edgeIndex + 1) % n];
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Sets the length of the edge starting at edgeIndex by moving its END point
 * along the edge's current direction. The start point (and the rest of the
 * shape) doesn't move — only this edge and its immediate neighbor change.
 */
export function setEdgeLength(outline: Point[], edgeIndex: number, newLengthIn: number): Point[] {
  const n = outline.length;
  const start = outline[edgeIndex];
  const endIndex = (edgeIndex + 1) % n;
  const end = outline[endIndex];
  const currentLength = Math.hypot(end.x - start.x, end.y - start.y);
  if (currentLength === 0 || newLengthIn < 0) return outline;
  const ux = (end.x - start.x) / currentLength;
  const uy = (end.y - start.y) / currentLength;
  const newEnd: Point = { x: start.x + ux * newLengthIn, y: start.y + uy * newLengthIn };
  return outline.map((p, i) => (i === endIndex ? newEnd : p));
}

const RIGHT_ANGLE_SNAP_THRESHOLD_DEG = 6;

/**
 * Rotates `point` around `anchor` to the nearest 0/90/180/270 direction,
 * preserving its distance from `anchor`. With a threshold, only snaps when
 * already within that many degrees of an axis (for magnetic drag-snapping);
 * pass null to always snap (for an explicit "make this a right angle" action).
 */
function rotateToNearestAxis(anchor: Point, point: Point, thresholdDeg: number | null): Point {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return point;
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const nearest90 = Math.round(angleDeg / 90) * 90;
  if (thresholdDeg !== null && Math.abs(angleDeg - nearest90) > thresholdDeg) return point;
  const rad = (nearest90 * Math.PI) / 180;
  return { x: anchor.x + Math.cos(rad) * dist, y: anchor.y + Math.sin(rad) * dist };
}

/**
 * Magnetic snapping for a corner being dragged: if the edge to the previous
 * or next corner is close to horizontal/vertical, pulls it exactly there.
 * Applied relative to both neighbors in turn, so an exact rectilinear corner
 * (the common case) satisfies both; a near-miss on just one still snaps that
 * one edge.
 */
export function snapDragToAxes(
  outline: Point[],
  index: number,
  candidate: Point,
  thresholdDeg = RIGHT_ANGLE_SNAP_THRESHOLD_DEG
): Point {
  const n = outline.length;
  const prev = outline[(index - 1 + n) % n];
  const next = outline[(index + 1) % n];
  let p = rotateToNearestAxis(prev, candidate, thresholdDeg);
  p = rotateToNearestAxis(next, p, thresholdDeg);
  return p;
}

/** Intersection of two infinite lines, each given as a point plus a direction angle. Null if parallel. */
function lineIntersection(p1: Point, angle1Deg: number, p2: Point, angle2Deg: number): Point | null {
  const a1 = (angle1Deg * Math.PI) / 180;
  const a2 = (angle2Deg * Math.PI) / 180;
  const d1x = Math.cos(a1);
  const d1y = Math.sin(a1);
  const d2x = Math.cos(a2);
  const d2y = Math.sin(a2);
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-9) return null;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const t = (dx * d2y - dy * d2x) / denom;
  return { x: p1.x + d1x * t, y: p1.y + d1y * t };
}

/**
 * Explicitly forces both edges at a corner to the nearest right angle,
 * regardless of current angle. Finds the point that satisfies BOTH the
 * incoming edge's snapped direction (from prev) AND the outgoing edge's
 * snapped direction (to next) at once, via line intersection — so a wall
 * that's already clean isn't disturbed by snapping its neighbor.
 */
export function snapVertexToRightAngle(outline: Point[], index: number): Point[] {
  const n = outline.length;
  const prev = outline[(index - 1 + n) % n];
  const current = outline[index];
  const next = outline[(index + 1) % n];

  const inAngle = (Math.atan2(current.y - prev.y, current.x - prev.x) * 180) / Math.PI;
  const outAngle = (Math.atan2(next.y - current.y, next.x - current.x) * 180) / Math.PI;
  const snappedIn = Math.round(inAngle / 90) * 90;
  const snappedOut = Math.round(outAngle / 90) * 90;

  const intersection =
    lineIntersection(prev, snappedIn, next, snappedOut) ??
    rotateToNearestAxis(next, rotateToNearestAxis(prev, current, null), null);

  return outline.map((pt, i) => (i === index ? intersection : pt));
}

/** A rectangle's footprint + vertical extent, for collision checks. Matches how ShelvingUnitShape/ZoneShape render. */
export interface PlacedRect {
  x: number;
  y: number;
  widthIn: number;
  depthIn: number;
  rotationDeg: number;
  mountHeightIn: number;
  heightIn: number;
}

/**
 * The 4 corners of a rectangle rotated around its own (x, y) origin —
 * matches Konva's rotation convention (rotation around the Group's local
 * origin, which is where ShelvingUnitShape positions its Rect's top-left).
 */
export function rectCorners(rect: Pick<PlacedRect, 'x' | 'y' | 'widthIn' | 'depthIn' | 'rotationDeg'>): Point[] {
  const rad = (rect.rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const local = [
    { x: 0, y: 0 },
    { x: rect.widthIn, y: 0 },
    { x: rect.widthIn, y: rect.depthIn },
    { x: 0, y: rect.depthIn },
  ];
  return local.map((c) => ({
    x: rect.x + c.x * cos - c.y * sin,
    y: rect.y + c.x * sin + c.y * cos,
  }));
}

function projectOntoAxis(corners: Point[], axis: Point): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const c of corners) {
    const proj = c.x * axis.x + c.y * axis.y;
    min = Math.min(min, proj);
    max = Math.max(max, proj);
  }
  return [min, max];
}

/** Separating Axis Theorem overlap test for two (possibly rotated) rectangles given as corner arrays. */
export function rectsOverlap(cornersA: Point[], cornersB: Point[]): boolean {
  for (const corners of [cornersA, cornersB]) {
    for (let i = 0; i < corners.length; i++) {
      const p1 = corners[i];
      const p2 = corners[(i + 1) % corners.length];
      const axis = { x: -(p2.y - p1.y), y: p2.x - p1.x };
      const [minA, maxA] = projectOntoAxis(cornersA, axis);
      const [minB, maxB] = projectOntoAxis(cornersB, axis);
      if (maxA < minB || maxB < minA) return false;
    }
  }
  return true;
}

/** True only if every corner is inside the polygon — an approximation, but sufficient for room-sized outlines vs. unit-sized rectangles. */
export function rectInsidePolygon(corners: Point[], polygon: Point[]): boolean {
  return corners.every((c) => pointInPolygon(c, polygon));
}

function verticalRangesOverlap(a: PlacedRect, b: PlacedRect): boolean {
  const aTop = a.mountHeightIn + a.heightIn;
  const bTop = b.mountHeightIn + b.heightIn;
  return a.mountHeightIn < bTop && b.mountHeightIn < aTop;
}

/**
 * A placement is valid if it stays inside the room outline AND doesn't
 * share both footprint (XY) and height range (Z) with any other unit — two
 * floor-standing units can't occupy the same spot, but a wall-mounted unit
 * over an under-counter one is fine since their height ranges don't overlap.
 */
export function isValidUnitPlacement(candidate: PlacedRect, outline: Point[], others: PlacedRect[]): boolean {
  const corners = rectCorners(candidate);
  if (!rectInsidePolygon(corners, outline)) return false;
  for (const other of others) {
    if (!verticalRangesOverlap(candidate, other)) continue;
    if (rectsOverlap(corners, rectCorners(other))) return false;
  }
  return true;
}
