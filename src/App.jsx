import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Workspace from './Workspace';
import Admin from './Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;