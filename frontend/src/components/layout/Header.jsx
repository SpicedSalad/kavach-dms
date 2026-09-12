import { useState } from 'react';
import { Search, UserCircle, LogOut, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AIDocumentScannerModal } from '../modals/AIDocumentScannerModal';
import { IntegrityVerifierModal } from '../modals/IntegrityVerifierModal';

export default function Header() {
  const { user, logout, backendOnline, aiOnline } = useAuth();
  const navigate = useNavigate();
  const [showAiModal, setShowAiModal] = useState(false);
  const [showVerifierModal, setShowVerifierModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1 flex items-center space-x-4">
        <div className="w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
              }
            }}
            className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-xs"
            placeholder="Global search (cases, docs, AI)..."
          />
        </div>

        {/* Quick Tools */}
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-sm transition-colors"
            title="Scan document with OCR and entity extraction"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Scanner
          </button>
          <button
            onClick={() => setShowVerifierModal(true)}
            className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-sm transition-colors"
            title="Verify document hash integrity"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Tamper Verifier
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {/* Service Connectivity Indicators */}
        <div className="hidden md:flex items-center space-x-2">
          <div
            className={`flex items-center text-[11px] font-semibold px-2 py-1 rounded-xs border ${
              backendOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={backendOnline ? 'Spring Boot core API connected' : 'Operating in offline/demo fallback mode'}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {backendOnline ? 'Backend Online' : 'Backend (Demo Mode)'}
          </div>

          <div
            className={`flex items-center text-[11px] font-semibold px-2 py-1 rounded-xs border ${
              aiOnline
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title={aiOnline ? 'FastAPI AI Engine online' : 'AI service offline (simulated)'}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                aiOnline ? 'bg-purple-600 animate-pulse' : 'bg-slate-400'
              }`}
            />
            {aiOnline ? 'AI Active' : 'AI Offline'}
          </div>
        </div>

        {/* User Session Info */}
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-5">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-900">
              {user?.name || 'Insp. R. Sharma'}
            </p>
            <p className="text-[10px] text-gray-500 font-mono">
              {user?.role === 'ADMIN' ? 'ROLE: ADMINISTRATOR' : 'INVESTIGATING OFFICER'}
            </p>
          </div>
          <UserCircle className="h-7 w-7 text-gray-400" />
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AIDocumentScannerModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} />
      <IntegrityVerifierModal isOpen={showVerifierModal} onClose={() => setShowVerifierModal(false)} />
    </header>
  );
}
