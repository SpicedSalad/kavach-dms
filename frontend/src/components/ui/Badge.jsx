import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Badge({ children, status, className }) {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-sm text-[13px] font-semibold border';
  
  const statusStyles = {
    Active: 'bg-green-50 text-green-700 border-green-200',
    Closed: 'bg-gray-50 text-gray-700 border-gray-200',
    Verified: 'bg-green-50 text-green-700 border-green-200',
    Processing: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    Warning: 'bg-red-50 text-red-700 border-red-200',
    Failed: 'bg-red-50 text-red-700 border-red-200',
    Restricted: 'bg-red-50 text-red-700 border-red-200',
    Confidential: 'bg-orange-50 text-orange-800 border-orange-200',
    General: 'bg-slate-50 text-slate-700 border-slate-200',
    Secured: 'bg-green-50 text-green-700 border-green-200',
    'In Transit': 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const colorStyle = statusStyles[status] || statusStyles['General'];
  
  return (
    <span className={twMerge(clsx(baseStyle, colorStyle, className))}>
      {children || status}
    </span>
  );
}
