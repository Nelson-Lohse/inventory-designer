import { useEffect, useState, type FormEvent } from 'react';
import { useFloorplanStore } from '../state/floorplanStore';
import type { SpaceType } from '../types';

const SPACE_TYPES: { value: SpaceType; label: string }[] = [
  { value: 'dry_storage', label: 'Dry storage' },
  { value: 'walk_in_cooler', label: 'Walk-in cooler' },
  { value: 'walk_in_freezer', label: 'Walk-in freezer' },
  { value: 'shelving_area', label: 'Shelving area' },
  { value: 'custom', label: 'Custom' },
];

export default function FloorplanListPage() {
  const floorplans = useFloorplanStore((s) => s.floorplans);
  const loadFloorplans = useFloorplanStore((s) => s.loadFloorplans);
  const createFloorplan = useFloorplanStore((s) => s.createFloorplan);
  const selectFloorplan = useFloorplanStore((s) => s.selectFloorplan);
  const deleteFloorplan = useFloorplanStore((s) => s.deleteFloorplan);

  const [name, setName] = useState('');
  const [spaceType, setSpaceType] = useState<SpaceType>('dry_storage');
  const [widthIn, setWidthIn] = useState(120);
  const [depthIn, setDepthIn] = useState(96);

  useEffect(() => {
    loadFloorplans();
  }, [loadFloorplans]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const floorplan = await createFloorplan({ name: name.trim(), spaceType, widthIn, depthIn });
    setName('');
    selectFloorplan(floorplan.id);
  };

  return (
    <div className="list-page">
      <h1>Inventory Designer</h1>

      <section>
        <h2>Your floorplans</h2>
        {floorplans.length === 0 && <p className="muted">No floorplans yet — create one below.</p>}
        <ul className="floorplan-list">
          {floorplans.map((f) => (
            <li key={f.id}>
              <button onClick={() => selectFloorplan(f.id)}>
                {f.name}
                <span className="muted">
                  {' '}
                  — {f.spaceType.replace(/_/g, ' ')}, {f.widthIn}×{f.depthIn}"
                </span>
              </button>
              <button className="danger" onClick={() => deleteFloorplan(f.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>New floorplan</h2>
        <form onSubmit={handleCreate} className="new-floorplan-form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dry Storage Room" />
          </label>
          <label>
            Space type
            <select value={spaceType} onChange={(e) => setSpaceType(e.target.value as SpaceType)}>
              {SPACE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Width (in)
            <input type="number" value={widthIn} onChange={(e) => setWidthIn(Number(e.target.value))} />
          </label>
          <label>
            Depth (in)
            <input type="number" value={depthIn} onChange={(e) => setDepthIn(Number(e.target.value))} />
          </label>
          <button type="submit">Create floorplan</button>
        </form>
      </section>
    </div>
  );
}
