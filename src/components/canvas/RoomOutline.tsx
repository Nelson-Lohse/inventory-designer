import { Line } from 'react-konva';
import type { Point } from '../../types';

interface Props {
  outline: Point[];
  pxPerInch: number;
}

export default function RoomOutline({ outline, pxPerInch }: Props) {
  const points = outline.flatMap((p) => [p.x * pxPerInch, p.y * pxPerInch]);

  return <Line points={points} closed fill="#fafaf9" stroke="#292524" strokeWidth={4} lineJoin="round" />;
}
