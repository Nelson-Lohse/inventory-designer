import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';

export default function UnitPropertiesPanel() {
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const selectUnit = useEditorStore((s) => s.selectUnit);
  const unit = useFloorplanStore((s) => s.units.find((u) => u.id === selectedUnitId));
  const updateUnit = useFloorplanStore((s) => s.updateUnit);
  const deleteUnit = useFloorplanStore((s) => s.deleteUnit);

  if (!unit) return null;

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
          onChange={(e) => updateUnit({ ...unit, widthIn: Number(e.target.value) })}
        />
      </label>
      <label>
        Depth (in)
        <input
          type="number"
          value={unit.depthIn}
          onChange={(e) => updateUnit({ ...unit, depthIn: Number(e.target.value) })}
        />
      </label>
      <label>
        Height (in)
        <input
          type="number"
          value={unit.heightIn}
          onChange={(e) => updateUnit({ ...unit, heightIn: Number(e.target.value) })}
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
      <button onClick={() => updateUnit({ ...unit, rotationDeg: ((unit.rotationDeg ?? 0) + 90) % 360 })}>
        Rotate 90°
      </button>
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
