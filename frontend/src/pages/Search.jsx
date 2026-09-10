import { Badge } from '../components/ui/Badge';
import { Search as SearchIcon, Filter, Folder, FileText, Package } from 'lucide-react';
import { mockCases, mockDocuments, mockEvidence } from '../mockData';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function Search() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">Global Search</h1>
        <p className="text-sm text-gray-500 mt-1">Search across case files, document content, metadata, and OCR extractions.</p>
      </div>

      <div className="border border-gray-200 bg-gray-50 p-6 rounded-sm mb-8">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter keywords (e.g., 'Central Bank', 'FIR-2026-0042')..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm text-gray-900"
            />
          </div>
          <Button variant="secondary" className="px-6"><Filter className="w-5 h-5 mr-2" /> Filters</Button>
          <Button variant="primary" className="px-8">Search</Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Cases Section */}
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Cases ({mockCases.length})</h2>
          <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-200">
            {mockCases.map((c) => (
              <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-100 rounded-sm shrink-0">
                    <Folder className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-700 hover:underline"><Link to={`/cases/${c.id}`}>{c.caseNumber}</Link></h3>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{c.title}</p>
                  </div>
                </div>
                <Badge status={c.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Documents ({mockDocuments.length})</h2>
          <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-200">
            {mockDocuments.slice(0,2).map((d) => (
              <div key={d.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                     <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                     <div>
                       <h3 className="text-sm font-medium text-blue-700 cursor-pointer hover:underline">{d.name}</h3>
                       <p className="text-xs text-gray-500 mt-1">Case: {d.caseId} | Uploaded: {new Date(d.date).toLocaleDateString()}</p>
                       <div className="mt-2 p-2 bg-yellow-50 border-l-2 border-yellow-400 text-xs text-gray-800">
                         ...mentioned <span className="font-bold bg-yellow-200 px-1 rounded-sm">Central Bank</span> in the statement...
                       </div>
                     </div>
                  </div>
                  <Badge status={d.classification} className="shrink-0 ml-4"/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Section */}
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Evidence ({mockEvidence.length})</h2>
          <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-200">
            {mockEvidence.map((e) => (
              <div key={e.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-100 rounded-sm shrink-0">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{e.description}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">EVD-{e.id} • Case: <Link to={`/cases/${e.caseId}`} className="text-blue-600 hover:underline">{e.caseId}</Link></p>
                  </div>
                </div>
                <Badge status={e.status} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
