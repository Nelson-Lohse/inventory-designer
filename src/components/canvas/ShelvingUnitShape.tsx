import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import type { ShelvingUnit } from '../../types';

interface Props {
  unit: ShelvingUnit;
  pxPerInch: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (xIn: number, yIn: number) => void;
}

export default function ShelvingUnitShape({ unit, pxPerInch, isSelected, onSelect, onDragEnd }: Props) {
  const widthPx = unit.widthIn * pxPerInch;
  const depthPx = unit.depthIn * pxPerInch;

  return (
    <Group
      x={(unit.x ?? 0) * pxPerInch}
      y={(unit.y ?? 0) * pxPerInch}
      rotation={unit.rotationDeg ?? 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        onDragEnd(e.target.x() / pxPerInch, e.target.y() / pxPerInch);
      }}
    >
      <Rect
        width={widthPx}
        height={depthPx}
        fill="#bfdbfe"
        stroke={isSelected ? '#2563eb' : '#1e3a8a'}
        strokeWidth={isSelected ? 3 : 1.5}
        cornerRadius={2}
      />
      <Text text={unit.name} fontSize={11} padding={4} fill="#1e293b" width={widthPx} />
      <Text
        text={`${unit.shelfCount} shelves`}
        fontSize={10}
        padding={4}
        y={depthPx - 16}
        fill="#475569"
        width={widthPx}
      />
    </Group>
  );
}
