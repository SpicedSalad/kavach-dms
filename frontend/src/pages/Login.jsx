import { ShieldAlert, Fingerprint } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldAlert className="w-12 h-12 text-blue-800" />
        </div>
        <h2 className="mt-4 text-center text-[26px] font-semibold text-gray-900 tracking-tight">
          KavachDMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Secure Digital Evidence Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 sm:rounded-sm sm:px-10">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 flex items-center justify-center">
              Secure Officer Login
            </h3>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="officerId" className="block text-[13px] font-medium text-gray-700">
                Officer ID / Badge Number
              </label>
              <div className="mt-1 relative">
                <input
                  id="officerId"
                  name="officerId"
                  type="text"
                  required
                  defaultValue="INSP-10492"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-slate-800 focus:border-slate-800 sm:text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none focus:ring-slate-800 focus:border-slate-800 sm:text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <Button variant="primary" className="w-full flex justify-center py-2.5">
                <Fingerprint className="w-4 h-4 mr-2" /> Sign In
              </Button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            Ministry of Home Affairs
            <br />
            Government of India
          </p>
        </div>
      </div>
    </div>
  );
}
