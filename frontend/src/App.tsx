import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DrawPage from './pages/DrawPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/draw" element={<DrawPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
