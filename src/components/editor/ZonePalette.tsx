import { useFloorplanStore } from '../../state/floorplanStore';

export default function ZonePalette() {
  const addZone = useFloorplanStore((s) => s.addZone);

  return (
    <div className="panel">
      <h3>Zones</h3>
      <p className="muted">
        Mark an area for organization — e.g. "Drinks", "Bagging", "Window" — not used for placement logic yet.
      </p>
      <button onClick={() => addZone()}>Add zone</button>
    </div>
  );
}
