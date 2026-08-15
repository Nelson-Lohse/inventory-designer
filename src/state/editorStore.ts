import { create } from 'zustand';

interface EditorState {
  selectedUnitId: string | null;
  snapToGridEnabled: boolean;
  gridSizeIn: number;
  isEditingRoomShape: boolean;
  selectUnit: (id: string | null) => void;
  setSnapToGrid: (enabled: boolean) => void;
  toggleRoomShapeEdit: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedUnitId: null,
  snapToGridEnabled: true,
  gridSizeIn: 1,
  isEditingRoomShape: false,
  selectUnit: (id) => set({ selectedUnitId: id }),
  setSnapToGrid: (enabled) => set({ snapToGridEnabled: enabled }),
  toggleRoomShapeEdit: () =>
    set((state) => ({
      isEditingRoomShape: !state.isEditingRoomShape,
      selectedUnitId: state.isEditingRoomShape ? state.selectedUnitId : null,
    })),
}));
