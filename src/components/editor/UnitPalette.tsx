import { unitTypePresets } from '../../constants/unitTypePresets';
import { useFloorplanStore } from '../../state/floorplanStore';

export default function UnitPalette() {
  const addUnitFromTemplate = useFloorplanStore((s) => s.addUnitFromTemplate);

  return (
    <div className="panel">
      <h3>Add a unit</h3>
      <ul className="unit-palette">
        {unitTypePresets.map((template) => (
          <li key={template.id}>
            <button onClick={() => addUnitFromTemplate(template)}>
              {template.name}
              <span className="muted">
                {' '}
                {template.defaultWidthIn}×{template.defaultDepthIn}", {template.defaultShelfCount} shelves
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
