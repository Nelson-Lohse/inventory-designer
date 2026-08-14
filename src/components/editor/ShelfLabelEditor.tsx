import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';

export default function ShelfLabelEditor() {
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const shelves = useFloorplanStore((s) => (selectedUnitId ? s.shelvesByUnitId[selectedUnitId] : undefined));
  const setShelfLabelText = useFloorplanStore((s) => s.setShelfLabelText);

  if (!selectedUnitId || !shelves) return null;

  const sorted = [...shelves].sort((a, b) => b.levelIndex - a.levelIndex);

  return (
    <div className="panel">
      <h3>Shelf labels</h3>
      <p className="muted">Top shelf first.</p>
      {sorted.map((shelf, i) => (
        <label key={shelf.id}>
          Shelf {sorted.length - i}
          <input
            placeholder="What goes here?"
            value={shelf.labels[0]?.text ?? ''}
            onChange={(e) => setShelfLabelText(shelf.id, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
