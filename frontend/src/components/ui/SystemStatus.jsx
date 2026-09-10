import { CheckCircle } from 'lucide-react';

export function SystemStatus() {
  return (
    <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-sm border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
      <CheckCircle className="w-3.5 h-3.5 text-green-600 mr-2" />
      System Secure
    </div>
  );
}
