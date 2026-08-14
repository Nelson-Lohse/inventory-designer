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
