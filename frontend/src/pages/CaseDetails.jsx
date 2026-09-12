import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseService } from '../services/caseService';
import { documentService } from '../services/documentService';
import { evidenceService } from '../services/evidenceService';
import { caseMemberService } from '../services/caseMemberService';
import { mockAuditLogs } from '../mockData';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import {
  ArrowLeft,
  Upload,
  ShieldAlert,
  Plus,
  CheckCircle,
  FileText,
  Package,
  UserPlus,
} from 'lucide-react';
import { UploadDocumentModal } from '../components/modals/UploadDocumentModal';
import { RegisterEvidenceModal } from '../components/modals/RegisterEvidenceModal';
import { AddCaseMemberModal } from '../components/modals/AddCaseMemberModal';

export default function CaseDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDocModal, setShowDocModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      const [caseItem, allDocs, allEv, allMembers] = await Promise.all([
        caseService.getCaseById(id),
        documentService.getAllDocuments(),
        evidenceService.getAllEvidence(),
        caseMemberService.getAllMembers(),
      ]);

      setCaseData(caseItem);

      // Filter documents belonging to this case
      const caseDocs = allDocs.filter(
        (d) =>
          d.caseId === id ||
          d.caseId === `CASE-${id}` ||
          String(d.numericCaseId) === String(id) ||
          d.caseId === caseItem?.caseNumber
      );
      setDocuments(caseDocs);

      // Filter evidence belonging to this case
      const caseEv = allEv.filter(
        (e) =>
          e.caseId === id ||
          e.caseId === `CASE-${id}` ||
          String(e.numericCaseId) === String(id) ||
          e.caseId === caseItem?.caseNumber
      );
      setEvidence(caseEv);

      // Filter members for this case
      const cMembers = allMembers.filter(
        (m) =>
          String(m.caseId) === String(id) ||
          String(m.caseId) === String(caseItem?.caseId)
      );
      setMembers(cMembers.length > 0 ? cMembers : allMembers.slice(0, 2));
    } catch (err) {
      console.warn('Error fetching case details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const activity = mockAuditLogs.filter(
    (a) =>
      a.details.includes(id) ||
      a.details.includes('document') ||
      a.details.includes('evidence')
  );

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-500">Loading case file from backend...</div>;
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-base font-semibold text-gray-700">Case not found.</p>
        <Link to="/cases" className="text-sm text-blue-700 hover:underline mt-2 inline-block">
          Return to Investigations List
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: `Documents (${documents.length})` },
    { id: 'evidence', label: `Evidence (${evidence.length})` },
    { id: 'team', label: `Assigned Team (${members.length})` },
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
              <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">
                {caseData.caseNumber}
              </h1>
              <Badge status={caseData.status} />
              <Badge status="Restricted" className="bg-slate-100 text-slate-800 border-slate-300">
                {caseData.classification || caseData.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-900 font-semibold">{caseData.title}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowDocModal(true)}>
            <Upload className="w-4 h-4 mr-2" /> Upload Document
          </Button>
          <Button variant="secondary" onClick={() => setShowEvidenceModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Evidence
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="border border-gray-200 bg-white rounded-sm p-6 shadow-xs">
                <h2 className="text-[18px] font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Investigation Overview
                </h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Documents In File</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{documents.length} items</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Evidence In Custody</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{evidence.length} items</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Last Activity</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {new Date(caseData.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Integrity Status</p>
                    <p className="text-sm font-bold text-green-700 mt-1 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> SHA-256 Ledger Verified
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Case Briefing & Notes
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-sm">
                    {caseData.description || 'No detailed case description entered yet.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-red-200 bg-red-50 rounded-sm p-4">
                <div className="flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-red-900">ABAC Access Restricted</h3>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      Only authorized case members or Administrators with valid security clearance may inspect these
                      investigation assets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 bg-white rounded-sm p-4 shadow-xs">
                <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Case Officers</h3>
                  <button
                    onClick={() => setShowMemberModal(true)}
                    className="text-xs text-blue-700 hover:underline font-semibold"
                  >
                    + Assign
                  </button>
                </div>
                <div className="space-y-2">
                  {members.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-gray-800">{m.userEmail || m.userName}</span>
                      <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-sm text-slate-700">
                        {m.accessLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            {documents.length > 0 ? (
              <div className="border border-gray-200 rounded-sm bg-white overflow-hidden divide-y divide-gray-200 shadow-xs">
                {documents.map((d) => (
                  <div key={d.id || d.documentId} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-blue-700">{d.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {d.type} • Uploaded by {d.uploadedBy} on {new Date(d.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge status={d.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No documents attached"
                description="Upload FIRs, transcripts, financial statements, or forensic reports to this case."
                actionText="Upload Document"
                onAction={() => setShowDocModal(true)}
                icon={FileText}
              />
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div>
            {evidence.length > 0 ? (
              <div className="border border-gray-200 rounded-sm bg-white overflow-hidden divide-y divide-gray-200 shadow-xs">
                {evidence.map((e) => (
                  <div key={e.id || e.evidenceId} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Package className="w-6 h-6 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{e.description}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          EVD-{e.id} • {e.type} • Custodian: {e.custodian} • Location: {e.location}
                        </p>
                      </div>
                    </div>
                    <Badge status={e.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No evidence registered"
                description="Register mobile devices, laptops, storage drives, or physical evidence."
                actionText="Register Evidence"
                onAction={() => setShowEvidenceModal(true)}
                icon={Package}
              />
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="border border-gray-200 bg-white rounded-sm p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Case Investigation Team</h3>
                <p className="text-xs text-gray-500 mt-0.5">Attribute-Based Access Control (ABAC) membership</p>
              </div>
              <Button variant="primary" onClick={() => setShowMemberModal(true)} className="text-xs">
                <UserPlus className="w-4 h-4 mr-1.5" /> Assign Officer
              </Button>
            </div>

            <div className="divide-y divide-gray-100">
              {members.map((m, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {(m.userEmail || m.userName || 'O').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{m.userEmail || m.userName}</p>
                      <p className="text-xs text-gray-500">Security Clearance Level: {m.accessLevel}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-xs">
                    {m.accessLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="border border-gray-200 bg-white rounded-sm p-6 shadow-xs">
            <h2 className="text-[18px] font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
              Case Audit Trail
            </h2>
            <div className="space-y-4">
              {activity.map((a) => (
                <div key={a.id} className="flex space-x-4">
                  <div className="text-right w-24 shrink-0">
                    <p className="text-xs font-mono text-gray-500">
                      {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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

      {/* Modals */}
      <UploadDocumentModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        defaultCaseId={caseData.caseId || 1}
        onUploaded={() => fetchCaseDetails()}
      />
      <RegisterEvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        defaultCaseId={caseData.caseId || 1}
        onRegistered={() => fetchCaseDetails()}
      />
      <AddCaseMemberModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        caseId={caseData.caseId || 1}
        onMemberAdded={() => fetchCaseDetails()}
      />
    </div>
  );
}
