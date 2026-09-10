import { ArrowDown } from 'lucide-react';

export function CustodyTimeline({ chain }) {
  return (
    <div className="py-2">
      {chain.map((event, idx) => (
        <div key={idx} className="relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-white" />
              {idx !== chain.length - 1 && (
                <div className="w-0.5 h-12 bg-slate-200 my-1 flex justify-center items-center">
                  <ArrowDown className="w-3 h-3 text-slate-400 bg-white" />
                </div>
              )}
            </div>
            <div className="ml-4 -mt-1 pb-4">
              <p className="text-[13px] font-semibold text-gray-900">{event.step}</p>
              <p className="text-sm font-medium text-slate-700">{event.by}</p>
              <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
