/**
 * Not implemented in v1. No UI, no seed data, nothing writes to these types.
 *
 * They exist so the v2 recommendation engine (suggest shelf placement by
 * proximity to point-of-use stations, e.g. cups near the drink station) has
 * categories and zones to reference without a schema migration. ShelfLabel
 * (see types/shelf.ts) already carries an optional itemCategoryId that
 * points at ItemCategory.id below.
 */

export interface ItemCategory {
  id: string;
  name: string;
  parentCategoryId?: string | null;
  color?: string;
}

/** A point-of-use area on a floorplan, e.g. "Drink Station". */
export interface StationZone {
  id: string;
  floorplanId: string;
  name: string;
  boundary: { x: number; y: number }[];
  relatedCategoryIds: string[];
}
