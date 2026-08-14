import { create } from 'zustand';

interface EditorState {
  selectedUnitId: string | null;
  snapToGridEnabled: boolean;
  gridSizeIn: number;
  selectUnit: (id: string | null) => void;
  setSnapToGrid: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedUnitId: null,
  snapToGridEnabled: true,
  gridSizeIn: 1,
  selectUnit: (id) => set({ selectedUnitId: id }),
  setSnapToGrid: (enabled) => set({ snapToGridEnabled: enabled }),
}));
