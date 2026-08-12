import type { Floorplan } from '../../types';

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

// TODO: DexieFloorplanRepository implements FloorplanRepository
