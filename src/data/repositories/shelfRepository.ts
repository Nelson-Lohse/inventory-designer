import type { Shelf } from '../../types';
import { db } from '../db';

export interface ShelfRepository {
  listByShelvingUnit(shelvingUnitId: string): Promise<Shelf[]>;
  get(id: string): Promise<Shelf | undefined>;
  create(shelf: Shelf): Promise<void>;
  update(shelf: Shelf): Promise<void>;
  remove(id: string): Promise<void>;
}

class DexieShelfRepository implements ShelfRepository {
  listByShelvingUnit(shelvingUnitId: string) {
    return db.shelves.where('shelvingUnitId').equals(shelvingUnitId).sortBy('levelIndex');
  }

  get(id: string) {
    return db.shelves.get(id);
  }

  async create(shelf: Shelf) {
    await db.shelves.add(shelf);
  }

  async update(shelf: Shelf) {
    await db.shelves.put(shelf);
  }

  async remove(id: string) {
    await db.shelves.delete(id);
  }
}

export const shelfRepository: ShelfRepository = new DexieShelfRepository();
