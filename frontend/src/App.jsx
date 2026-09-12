import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDetails from './pages/CaseDetails';
import Documents from './pages/Documents';
import Evidence from './pages/Evidence';
import Search from './pages/Search';
import AuditTrail from './pages/AuditTrail';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cases" element={<Cases />} />
            <Route path="cases/:id" element={<CaseDetails />} />
            <Route path="documents" element={<Documents />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="search" element={<Search />} />
            <Route path="audit" element={<AuditTrail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
