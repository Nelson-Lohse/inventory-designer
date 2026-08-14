import type { Floorplan } from '../../types';
import { db } from '../db';

/**
 * Interface-first so the Dexie-backed implementation can later be swapped
 * for a hosted-DB one (e.g. Supabase) without touching state/components.
 * See ARCHITECTURE.md section 2.
 */
export interface FloorplanRepository {
  list(): Promise<Floorplan[]>;
  get(id: string): Promise<Floorplan | undefined>;
  create(floorplan: Floorplan): Promise<void>;
  update(floorplan: Floorplan): Promise<void>;
  remove(id: string): Promise<void>;
}

class DexieFloorplanRepository implements FloorplanRepository {
  list() {
    return db.floorplans.toArray();
  }

  get(id: string) {
    return db.floorplans.get(id);
  }

  async create(floorplan: Floorplan) {
    await db.floorplans.add(floorplan);
  }

  async update(floorplan: Floorplan) {
    await db.floorplans.put(floorplan);
  }

  async remove(id: string) {
    await db.transaction('rw', db.floorplans, db.shelvingUnits, db.shelves, async () => {
      const units = await db.shelvingUnits.where('floorplanId').equals(id).toArray();
      const unitIds = units.map((u) => u.id);
      if (unitIds.length > 0) {
        await db.shelves.where('shelvingUnitId').anyOf(unitIds).delete();
      }
      await db.shelvingUnits.where('floorplanId').equals(id).delete();
      await db.floorplans.delete(id);
    });
  }
}

export const floorplanRepository: FloorplanRepository = new DexieFloorplanRepository();
