import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';
import ShelfElevationView from '../canvas/ShelfElevationView';

export default function ShelfElevationModal() {
  const isViewingElevation = useEditorStore((s) => s.isViewingElevation);
  const closeElevationView = useEditorStore((s) => s.closeElevationView);
  const elevationMode = useEditorStore((s) => s.elevationMode);
  const setElevationMode = useEditorStore((s) => s.setElevationMode);
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const unit = useFloorplanStore((s) => s.units.find((u) => u.id === selectedUnitId));
  const shelves = useFloorplanStore((s) => (selectedUnitId ? s.shelvesByUnitId[selectedUnitId] : undefined));

  if (!isViewingElevation || !unit || !shelves) return null;

  return (
    <div className="modal-backdrop" onClick={closeElevationView}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{unit.name}</h3>
          <button onClick={closeElevationView}>&times;</button>
        </div>
        <div className="modal-toolbar">
          <button
            className={elevationMode === 'front' ? 'active' : undefined}
            onClick={() => setElevationMode('front')}
          >
            Front view
          </button>
          <button className={elevationMode === 'side' ? 'active' : undefined} onClick={() => setElevationMode('side')}>
            Side view
          </button>
        </div>
        <div className="modal-body">
          <ShelfElevationView unit={unit} shelves={shelves} mode={elevationMode} />
        </div>
      </div>
    </div>
  );
}
