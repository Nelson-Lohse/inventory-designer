// TODO: Dexie database instance + schema (tables + indexes) for Floorplan,
// UnitTypeTemplate, ShelvingUnit, Shelf, ShelfLabel — see src/types.
//
// Use Dexie's versioned .stores() migrations from the start so future schema
// changes (v2 category fields, v3 constraint data) don't require hand-rolled
// IndexedDB upgrade logic. See ARCHITECTURE.md section 2.

export {};
