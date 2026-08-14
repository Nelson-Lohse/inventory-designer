import { create } from 'zustand';
import type { Floorplan, ShelvingUnit, Shelf, UnitTypeTemplate } from '../types';
import { floorplanRepository, shelvingUnitRepository, shelfRepository } from '../data';

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return crypto.randomUUID();
}

function makeShelvesForUnit(unit: ShelvingUnit): Shelf[] {
  const count = Math.max(unit.shelfCount, 0);
  return Array.from({ length: count }, (_, levelIndex) => ({
    id: makeId(),
    shelvingUnitId: unit.id,
    levelIndex,
    heightFromFloorIn: count > 0 ? Math.round((unit.heightIn / count) * (levelIndex + 1)) : null,
    labels: [],
  }));
}

interface FloorplanState {
  floorplans: Floorplan[];
  activeFloorplanId: string | null;
  units: ShelvingUnit[];
  shelvesByUnitId: Record<string, Shelf[]>;
  loading: boolean;

  loadFloorplans: () => Promise<void>;
  createFloorplan: (input: Pick<Floorplan, 'name' | 'spaceType' | 'widthIn' | 'depthIn'>) => Promise<Floorplan>;
  deleteFloorplan: (id: string) => Promise<void>;
  selectFloorplan: (id: string | null) => Promise<void>;

  addUnitFromTemplate: (template: UnitTypeTemplate) => Promise<void>;
  updateUnit: (unit: ShelvingUnit) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;

  setShelfLabelText: (shelfId: string, text: string) => Promise<void>;
}

export const useFloorplanStore = create<FloorplanState>((set, get) => ({
  floorplans: [],
  activeFloorplanId: null,
  units: [],
  shelvesByUnitId: {},
  loading: false,

  loadFloorplans: async () => {
    set({ loading: true });
    const floorplans = await floorplanRepository.list();
    set({ floorplans, loading: false });
  },

  createFloorplan: async (input) => {
    const floorplan: Floorplan = {
      id: makeId(),
      name: input.name,
      spaceType: input.spaceType,
      widthIn: input.widthIn,
      depthIn: input.depthIn,
      outline: [
        { x: 0, y: 0 },
        { x: input.widthIn, y: 0 },
        { x: input.widthIn, y: input.depthIn },
        { x: 0, y: input.depthIn },
      ],
      wallThicknessIn: 4,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    await floorplanRepository.create(floorplan);
    set((state) => ({ floorplans: [...state.floorplans, floorplan] }));
    return floorplan;
  },

  deleteFloorplan: async (id) => {
    await floorplanRepository.remove(id);
    set((state) => ({
      floorplans: state.floorplans.filter((f) => f.id !== id),
      activeFloorplanId: state.activeFloorplanId === id ? null : state.activeFloorplanId,
    }));
  },

  selectFloorplan: async (id) => {
    if (!id) {
      set({ activeFloorplanId: null, units: [], shelvesByUnitId: {} });
      return;
    }
    const units = await shelvingUnitRepository.listByFloorplan(id);
    const shelvesByUnitId: Record<string, Shelf[]> = {};
    for (const unit of units) {
      shelvesByUnitId[unit.id] = await shelfRepository.listByShelvingUnit(unit.id);
    }
    set({ activeFloorplanId: id, units, shelvesByUnitId });
  },

  addUnitFromTemplate: async (template) => {
    const floorplanId = get().activeFloorplanId;
    if (!floorplanId) return;
    const unit: ShelvingUnit = {
      id: makeId(),
      unitTypeTemplateId: template.id,
      name: template.name,
      widthIn: template.defaultWidthIn,
      depthIn: template.defaultDepthIn,
      heightIn: template.defaultHeightIn,
      shelfCount: template.defaultShelfCount,
      floorplanId,
      x: 12,
      y: 12,
      rotationDeg: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const shelves = makeShelvesForUnit(unit);
    await shelvingUnitRepository.create(unit);
    for (const shelf of shelves) await shelfRepository.create(shelf);
    set((state) => ({
      units: [...state.units, unit],
      shelvesByUnitId: { ...state.shelvesByUnitId, [unit.id]: shelves },
    }));
  },

  updateUnit: async (unit) => {
    const previous = get().units.find((u) => u.id === unit.id);
    const updated = { ...unit, updatedAt: nowIso() };
    await shelvingUnitRepository.update(updated);

    let shelves = get().shelvesByUnitId[unit.id] ?? [];
    if (previous && previous.shelfCount !== updated.shelfCount) {
      const nextCount = Math.max(updated.shelfCount, 0);
      if (nextCount > shelves.length) {
        const toAdd = Array.from({ length: nextCount - shelves.length }, (_, i) => ({
          id: makeId(),
          shelvingUnitId: unit.id,
          levelIndex: shelves.length + i,
          heightFromFloorIn: null,
          labels: [],
        }));
        for (const shelf of toAdd) await shelfRepository.create(shelf);
        shelves = [...shelves, ...toAdd];
      } else if (nextCount < shelves.length) {
        const toRemove = shelves.slice(nextCount);
        for (const shelf of toRemove) await shelfRepository.remove(shelf.id);
        shelves = shelves.slice(0, nextCount);
      }
    }

    set((state) => ({
      units: state.units.map((u) => (u.id === updated.id ? updated : u)),
      shelvesByUnitId: { ...state.shelvesByUnitId, [unit.id]: shelves },
    }));
  },

  deleteUnit: async (id) => {
    await shelvingUnitRepository.remove(id);
    set((state) => {
      const shelvesByUnitId = { ...state.shelvesByUnitId };
      delete shelvesByUnitId[id];
      return {
        units: state.units.filter((u) => u.id !== id),
        shelvesByUnitId,
      };
    });
  },

  setShelfLabelText: async (shelfId, text) => {
    const state = get();
    let ownerUnitId: string | null = null;
    let updatedShelf: Shelf | null = null;

    for (const [unitId, shelves] of Object.entries(state.shelvesByUnitId)) {
      const shelf = shelves.find((s) => s.id === shelfId);
      if (shelf) {
        ownerUnitId = unitId;
        const trimmed = text.trim();
        updatedShelf = {
          ...shelf,
          labels: trimmed
            ? [
                {
                  id: shelf.labels[0]?.id ?? makeId(),
                  shelfId,
                  text: trimmed,
                  itemCategoryId: null,
                  createdAt: nowIso(),
                },
              ]
            : [],
        };
        break;
      }
    }

    if (!ownerUnitId || !updatedShelf) return;
    await shelfRepository.update(updatedShelf);
    const finalShelf = updatedShelf;
    const finalUnitId = ownerUnitId;
    set((s) => ({
      shelvesByUnitId: {
        ...s.shelvesByUnitId,
        [finalUnitId]: s.shelvesByUnitId[finalUnitId].map((sh) => (sh.id === shelfId ? finalShelf : sh)),
      },
    }));
  },
}));
