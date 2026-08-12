import type { ShelvingUnit } from '../../types';

export interface ShelvingUnitRepository {
  listByFloorplan(floorplanId: string): Promise<ShelvingUnit[]>;
  listUnplaced(): Promise<ShelvingUnit[]>;
  get(id: string): Promise<ShelvingUnit | undefined>;
  create(unit: ShelvingUnit): Promise<void>;
  update(unit: ShelvingUnit): Promise<void>;
  remove(id: string): Promise<void>;
}

// TODO: DexieShelvingUnitRepository implements ShelvingUnitRepository
