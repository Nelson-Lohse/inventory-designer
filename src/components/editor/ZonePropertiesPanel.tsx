import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';

export default function ZonePropertiesPanel() {
  const selectedZoneId = useEditorStore((s) => s.selectedZoneId);
  const selectZone = useEditorStore((s) => s.selectZone);
  const zone = useFloorplanStore((s) => s.zones.find((z) => z.id === selectedZoneId));
  const updateZone = useFloorplanStore((s) => s.updateZone);
  const deleteZone = useFloorplanStore((s) => s.deleteZone);

  if (!zone) return null;

  return (
    <div className="panel">
      <h3>Zone properties</h3>
      <label>
        Name
        <input value={zone.name} onChange={(e) => updateZone({ ...zone, name: e.target.value })} />
      </label>
      <label>
        Color
        <input
          type="color"
          value={zone.color}
          onChange={(e) => updateZone({ ...zone, color: e.target.value })}
        />
      </label>
      <label>
        Width (in)
        <input
          type="number"
          value={zone.widthIn}
          onChange={(e) => updateZone({ ...zone, widthIn: Number(e.target.value) })}
        />
      </label>
      <label>
        Depth (in)
        <input
          type="number"
          value={zone.depthIn}
          onChange={(e) => updateZone({ ...zone, depthIn: Number(e.target.value) })}
        />
      </label>
      <button onClick={() => updateZone({ ...zone, rotationDeg: (zone.rotationDeg + 90) % 360 })}>
        Rotate 90°
      </button>
      <button
        className="danger"
        onClick={() => {
          deleteZone(zone.id);
          selectZone(null);
        }}
      >
        Delete zone
      </button>
    </div>
  );
}
