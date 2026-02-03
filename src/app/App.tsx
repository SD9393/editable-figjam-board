import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FigJamBoard from '@/app/components/FigJamBoard';

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full min-h-screen bg-[#f5f5f5]">
        <FigJamBoard />
      </div>
    </DndProvider>
  );
}
