import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import type { Zone } from '../../types';

interface Props {
  zone: Zone;
  pxPerInch: number;
  isSelected: boolean;
  draggable?: boolean;
  onSelect: () => void;
  onDragEnd: (xIn: number, yIn: number) => void;
}

/**
 * Translucent colored region, drawn between the room outline and shelving
 * units — a zone is a floor-area annotation, not a physical object, so it
 * shouldn't visually compete with real shelving.
 */
export default function ZoneShape({ zone, pxPerInch, isSelected, draggable = true, onSelect, onDragEnd }: Props) {
  const widthPx = zone.widthIn * pxPerInch;
  const depthPx = zone.depthIn * pxPerInch;

  return (
    <Group
      x={zone.x * pxPerInch}
      y={zone.y * pxPerInch}
      rotation={zone.rotationDeg}
      draggable={draggable}
      listening={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        onDragEnd(e.target.x() / pxPerInch, e.target.y() / pxPerInch);
      }}
    >
      <Rect
        width={widthPx}
        height={depthPx}
        fill={zone.color}
        opacity={0.28}
        stroke={zone.color}
        strokeWidth={isSelected ? 3 : 1.5}
        dash={isSelected ? undefined : [6, 4]}
      />
      <Text text={zone.name} fontSize={12} fontStyle="bold" padding={4} fill="#1e293b" width={widthPx} />
    </Group>
  );
}
