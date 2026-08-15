import { useFloorplanStore } from '../state/floorplanStore';
import AppShell from '../components/layout/AppShell';
import Toolbar from '../components/editor/Toolbar';
import UnitPalette from '../components/editor/UnitPalette';
import UnitPropertiesPanel from '../components/editor/UnitPropertiesPanel';
import ShelfLabelEditor from '../components/editor/ShelfLabelEditor';
import FloorplanCanvas from '../components/canvas/FloorplanCanvas';

export default function FloorplanEditorPage() {
  const floorplan = useFloorplanStore((s) => s.floorplans.find((f) => f.id === s.activeFloorplanId));

  if (!floorplan) return null;

  return (
    <div className="editor-page">
      <Toolbar />
      <AppShell
        sidebar={
          <>
            <UnitPalette />
            <UnitPropertiesPanel />
            <ShelfLabelEditor />
          </>
        }
      >
        <FloorplanCanvas floorplan={floorplan} />
      </AppShell>
    </div>
  );
}
