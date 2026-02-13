import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MedicalDashboard from './pages/MedicalDashboard';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import { MedicalProvider } from './context/MedicalContext';
import './i18n';

function App() {
  return (
    <MedicalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<MedicalDashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Routes>
      </Router>
    </MedicalProvider>
  );
}

export default App;
