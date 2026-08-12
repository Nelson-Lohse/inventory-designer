import type { Point } from './geometry';

export type SpaceType =
  | 'dry_storage'
  | 'walk_in_cooler'
  | 'walk_in_freezer'
  | 'shelving_area'
  | 'custom';

export interface Floorplan {
  id: string;
  name: string;
  spaceType: SpaceType;
  /** Bounding size of the canvas, in inches. */
  widthIn: number;
  depthIn: number;
  /** Room/wall boundary polygon, in inches, relative to the floorplan origin. */
  outline: Point[];
  wallThicknessIn: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
