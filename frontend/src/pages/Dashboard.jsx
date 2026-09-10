import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FolderPlus, Upload, ShieldCheck, AlertTriangle, ArrowRight, Clock, Box } from 'lucide-react';
import { getRecentCases, getRecentDocuments } from '../mockData';

export default function Dashboard() {
  const recentCases = getRecentCases();
  const recentDocs = getRecentDocuments();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">System Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Operational overview for Insp. R. Sharma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Needs Attention & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="border border-red-200 bg-red-50 rounded-sm">
            <div className="px-4 py-3 border-b border-red-200">
              <h2 className="text-[18px] font-semibold text-red-900 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> Needs Your Attention
              </h2>
            </div>
            <div className="divide-y divide-red-200">
              <div className="p-4 hover:bg-red-100 transition-colors cursor-pointer group">
                <p className="text-sm font-semibold text-red-900 flex items-center justify-between">
                  3 documents processing <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-red-700 mt-1">OCR extraction pending review</p>
              </div>
              <div className="p-4 hover:bg-red-100 transition-colors cursor-pointer group">
                <p className="text-sm font-semibold text-red-900 flex items-center justify-between">
                  1 evidence transfer <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-red-700 mt-1">FIR-2026-0042 requires confirmation</p>
              </div>
            </div>
          </div>

          <div className="border border-green-200 bg-green-50 rounded-sm p-4 flex items-center">
             <ShieldCheck className="w-5 h-5 text-green-600 mr-3 shrink-0" />
             <p className="text-sm font-medium text-green-900">12 documents integrity verified today</p>
          </div>

          <div>
            <h2 className="text-[18px] font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start"><FolderPlus className="w-4 h-4 mr-3 text-slate-500"/> New Investigation Case</Button>
              <Button variant="secondary" className="w-full justify-start"><Upload className="w-4 h-4 mr-3 text-slate-500"/> Upload Case Document</Button>
              <Button variant="secondary" className="w-full justify-start"><Box className="w-4 h-4 mr-3 text-slate-500"/> Register Physical Evidence</Button>
            </div>
          </div>

        </div>

        {/* Right Column: Active Cases & Recent Docs */}
        <div className="lg:col-span-2 space-y-8">
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">My Active Cases</h2>
              <Link to="/cases" className="text-sm text-blue-700 hover:underline font-medium">View all</Link>
            </div>
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden">
              <div className="divide-y divide-gray-200">
                {recentCases.map(c => (
                  <div key={c.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors space-y-2 sm:space-y-0">
                    <div>
                      <Link to={`/cases/${c.id}`} className="text-sm font-bold text-blue-700 hover:underline">{c.caseNumber}</Link>
                      <p className="text-sm text-gray-900 mt-0.5">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Last activity: {new Date(c.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge status={c.status} />
                      <span className="text-[13px] font-medium text-gray-500 mt-1">{c.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">Recent Documents</h2>
              <Link to="/documents" className="text-sm text-blue-700 hover:underline font-medium">View all</Link>
            </div>
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden">
              <div className="divide-y divide-gray-200">
                {recentDocs.slice(0, 3).map(d => (
                  <div key={d.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="font-medium text-slate-700">Case: {d.caseId}</span> • {d.date.split('T')[0]}
                      </p>
                    </div>
                    <Badge status={d.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
