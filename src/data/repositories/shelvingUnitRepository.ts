import type { ShelvingUnit } from '../../types';
import { db } from '../db';

export interface ShelvingUnitRepository {
  listByFloorplan(floorplanId: string): Promise<ShelvingUnit[]>;
  listUnplaced(): Promise<ShelvingUnit[]>;
  get(id: string): Promise<ShelvingUnit | undefined>;
  create(unit: ShelvingUnit): Promise<void>;
  update(unit: ShelvingUnit): Promise<void>;
  remove(id: string): Promise<void>;
}

class DexieShelvingUnitRepository implements ShelvingUnitRepository {
  listByFloorplan(floorplanId: string) {
    return db.shelvingUnits.where('floorplanId').equals(floorplanId).toArray();
  }

  listUnplaced() {
    return db.shelvingUnits.filter((u) => !u.floorplanId).toArray();
  }

  get(id: string) {
    return db.shelvingUnits.get(id);
  }

  async create(unit: ShelvingUnit) {
    await db.shelvingUnits.add(unit);
  }

  async update(unit: ShelvingUnit) {
    await db.shelvingUnits.put(unit);
  }

  async remove(id: string) {
    await db.transaction('rw', db.shelvingUnits, db.shelves, async () => {
      await db.shelves.where('shelvingUnitId').equals(id).delete();
      await db.shelvingUnits.delete(id);
    });
  }
}

export const shelvingUnitRepository: ShelvingUnitRepository = new DexieShelvingUnitRepository();
