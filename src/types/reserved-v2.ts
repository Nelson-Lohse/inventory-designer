/**
 * Not implemented in v1. No UI, no seed data, nothing writes to this type.
 *
 * Exists so the v2 recommendation engine (suggest shelf placement by
 * proximity to point-of-use stations, e.g. cups near the drink station) has
 * categories to reference without a schema migration. ShelfLabel (see
 * types/shelf.ts) already carries an optional itemCategoryId that points at
 * ItemCategory.id below. Zones themselves are active — see types/zone.ts —
 * category-based linkage between the two is what's still deferred.
 */

export interface ItemCategory {
  id: string;
  name: string;
  parentCategoryId?: string | null;
  color?: string;
}
