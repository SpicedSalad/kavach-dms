import { Button } from '../components/ui/Button';
import { Search, Filter, Plus } from 'lucide-react';
import { mockEvidence } from '../mockData';
import { EvidenceRow } from '../components/ui/EvidenceRow';

export default function Evidence() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">Evidence Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Digital identity and chronological chain of custody for physical and digital assets.</p>
        </div>
        <Button variant="primary"><Plus className="w-4 h-4 mr-2"/> Register Evidence</Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Evidence ID, Case ID, or keyword..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
          />
        </div>
        <Button variant="secondary"><Filter className="w-4 h-4 mr-2"/> Filters</Button>
      </div>

      <div className="border-t border-gray-300">
        <div className="divide-y divide-gray-200">
          {mockEvidence.map((item) => (
            <EvidenceRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
