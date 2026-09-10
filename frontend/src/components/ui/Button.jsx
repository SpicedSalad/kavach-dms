import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors";
  const variants = {
    primary: "border border-transparent text-white bg-slate-800 hover:bg-slate-900 focus:ring-slate-800",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-slate-800",
    danger: "border border-transparent text-white bg-red-700 hover:bg-red-800 focus:ring-red-700"
  };

  return (
    <button className={twMerge(clsx(baseStyle, variants[variant], className))} {...props}>
      {children}
    </button>
  );
}
