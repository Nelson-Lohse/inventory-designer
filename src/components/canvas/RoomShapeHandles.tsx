import { useEffect, useState } from 'react';
import { Circle } from 'react-konva';
import type Konva from 'konva';
import type { Point } from '../../types';
import { insertVertexAtEdge, removeVertex, snapToGrid } from '../../utils/geometry';

interface Props {
  outline: Point[];
  pxPerInch: number;
  gridSizeIn: number;
  onChange: (outline: Point[]) => void;
}

const VERTEX_RADIUS = 7;
const MIDPOINT_RADIUS = 5;

/**
 * Drag a corner to reshape the room. Click an edge midpoint to add a new
 * corner there (that's how you carve a hallway notch or an L-shape out of a
 * rectangle). Remove a corner by double-clicking/double-tapping it, or by
 * clicking it once to select (turns red) then pressing Delete/Backspace —
 * the keyboard path exists because double-click is a poor touch/automation
 * target on a ~14px handle. Never drops below a triangle.
 */
export default function RoomShapeHandles({ outline, pxPerInch, gridSizeIn, onChange }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIndex !== null) {
        e.preventDefault();
        onChange(removeVertex(outline, selectedIndex));
        setSelectedIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, outline, onChange]);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= outline.length) setSelectedIndex(null);
  }, [outline, selectedIndex]);

  const handleVertexDragEnd = (index: number, e: Konva.KonvaEventObject<DragEvent>) => {
    const xIn = snapToGrid(e.target.x() / pxPerInch, gridSizeIn);
    const yIn = snapToGrid(e.target.y() / pxPerInch, gridSizeIn);
    onChange(outline.map((p, i) => (i === index ? { x: xIn, y: yIn } : p)));
  };

  const removeAndClear = (index: number) => {
    onChange(removeVertex(outline, index));
    setSelectedIndex(null);
  };

  return (
    <>
      {outline.map((point, i) => {
        const next = outline[(i + 1) % outline.length];
        const midX = ((point.x + next.x) / 2) * pxPerInch;
        const midY = ((point.y + next.y) / 2) * pxPerInch;
        return (
          <Circle
            key={`mid-${i}`}
            x={midX}
            y={midY}
            radius={MIDPOINT_RADIUS}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={1.5}
            onClick={() => onChange(insertVertexAtEdge(outline, i))}
            onTap={() => onChange(insertVertexAtEdge(outline, i))}
          />
        );
      })}
      {outline.map((point, i) => (
        <Circle
          key={`vertex-${i}`}
          x={point.x * pxPerInch}
          y={point.y * pxPerInch}
          radius={selectedIndex === i ? VERTEX_RADIUS + 2 : VERTEX_RADIUS}
          fill={selectedIndex === i ? '#dc2626' : '#2563eb'}
          stroke={selectedIndex === i ? '#7f1d1d' : '#1e3a8a'}
          strokeWidth={1.5}
          draggable
          onClick={() => setSelectedIndex(i)}
          onTap={() => setSelectedIndex(i)}
          onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => handleVertexDragEnd(i, e)}
          onDblClick={() => removeAndClear(i)}
          onDblTap={() => removeAndClear(i)}
        />
      ))}
    </>
  );
}
