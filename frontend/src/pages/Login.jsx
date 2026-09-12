import { useState } from 'react';
import { ShieldAlert, Fingerprint, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('officer@kavach.gov.in');
  const [password, setPassword] = useState('kavach123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, false);
      navigate('/dashboard');
    } catch (err) {
      console.warn('Backend login failed:', err.message);
      setError(
        `${err.message}. If the backend server is not running on this laptop, click "Enter in Demo Mode" below to explore all features.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    login(demoEmail, 'demo', true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 bg-blue-950 border border-blue-800 rounded-full mb-3">
          <ShieldAlert className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">KavachDMS</h1>
        <p className="mt-1 text-xs text-slate-400">
          Secure Digital Evidence & Investigation Document Management System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-gray-200 shadow-xl sm:rounded-md sm:px-10">
          <div className="mb-5 pb-3 border-b border-gray-200 text-center">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Authorized Personnel Login
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Spring Boot REST API Security Layer</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Officer / Admin Email *
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@kavach.gov.in"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-slate-800 sm:text-xs text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password *
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-slate-800 sm:text-xs text-gray-900"
                />
              </div>
            </div>

            <div>
              <Button variant="primary" type="submit" className="w-full flex justify-center py-2.5" disabled={loading}>
                <Fingerprint className="w-4 h-4 mr-2" />
                {loading ? 'Authenticating...' : 'Sign In via Backend API'}
              </Button>
            </div>
          </form>

          {/* Quick Demo Access Options */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 text-center mb-3">
              One-Click Testing Presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@kavach.gov.in', 'ADMIN')}
                className="p-2 border border-slate-200 hover:border-slate-800 bg-slate-50 rounded-sm text-left transition-colors text-xs"
              >
                <span className="font-bold text-slate-900 block">Admin Access</span>
                <span className="text-[10px] text-slate-500">Full ABAC permissions</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('officer@kavach.gov.in', 'OFFICER')}
                className="p-2 border border-slate-200 hover:border-slate-800 bg-slate-50 rounded-sm text-left transition-colors text-xs"
              >
                <span className="font-bold text-slate-900 block">Investigator</span>
                <span className="text-[10px] text-slate-500">Cyber Cell Team</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Ministry of Home Affairs • Government of India
            <br />
            <span className="text-[10px] text-slate-600">National Cyber Crime Investigation Network</span>
          </p>
        </div>
      </div>
    </div>
  );
}
