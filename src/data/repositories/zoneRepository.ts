import type { Zone } from '../../types';
import { db } from '../db';

export interface ZoneRepository {
  listByFloorplan(floorplanId: string): Promise<Zone[]>;
  get(id: string): Promise<Zone | undefined>;
  create(zone: Zone): Promise<void>;
  update(zone: Zone): Promise<void>;
  remove(id: string): Promise<void>;
}

class DexieZoneRepository implements ZoneRepository {
  listByFloorplan(floorplanId: string) {
    return db.zones.where('floorplanId').equals(floorplanId).toArray();
  }

  get(id: string) {
    return db.zones.get(id);
  }

  async create(zone: Zone) {
    await db.zones.add(zone);
  }

  async update(zone: Zone) {
    await db.zones.put(zone);
  }

  async remove(id: string) {
    await db.zones.delete(id);
  }
}

export const zoneRepository: ZoneRepository = new DexieZoneRepository();
