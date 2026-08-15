import { Fragment } from 'react';
import { Stage, Layer, Line, Rect, Text } from 'react-konva';
import type { ShelvingUnit, Shelf } from '../../types';
import type { ElevationMode } from '../../state/editorStore';

interface Props {
  unit: ShelvingUnit;
  shelves: Shelf[];
  mode: ElevationMode;
}

const PX_PER_INCH = 3;
const LEFT_MARGIN = 60;
const RIGHT_MARGIN = 130;
const TOP_MARGIN = 24;
const BOTTOM_MARGIN = 44;
const SHELF_THICKNESS_PX = 5;

/**
 * A to-scale front or side elevation of a single unit — floor line, the
 * unit's own outer frame, and each shelf as a horizontal band at its true
 * height off the floor. Dimensions only for now (no item boxes) — see
 * types/shelf.ts and the v2 roadmap for why.
 */
export default function ShelfElevationView({ unit, shelves, mode }: Props) {
  const spanIn = mode === 'front' ? unit.widthIn : unit.depthIn;
  const totalHeightIn = unit.mountHeightIn + unit.heightIn;

  const spanPx = spanIn * PX_PER_INCH;
  const heightPx = totalHeightIn * PX_PER_INCH;

  const canvasWidth = LEFT_MARGIN + spanPx + RIGHT_MARGIN;
  const canvasHeight = TOP_MARGIN + heightPx + BOTTOM_MARGIN;
  const floorY = TOP_MARGIN + heightPx;

  const yForHeight = (hIn: number) => floorY - hIn * PX_PER_INCH;
  const unitTopY = yForHeight(totalHeightIn);
  const unitBottomY = yForHeight(unit.mountHeightIn);

  const sorted = [...shelves].sort((a, b) => a.levelIndex - b.levelIndex);

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer x={LEFT_MARGIN} y={0}>
        <Line points={[-24, floorY, spanPx + 24, floorY]} stroke="#292524" strokeWidth={2} />
        <Text text="Floor" x={-56} y={floorY - 6} fontSize={10} fill="#57534e" />

        {unit.mountHeightIn > 0 && (
          <>
            <Line
              points={[spanPx / 2, floorY, spanPx / 2, unitBottomY]}
              stroke="#94a3b8"
              strokeWidth={1}
              dash={[4, 4]}
            />
            <Text
              text={`${unit.mountHeightIn}" clearance`}
              x={spanPx / 2 + 8}
              y={(floorY + unitBottomY) / 2 - 6}
              fontSize={10}
              fill="#64748b"
            />
          </>
        )}

        <Rect
          x={0}
          y={unitTopY}
          width={spanPx}
          height={unitBottomY - unitTopY}
          stroke="#1e3a8a"
          strokeWidth={2}
          fill="#eff6ff"
        />
        <Text text={`${unit.heightIn}" tall`} x={-56} y={(unitTopY + unitBottomY) / 2 - 6} fontSize={10} fill="#334155" />

        {sorted.map((shelf) => {
          if (shelf.heightFromFloorIn == null) return null;
          const y = yForHeight(shelf.heightFromFloorIn);
          const label = shelf.labels[0]?.text;
          return (
            <Fragment key={shelf.id}>
              <Rect x={0} y={y - SHELF_THICKNESS_PX / 2} width={spanPx} height={SHELF_THICKNESS_PX} fill="#78716c" />
              <Text
                text={`${shelf.heightFromFloorIn}"${label ? ` — ${label}` : ''}`}
                x={spanPx + 8}
                y={y - 6}
                fontSize={10}
                fill="#334155"
                width={RIGHT_MARGIN - 16}
              />
            </Fragment>
          );
        })}

        <Text
          text={`${spanIn}" ${mode === 'front' ? 'wide' : 'deep'}`}
          x={0}
          y={floorY + 16}
          width={spanPx}
          align="center"
          fontSize={11}
          fill="#334155"
        />
      </Layer>
    </Stage>
  );
}
