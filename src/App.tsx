import { useFloorplanStore } from './state/floorplanStore';
import FloorplanListPage from './pages/FloorplanListPage';
import FloorplanEditorPage from './pages/FloorplanEditorPage';

export default function App() {
  const activeFloorplanId = useFloorplanStore((s) => s.activeFloorplanId);
  return activeFloorplanId ? <FloorplanEditorPage /> : <FloorplanListPage />;
}
