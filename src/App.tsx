import "./App.css";
import { Routes, Route } from 'react-router-dom';
import BoardList from './pages/BoardList';
import NewBoard from './pages/NewBoard';
import KanbanBoard from './pages/KanbanBoard';

function App() {

  return (
    <main className="container">
      <Routes>
        <Route path="/boards" element={<BoardList />} />
        <Route path="/boards/new" element={<NewBoard />} />
        <Route path="/boards/:boardId" element={<KanbanBoard />} />
      </Routes>
    </main>
  );
}

export default App;
