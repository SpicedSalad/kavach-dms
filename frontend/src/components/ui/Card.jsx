import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className }) {
  return (
    <div className={twMerge(clsx("bg-white border border-gray-200", className))}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={twMerge(clsx("px-4 py-5 sm:px-6 border-b border-gray-200", className))}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }) {
  return (
    <div className={twMerge(clsx("px-4 py-5 sm:p-6", className))}>
      {children}
    </div>
  );
}
