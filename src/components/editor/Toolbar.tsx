import { useFloorplanStore } from '../../state/floorplanStore';

export default function Toolbar() {
  const activeFloorplan = useFloorplanStore((s) => s.floorplans.find((f) => f.id === s.activeFloorplanId));
  const selectFloorplan = useFloorplanStore((s) => s.selectFloorplan);

  return (
    <div className="toolbar">
      <button onClick={() => selectFloorplan(null)}>&larr; Floorplans</button>
      <h2>{activeFloorplan?.name ?? 'Untitled floorplan'}</h2>
    </div>
  );
}
