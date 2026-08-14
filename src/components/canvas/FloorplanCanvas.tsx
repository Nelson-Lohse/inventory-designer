import { Stage, Layer, Line } from 'react-konva';
import type Konva from 'konva';
import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';
import { snapToGrid } from '../../utils/geometry';
import RoomOutline from './RoomOutline';
import ShelvingUnitShape from './ShelvingUnitShape';

const PX_PER_INCH = 4;
const CANVAS_MARGIN = 20;
const GRID_STEP_IN = 12;

interface Props {
  widthIn: number;
  depthIn: number;
}

export default function FloorplanCanvas({ widthIn, depthIn }: Props) {
  const units = useFloorplanStore((s) => s.units);
  const updateUnit = useFloorplanStore((s) => s.updateUnit);
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const selectUnit = useEditorStore((s) => s.selectUnit);
  const snapToGridEnabled = useEditorStore((s) => s.snapToGridEnabled);
  const gridSizeIn = useEditorStore((s) => s.gridSizeIn);

  const stageWidth = widthIn * PX_PER_INCH + CANVAS_MARGIN * 2;
  const stageHeight = depthIn * PX_PER_INCH + CANVAS_MARGIN * 2;

  const gridLines = [];
  for (let x = 0; x <= widthIn; x += GRID_STEP_IN) {
    gridLines.push(
      <Line
        key={`v${x}`}
        points={[x * PX_PER_INCH, 0, x * PX_PER_INCH, depthIn * PX_PER_INCH]}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }
  for (let y = 0; y <= depthIn; y += GRID_STEP_IN) {
    gridLines.push(
      <Line
        key={`h${y}`}
        points={[0, y * PX_PER_INCH, widthIn * PX_PER_INCH, y * PX_PER_INCH]}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  const handleUnitDragEnd = (unitId: string, xIn: number, yIn: number) => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;
    const nextX = snapToGridEnabled ? snapToGrid(xIn, gridSizeIn) : xIn;
    const nextY = snapToGridEnabled ? snapToGrid(yIn, gridSizeIn) : yIn;
    updateUnit({ ...unit, x: nextX, y: nextY });
  };

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage()) selectUnit(null);
      }}
    >
      <Layer x={CANVAS_MARGIN} y={CANVAS_MARGIN}>
        <RoomOutline widthIn={widthIn} depthIn={depthIn} pxPerInch={PX_PER_INCH} />
        {gridLines}
        {units.map((unit) => (
          <ShelvingUnitShape
            key={unit.id}
            unit={unit}
            pxPerInch={PX_PER_INCH}
            isSelected={unit.id === selectedUnitId}
            onSelect={() => selectUnit(unit.id)}
            onDragEnd={(xIn, yIn) => handleUnitDragEnd(unit.id, xIn, yIn)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
