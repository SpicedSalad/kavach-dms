import { Bell, Search, UserCircle } from 'lucide-react';
import { SystemStatus } from '../ui/SystemStatus';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1 flex items-center">
        <div className="w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
            placeholder="Global search..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <SystemStatus />
        
        <button className="text-gray-400 hover:text-slate-800 relative">
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Insp. R. Sharma</p>
            <p className="text-xs text-gray-500">Cyber Cell</p>
          </div>
          <UserCircle className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
