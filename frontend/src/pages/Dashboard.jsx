import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  FolderPlus,
  Upload,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  Box,
  RefreshCw,
} from 'lucide-react';
import { caseService } from '../services/caseService';
import { documentService } from '../services/documentService';
import { evidenceService } from '../services/evidenceService';
import { CreateCaseModal } from '../components/modals/CreateCaseModal';
import { UploadDocumentModal } from '../components/modals/UploadDocumentModal';
import { RegisterEvidenceModal } from '../components/modals/RegisterEvidenceModal';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [casesData, docsData, evData] = await Promise.all([
        caseService.getAllCases(),
        documentService.getAllDocuments(),
        evidenceService.getAllEvidence(),
      ]);
      setCases(casesData);
      setDocuments(docsData);
      setEvidenceList(evData);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const activeCases = cases.filter((c) => c.status === 'ACTIVE');
  const recentCases = activeCases.slice(0, 5);
  const recentDocs = documents.slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">System Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Operational overview for {user?.name || 'Insp. R. Sharma'} • Connected to KavachDMS Network
          </p>
        </div>
        <Button variant="secondary" onClick={loadDashboardData} className="text-xs">
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Live Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-red-200 bg-red-50 rounded-sm">
            <div className="px-4 py-3 border-b border-red-200">
              <h2 className="text-base font-semibold text-red-900 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-600" /> Operational Attention
              </h2>
            </div>
            <div className="divide-y divide-red-200">
              <Link to="/documents" className="p-4 hover:bg-red-100 transition-colors block group">
                <p className="text-sm font-semibold text-red-900 flex items-center justify-between">
                  {documents.length} Case Documents Registered
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-red-700 mt-1">MinIO storage & SHA-256 integrity verified</p>
              </Link>
              <Link to="/evidence" className="p-4 hover:bg-red-100 transition-colors block group">
                <p className="text-sm font-semibold text-red-900 flex items-center justify-between">
                  {evidenceList.length} Evidence Assets Logged
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-red-700 mt-1">Chain of Custody tracking active</p>
              </Link>
            </div>
          </div>

          <div className="border border-green-200 bg-green-50 rounded-sm p-4 flex items-center">
            <ShieldCheck className="w-5 h-5 text-green-600 mr-3 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Cryptographic Integrity Guard Active</p>
              <p className="text-xs text-green-700">All uploaded hashes logged in tamper-evident store</p>
            </div>
          </div>

          <div>
            <h2 className="text-[17px] font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => setShowCaseModal(true)}
              >
                <FolderPlus className="w-4 h-4 mr-3 text-blue-600" /> New Investigation Case
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => setShowDocModal(true)}
              >
                <Upload className="w-4 h-4 mr-3 text-purple-600" /> Upload Case Document
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => setShowEvidenceModal(true)}
              >
                <Box className="w-4 h-4 mr-3 text-emerald-600" /> Register Physical Evidence
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Cases & Recent Docs */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">Active Investigations ({activeCases.length})</h2>
              <Link to="/cases" className="text-sm text-blue-700 hover:underline font-medium">
                View all
              </Link>
            </div>
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-xs">
              <div className="divide-y divide-gray-200">
                {recentCases.map((c) => (
                  <div
                    key={c.id || c.caseId}
                    className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors space-y-2 sm:space-y-0"
                  >
                    <div>
                      <Link
                        to={`/cases/${c.caseNumber || c.id || c.caseId}`}
                        className="text-sm font-bold text-blue-700 hover:underline"
                      >
                        {c.caseNumber}
                      </Link>
                      <p className="text-sm text-gray-900 mt-0.5">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Last activity:{' '}
                        {new Date(c.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge status={c.status} />
                      <span className="text-[13px] font-medium text-gray-500 mt-1">
                        {c.classification || c.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-semibold text-gray-900">Recent Documents ({documents.length})</h2>
              <Link to="/documents" className="text-sm text-blue-700 hover:underline font-medium">
                View all
              </Link>
            </div>
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-xs">
              <div className="divide-y divide-gray-200">
                {recentDocs.map((d) => (
                  <div
                    key={d.id || d.documentId}
                    className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors space-y-2 sm:space-y-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="font-medium text-slate-700">Case: {d.caseId}</span> •{' '}
                        {d.date ? d.date.split('T')[0] : 'Today'} • {d.type}
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

      {/* Modals */}
      <CreateCaseModal
        isOpen={showCaseModal}
        onClose={() => setShowCaseModal(false)}
        onCaseCreated={(newCase) => {
          setCases((prev) => [newCase, ...prev]);
        }}
      />
      <UploadDocumentModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        onUploaded={() => {
          loadDashboardData();
        }}
      />
      <RegisterEvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        onRegistered={(newEv) => {
          setEvidenceList((prev) => [newEv, ...prev]);
        }}
      />
    </div>
  );
}
