import Dexie, { type Table } from 'dexie';
import type { Floorplan, UnitTypeTemplate, ShelvingUnit, Shelf } from '../types';

/**
 * Versioned .stores() migrations so future schema changes (v2 category
 * fields, v3 constraint data) don't require hand-rolled IndexedDB upgrade
 * logic. See ARCHITECTURE.md section 2.
 */
class InventoryDesignerDB extends Dexie {
  floorplans!: Table<Floorplan, string>;
  unitTypeTemplates!: Table<UnitTypeTemplate, string>;
  shelvingUnits!: Table<ShelvingUnit, string>;
  shelves!: Table<Shelf, string>;

  constructor() {
    super('inventory-designer');
    this.version(1).stores({
      floorplans: 'id, name, spaceType',
      unitTypeTemplates: 'id, name, category',
      shelvingUnits: 'id, floorplanId, unitTypeTemplateId',
      shelves: 'id, shelvingUnitId, levelIndex',
    });
  }
}

export const db = new InventoryDesignerDB();
