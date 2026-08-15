import { Group, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import type { ShelvingUnit } from '../../types';

interface Props {
  unit: ShelvingUnit;
  pxPerInch: number;
  isSelected: boolean;
  draggable?: boolean;
  dimmed?: boolean;
  rejected?: boolean;
  onSelect: () => void;
  /** Returns whether the move was applied — false means it collided and was rejected. */
  onDragEnd: (xIn: number, yIn: number) => Promise<boolean>;
}

export default function ShelvingUnitShape({
  unit,
  pxPerInch,
  isSelected,
  draggable = true,
  dimmed = false,
  rejected = false,
  onSelect,
  onDragEnd,
}: Props) {
  const widthPx = unit.widthIn * pxPerInch;
  const depthPx = unit.depthIn * pxPerInch;
  const isElevated = unit.mountHeightIn > 0;
  const subtitle = isElevated ? `${unit.shelfCount} shelves · @${unit.mountHeightIn}"` : `${unit.shelfCount} shelves`;

  return (
    <Group
      x={(unit.x ?? 0) * pxPerInch}
      y={(unit.y ?? 0) * pxPerInch}
      rotation={unit.rotationDeg ?? 0}
      draggable={draggable}
      opacity={dimmed ? 0.4 : 1}
      listening={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={async (e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target;
        const applied = await onDragEnd(node.x() / pxPerInch, node.y() / pxPerInch);
        if (!applied) {
          // The store rejected the move, so its x/y props are unchanged from
          // before the drag — react-konva's prop diff won't see a change and
          // won't reposition the node on its own, so snap it back explicitly.
          node.position({ x: (unit.x ?? 0) * pxPerInch, y: (unit.y ?? 0) * pxPerInch });
        }
      }}
    >
      <Rect
        width={widthPx}
        height={depthPx}
        fill={rejected ? '#fecaca' : isElevated ? '#ede9fe' : '#bfdbfe'}
        stroke={rejected ? '#b91c1c' : isSelected ? '#2563eb' : isElevated ? '#6d28d9' : '#1e3a8a'}
        strokeWidth={isSelected || rejected ? 3 : 1.5}
        dash={isElevated ? [5, 3] : undefined}
        cornerRadius={2}
      />
      <Text text={unit.name} fontSize={11} padding={4} fill="#1e293b" width={widthPx} />
      <Text text={subtitle} fontSize={10} padding={4} y={depthPx - 16} fill="#475569" width={widthPx} />
    </Group>
  );
}
