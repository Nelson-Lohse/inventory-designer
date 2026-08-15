import { useFloorplanStore } from '../../state/floorplanStore';
import { edgeLength, setEdgeLength } from '../../utils/geometry';

export default function RoomWallLengthPanel() {
  const floorplan = useFloorplanStore((s) => s.floorplans.find((f) => f.id === s.activeFloorplanId));
  const updateFloorplanOutline = useFloorplanStore((s) => s.updateFloorplanOutline);

  if (!floorplan) return null;
  const { outline } = floorplan;

  return (
    <div className="panel">
      <h3>Wall lengths</h3>
      <p className="muted">Type an exact length to resize that wall — the corner it starts from stays put.</p>
      {outline.map((_, i) => (
        <label key={i}>
          Wall {i + 1}
          <input
            type="number"
            step="0.1"
            min={0}
            value={Math.round(edgeLength(outline, i) * 100) / 100}
            onChange={(e) => {
              const next = setEdgeLength(outline, i, Number(e.target.value));
              updateFloorplanOutline(floorplan.id, next);
            }}
          />
        </label>
      ))}
    </div>
  );
}
