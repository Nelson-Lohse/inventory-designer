import { Stage, Layer, Line } from 'react-konva';
import type Konva from 'konva';
import type { Floorplan } from '../../types';
import { useFloorplanStore } from '../../state/floorplanStore';
import { useEditorStore } from '../../state/editorStore';
import { snapToGrid } from '../../utils/geometry';
import RoomOutline from './RoomOutline';
import RoomShapeHandles from './RoomShapeHandles';
import ShelvingUnitShape from './ShelvingUnitShape';
import ZoneShape from './ZoneShape';

const PX_PER_INCH = 4;
const CANVAS_MARGIN = 20;
const GRID_STEP_IN = 12;

interface Props {
  floorplan: Floorplan;
}

export default function FloorplanCanvas({ floorplan }: Props) {
  const { widthIn, depthIn, outline } = floorplan;
  const units = useFloorplanStore((s) => s.units);
  const updateUnit = useFloorplanStore((s) => s.updateUnit);
  const zones = useFloorplanStore((s) => s.zones);
  const updateZone = useFloorplanStore((s) => s.updateZone);
  const updateFloorplanOutline = useFloorplanStore((s) => s.updateFloorplanOutline);
  const selectedUnitId = useEditorStore((s) => s.selectedUnitId);
  const selectUnit = useEditorStore((s) => s.selectUnit);
  const selectedZoneId = useEditorStore((s) => s.selectedZoneId);
  const selectZone = useEditorStore((s) => s.selectZone);
  const snapToGridEnabled = useEditorStore((s) => s.snapToGridEnabled);
  const gridSizeIn = useEditorStore((s) => s.gridSizeIn);
  const isEditingRoomShape = useEditorStore((s) => s.isEditingRoomShape);
  const collisionFlashUnitId = useEditorStore((s) => s.collisionFlashUnitId);
  const flashCollision = useEditorStore((s) => s.flashCollision);

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

  const handleUnitDragEnd = async (unitId: string, xIn: number, yIn: number): Promise<boolean> => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return false;
    const nextX = snapToGridEnabled ? snapToGrid(xIn, gridSizeIn) : xIn;
    const nextY = snapToGridEnabled ? snapToGrid(yIn, gridSizeIn) : yIn;
    const applied = await updateUnit({ ...unit, x: nextX, y: nextY });
    if (!applied) flashCollision(unitId);
    return applied;
  };

  const handleZoneDragEnd = (zoneId: string, xIn: number, yIn: number) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return;
    const nextX = snapToGridEnabled ? snapToGrid(xIn, gridSizeIn) : xIn;
    const nextY = snapToGridEnabled ? snapToGrid(yIn, gridSizeIn) : yIn;
    updateZone({ ...zone, x: nextX, y: nextY });
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
        <RoomOutline outline={outline} pxPerInch={PX_PER_INCH} />
        {gridLines}
        {zones.map((zone) => (
          <ZoneShape
            key={zone.id}
            zone={zone}
            pxPerInch={PX_PER_INCH}
            isSelected={zone.id === selectedZoneId}
            draggable={!isEditingRoomShape}
            onSelect={() => selectZone(zone.id)}
            onDragEnd={(xIn, yIn) => handleZoneDragEnd(zone.id, xIn, yIn)}
          />
        ))}
        {units.map((unit) => (
          <ShelvingUnitShape
            key={unit.id}
            unit={unit}
            pxPerInch={PX_PER_INCH}
            isSelected={unit.id === selectedUnitId}
            draggable={!isEditingRoomShape}
            dimmed={isEditingRoomShape}
            rejected={unit.id === collisionFlashUnitId}
            onSelect={() => selectUnit(unit.id)}
            onDragEnd={(xIn, yIn) => handleUnitDragEnd(unit.id, xIn, yIn)}
          />
        ))}
        {isEditingRoomShape && (
          <RoomShapeHandles
            outline={outline}
            pxPerInch={PX_PER_INCH}
            gridSizeIn={gridSizeIn}
            onChange={(next) => updateFloorplanOutline(floorplan.id, next)}
          />
        )}
      </Layer>
    </Stage>
  );
}
