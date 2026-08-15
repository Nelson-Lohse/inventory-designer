import { create } from 'zustand';

interface EditorState {
  selectedUnitId: string | null;
  selectedVertexIndex: number | null;
  snapToGridEnabled: boolean;
  gridSizeIn: number;
  isEditingRoomShape: boolean;
  selectUnit: (id: string | null) => void;
  selectVertex: (index: number | null) => void;
  setSnapToGrid: (enabled: boolean) => void;
  toggleRoomShapeEdit: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedUnitId: null,
  selectedVertexIndex: null,
  snapToGridEnabled: true,
  gridSizeIn: 1,
  isEditingRoomShape: false,
  selectUnit: (id) => set({ selectedUnitId: id }),
  selectVertex: (index) => set({ selectedVertexIndex: index }),
  setSnapToGrid: (enabled) => set({ snapToGridEnabled: enabled }),
  toggleRoomShapeEdit: () =>
    set((state) => ({
      isEditingRoomShape: !state.isEditingRoomShape,
      selectedUnitId: state.isEditingRoomShape ? state.selectedUnitId : null,
      selectedVertexIndex: null,
    })),
}));
