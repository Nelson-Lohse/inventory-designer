import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';

export default function ShelfLabelEditor() {
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const shelves = useFloorplanStore((s) => (selectedUnitId ? s.shelvesByUnitId[selectedUnitId] : undefined));
  const setShelfLabelText = useFloorplanStore((s) => s.setShelfLabelText);
  const setShelfHeight = useFloorplanStore((s) => s.setShelfHeight);

  if (!selectedUnitId || !shelves) return null;

  const sorted = [...shelves].sort((a, b) => b.levelIndex - a.levelIndex);

  return (
    <div className="panel">
      <h3>Shelves</h3>
      <p className="muted">
        Top shelf first. Each shelf's height off the floor is independent — set them however your unit actually is,
        evenly spaced or not.
      </p>
      {sorted.map((shelf, i) => (
        <div className="shelf-row" key={shelf.id}>
          <span className="shelf-row-title">Shelf {sorted.length - i}</span>
          <label>
            Height off floor (in)
            <input
              type="number"
              min={0}
              value={shelf.heightFromFloorIn ?? 0}
              onChange={(e) => setShelfHeight(shelf.id, Number(e.target.value))}
            />
          </label>
          <label>
            What goes here
            <input
              placeholder="What goes here?"
              value={shelf.labels[0]?.text ?? ''}
              onChange={(e) => setShelfLabelText(shelf.id, e.target.value)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
