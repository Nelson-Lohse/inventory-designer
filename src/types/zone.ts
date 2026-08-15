/**
 * A named, colored area on a floorplan — e.g. "Drinks", "Bagging", "Window" —
 * for organization and at-a-glance clarity now. In v2 this is what the
 * recommendation engine will suggest shelf placement relative to, once
 * ItemCategory (see types/reserved-v2.ts) is linked in; that linkage doesn't
 * exist yet.
 *
 * Rectangular rather than a freeform polygon (like Floorplan.outline) —
 * every zone example given (drinks, bagging, a drive-thru window) is
 * naturally a rectangular area, so this reuses the same placement model as
 * ShelvingUnit instead of a dedicated polygon editor.
 */
export interface Zone {
  id: string;
  floorplanId: string;
  name: string;
  color: string;
  widthIn: number;
  depthIn: number;
  x: number;
  y: number;
  rotationDeg: number;
  createdAt: string;
  updatedAt: string;
}
