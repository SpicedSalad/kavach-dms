import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, Filter, Plus, ArrowRight } from 'lucide-react';
import { mockCases } from '../mockData';

export default function Cases() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">Active Investigations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, filter, and access all operational cases.</p>
        </div>
        <Button variant="primary"><Plus className="w-4 h-4 mr-2"/> New Case</Button>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cases by ID, title, or keywords..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary"><Filter className="w-4 h-4 mr-2"/> Status: Active</Button>
          <Button variant="secondary"><Filter className="w-4 h-4 mr-2"/> Priority</Button>
        </div>
      </div>

      <div className="border-t border-gray-300">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-white">
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-gray-600">Case ID</th>
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-gray-600">Case Details</th>
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-gray-600">Type</th>
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-gray-600">Last Activity</th>
                <th className="py-3 px-4 text-left text-[13px] font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-right text-[13px] font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => window.location.href = `/cases/${c.id}`}>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-blue-700">
                    <Link to={`/cases/${c.id}`} className="hover:underline">{c.caseNumber}</Link>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{c.title}</p>
                    <p className="text-xs text-gray-500">IO: {c.assignedOfficer}</p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-[13px] text-gray-700 font-medium">{c.type}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 font-mono text-xs">
                    {new Date(c.lastUpdated).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    <Badge status={c.status} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/cases/${c.id}`} className="text-blue-700 hover:text-blue-900 flex items-center justify-end">
                      Open <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
