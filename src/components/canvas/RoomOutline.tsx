import { Rect } from 'react-konva';

interface Props {
  widthIn: number;
  depthIn: number;
  pxPerInch: number;
}

export default function RoomOutline({ widthIn, depthIn, pxPerInch }: Props) {
  return (
    <Rect
      x={0}
      y={0}
      width={widthIn * pxPerInch}
      height={depthIn * pxPerInch}
      fill="#fafaf9"
      stroke="#292524"
      strokeWidth={4}
    />
  );
}
