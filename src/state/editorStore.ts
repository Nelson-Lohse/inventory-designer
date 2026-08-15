import { create } from 'zustand';

export type ElevationMode = 'front' | 'side';

interface EditorState {
  selectedUnitId: string | null;
  selectedZoneId: string | null;
  selectedVertexIndex: number | null;
  snapToGridEnabled: boolean;
  gridSizeIn: number;
  isEditingRoomShape: boolean;
  /** Briefly set when a placement is rejected by collision, so the shape can flash — auto-clears itself. */
  collisionFlashUnitId: string | null;
  isViewingElevation: boolean;
  elevationMode: ElevationMode;
  selectUnit: (id: string | null) => void;
  selectZone: (id: string | null) => void;
  selectVertex: (index: number | null) => void;
  setSnapToGrid: (enabled: boolean) => void;
  toggleRoomShapeEdit: () => void;
  flashCollision: (unitId: string) => void;
  openElevationView: () => void;
  closeElevationView: () => void;
  setElevationMode: (mode: ElevationMode) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedUnitId: null,
  selectedZoneId: null,
  selectedVertexIndex: null,
  snapToGridEnabled: true,
  gridSizeIn: 1,
  isEditingRoomShape: false,
  collisionFlashUnitId: null,
  isViewingElevation: false,
  elevationMode: 'front',
  selectUnit: (id) => set({ selectedUnitId: id, selectedZoneId: null }),
  selectZone: (id) => set({ selectedZoneId: id, selectedUnitId: null }),
  selectVertex: (index) => set({ selectedVertexIndex: index }),
  setSnapToGrid: (enabled) => set({ snapToGridEnabled: enabled }),
  toggleRoomShapeEdit: () =>
    set((state) => ({
      isEditingRoomShape: !state.isEditingRoomShape,
      selectedUnitId: state.isEditingRoomShape ? state.selectedUnitId : null,
      selectedZoneId: null,
      selectedVertexIndex: null,
    })),
  flashCollision: (unitId) => {
    set({ collisionFlashUnitId: unitId });
    setTimeout(() => {
      if (get().collisionFlashUnitId === unitId) set({ collisionFlashUnitId: null });
    }, 400);
  },
  openElevationView: () => set({ isViewingElevation: true }),
  closeElevationView: () => set({ isViewingElevation: false }),
  setElevationMode: (mode) => set({ elevationMode: mode }),
}));
