import type { Shelf } from '../../types';

export interface ShelfRepository {
  listByShelvingUnit(shelvingUnitId: string): Promise<Shelf[]>;
  get(id: string): Promise<Shelf | undefined>;
  create(shelf: Shelf): Promise<void>;
  update(shelf: Shelf): Promise<void>;
  remove(id: string): Promise<void>;
}

// TODO: DexieShelfRepository implements ShelfRepository
