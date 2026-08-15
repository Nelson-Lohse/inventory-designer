import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';

export default function UnitPropertiesPanel() {
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const selectUnit = useEditorStore((s) => s.selectUnit);
  const flashCollision = useEditorStore((s) => s.flashCollision);
  const openElevationView = useEditorStore((s) => s.openElevationView);
  const unit = useFloorplanStore((s) => s.units.find((u) => u.id === selectedUnitId));
  const updateUnit = useFloorplanStore((s) => s.updateUnit);
  const deleteUnit = useFloorplanStore((s) => s.deleteUnit);

  if (!unit) return null;

  const applyOrFlash = async (next: typeof unit) => {
    const applied = await updateUnit(next);
    if (!applied) flashCollision(unit.id);
  };

  return (
    <div className="panel">
      <h3>Unit properties</h3>
      <label>
        Name
        <input value={unit.name} onChange={(e) => updateUnit({ ...unit, name: e.target.value })} />
      </label>
      <label>
        Width (in)
        <input
          type="number"
          value={unit.widthIn}
          onChange={(e) => applyOrFlash({ ...unit, widthIn: Number(e.target.value) })}
        />
      </label>
      <label>
        Depth (in)
        <input
          type="number"
          value={unit.depthIn}
          onChange={(e) => applyOrFlash({ ...unit, depthIn: Number(e.target.value) })}
        />
      </label>
      <label>
        Height (in)
        <input
          type="number"
          value={unit.heightIn}
          onChange={(e) => applyOrFlash({ ...unit, heightIn: Number(e.target.value) })}
        />
      </label>
      <label>
        Shelves
        <input
          type="number"
          min={1}
          value={unit.shelfCount}
          onChange={(e) => updateUnit({ ...unit, shelfCount: Math.max(1, Number(e.target.value)) })}
        />
      </label>
      <label>
        Height off floor (in)
        <input
          type="number"
          min={0}
          value={unit.mountHeightIn}
          onChange={(e) => applyOrFlash({ ...unit, mountHeightIn: Math.max(0, Number(e.target.value)) })}
        />
      </label>
      <p className="muted">
        0 = floor-standing (including under-counter). Positive = wall-mounted, measured from the true floor to the
        bottom of the unit.
      </p>
      <button onClick={() => applyOrFlash({ ...unit, rotationDeg: ((unit.rotationDeg ?? 0) + 90) % 360 })}>
        Rotate 90°
      </button>
      <button onClick={openElevationView}>View elevation</button>
      <button
        className="danger"
        onClick={() => {
          deleteUnit(unit.id);
          selectUnit(null);
        }}
      >
        Delete unit
      </button>
    </div>
  );
}
