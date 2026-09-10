import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCaseById, getDocumentsByCaseId, getEvidenceByCaseId, mockAuditLogs } from '../mockData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { ArrowLeft, Upload, ShieldAlert, Plus, CheckCircle, FileText, Package } from 'lucide-react';

export default function CaseDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  const caseData = getCaseById(id);
  const documents = getDocumentsByCaseId(id);
  const evidence = getEvidenceByCaseId(id);
  
  const activity = mockAuditLogs.filter(a => a.details.includes(id) || a.details.includes('document') || a.details.includes('evidence'));

  if (!caseData) return <div className="p-8 text-center text-gray-500">Case not found.</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Link to="/cases" className="text-gray-400 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">{caseData.caseNumber}</h1>
              <Badge status={caseData.status} />
              {caseData.priority === 'HIGH' && <Badge status="Warning" className="bg-red-100 text-red-800 border-red-200">HIGH PRIORITY</Badge>}
            </div>
            <p className="text-sm text-gray-900 font-semibold">{caseData.title}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <div className="text-right mr-4 border-r border-gray-200 pr-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Assigned Officer</p>
            <p className="text-sm font-bold text-gray-900">{caseData.assignedOfficer}</p>
          </div>
          <Button variant="secondary"><Upload className="w-4 h-4 mr-2"/> Upload Document</Button>
          <Button variant="secondary"><Plus className="w-4 h-4 mr-2"/> Add Evidence</Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="border border-gray-200 bg-white rounded-sm p-6">
                <h2 className="text-[18px] font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Case Summary</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Documents</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{documents.length} items</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Evidence</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{evidence.length} items</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Last Activity</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{new Date(caseData.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Integrity Status</p>
                    <p className="text-sm font-bold text-green-700 mt-1 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> All Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-red-200 bg-red-50 rounded-sm p-4">
                <div className="flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-900">Access Restricted</h3>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">This case is strictly restricted to authorized personnel. All access is logged via the blockchain integrity layer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
             {documents.length > 0 ? (
               <div className="border border-gray-200 rounded-sm bg-white overflow-hidden divide-y divide-gray-200">
                  {documents.map(d => (
                    <div key={d.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-6 h-6 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-blue-700 hover:underline cursor-pointer">{d.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{d.type} • Uploaded by {d.uploadedBy} on {new Date(d.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge status={d.status} />
                    </div>
                  ))}
               </div>
             ) : (
               <EmptyState title="No documents" description="No documents have been uploaded to this case yet." actionText="Upload Document" icon={FileText} />
             )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div>
             {evidence.length > 0 ? (
               <div className="border border-gray-200 rounded-sm bg-white overflow-hidden divide-y divide-gray-200">
                  {evidence.map(e => (
                    <div key={e.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Package className="w-6 h-6 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-blue-700 hover:underline cursor-pointer">{e.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">EVD-{e.id} • {e.type} • Custodian: {e.custodian}</p>
                        </div>
                      </div>
                      <Badge status={e.status} />
                    </div>
                  ))}
               </div>
             ) : (
               <EmptyState title="No evidence" description="No physical or digital evidence has been registered." actionText="Add Evidence" icon={Package} />
             )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="border border-gray-200 bg-white rounded-sm p-6">
            <h2 className="text-[18px] font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Recent Activity</h2>
            <div className="space-y-4">
              {activity.map(a => (
                <div key={a.id} className="flex space-x-4">
                  <div className="text-right w-24 shrink-0">
                    <p className="text-xs font-mono text-gray-500">{new Date(a.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="text-xs text-gray-400">{new Date(a.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4 pb-4">
                    <p className="text-sm font-bold text-gray-900">{a.action}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{a.details}</p>
                    <p className="text-xs font-medium text-blue-700 mt-1">{a.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
