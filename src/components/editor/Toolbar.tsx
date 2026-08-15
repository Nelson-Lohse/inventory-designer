import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';
import { snapVertexToRightAngle } from '../../utils/geometry';

export default function Toolbar() {
  const activeFloorplan = useFloorplanStore((s) => s.floorplans.find((f) => f.id === s.activeFloorplanId));
  const selectFloorplan = useFloorplanStore((s) => s.selectFloorplan);
  const updateFloorplanOutline = useFloorplanStore((s) => s.updateFloorplanOutline);
  const isEditingRoomShape = useEditorStore((s) => s.isEditingRoomShape);
  const toggleRoomShapeEdit = useEditorStore((s) => s.toggleRoomShapeEdit);
  const selectedVertexIndex = useEditorStore((s) => s.selectedVertexIndex);
  const selectVertex = useEditorStore((s) => s.selectVertex);

  return (
    <div className="toolbar">
      <button onClick={() => selectFloorplan(null)}>&larr; Floorplans</button>
      <h2>{activeFloorplan?.name ?? 'Untitled floorplan'}</h2>
      <button
        className={isEditingRoomShape ? 'active' : undefined}
        onClick={toggleRoomShapeEdit}
        style={{ marginLeft: 'auto' }}
      >
        {isEditingRoomShape ? 'Done editing shape' : 'Edit room shape'}
      </button>
      {isEditingRoomShape && selectedVertexIndex !== null && activeFloorplan && (
        <button
          onClick={() => {
            updateFloorplanOutline(
              activeFloorplan.id,
              snapVertexToRightAngle(activeFloorplan.outline, selectedVertexIndex)
            );
            selectVertex(null);
          }}
        >
          Snap corner to 90°
        </button>
      )}
      {isEditingRoomShape && (
        <p className="muted toolbar-hint">
          Drag a corner to reshape — near-right-angle edges snap exactly. Click a midpoint to add a corner.
          Double-click a corner (or select it and press Delete) to remove it.
        </p>
      )}
    </div>
  );
}
