/**
 * Free-form string, not a closed enum — new unit categories should be a data
 * change, not a code change. These are just the suggested presets.
 */
export type UnitCategory =
  | 'wire_shelving'
  | 'walk_in_rack'
  | 'cabinet'
  | 'flat_shelf'
  | 'custom';

/** A reusable definition, e.g. "24x60 chrome wire shelving". */
export interface UnitTypeTemplate {
  id: string;
  name: string;
  category: UnitCategory | (string & {});
  defaultWidthIn: number;
  defaultDepthIn: number;
  defaultHeightIn: number;
  defaultShelfCount: number;
  color?: string;
  notes?: string;
}

/**
 * A specific physical unit you own. May start from a UnitTypeTemplate's
 * defaults but can override its own dimensions. floorplanId/x/y/rotationDeg
 * are nullable so a unit can exist in the catalog before it's placed anywhere.
 */
export interface ShelvingUnit {
  id: string;
  unitTypeTemplateId?: string | null;
  name: string;
  widthIn: number;
  depthIn: number;
  heightIn: number;
  shelfCount: number;
  /**
   * How far the unit's bottom sits above the true floor, in inches. 0 for
   * floor-standing (including under-counter — that's just a floor-standing
   * unit short enough to fit under something). Positive for wall-mounted
   * shelving above a counter. Fully custom rather than a fixed set of mount
   * types, so it composes with Shelf.heightFromFloorIn (which is measured
   * from the true floor, not from this unit's own base) for the eventual
   * shelf elevation view and for 3D-aware collision (two units only
   * conflict if their footprints AND their [mountHeightIn, mountHeightIn +
   * heightIn] ranges both overlap).
   */
  mountHeightIn: number;
  floorplanId?: string | null;
  x?: number | null;
  y?: number | null;
  rotationDeg?: number | null;
  createdAt: string;
  updatedAt: string;
}
