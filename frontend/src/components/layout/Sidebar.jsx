import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, FileText, Package, Search, ShieldAlert, Settings, Activity } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Cases', path: '/cases', icon: FolderOpen },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Evidence', path: '/evidence', icon: Package },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Activity', path: '/audit', icon: Activity },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <ShieldAlert className="w-6 h-6 text-blue-400 mr-2" />
        <span className="text-xl font-bold text-white tracking-wide">KavachDMS</span>
      </div>
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <div className="mt-6 px-3">
          <div className="h-[2px] w-8 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full opacity-30 mb-3" />
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider leading-tight">
            Ministry of Home Affairs
            <br />
            Government of India
          </p>
        </div>
      </div>
    </div>
  );
}
