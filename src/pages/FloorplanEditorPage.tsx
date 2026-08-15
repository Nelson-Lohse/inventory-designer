import { useFloorplanStore } from '../state/floorplanStore';
import { useEditorStore } from '../state/editorStore';
import AppShell from '../components/layout/AppShell';
import Toolbar from '../components/editor/Toolbar';
import UnitPalette from '../components/editor/UnitPalette';
import UnitPropertiesPanel from '../components/editor/UnitPropertiesPanel';
import ShelfLabelEditor from '../components/editor/ShelfLabelEditor';
import RoomWallLengthPanel from '../components/editor/RoomWallLengthPanel';
import FloorplanCanvas from '../components/canvas/FloorplanCanvas';

export default function FloorplanEditorPage() {
  const floorplan = useFloorplanStore((s) => s.floorplans.find((f) => f.id === s.activeFloorplanId));
  const isEditingRoomShape = useEditorStore((s) => s.isEditingRoomShape);

  if (!floorplan) return null;

  return (
    <div className="editor-page">
      <Toolbar />
      <AppShell
        sidebar={
          isEditingRoomShape ? (
            <RoomWallLengthPanel />
          ) : (
            <>
              <UnitPalette />
              <UnitPropertiesPanel />
              <ShelfLabelEditor />
            </>
          )
        }
      >
        <FloorplanCanvas floorplan={floorplan} />
      </AppShell>
    </div>
  );
}
