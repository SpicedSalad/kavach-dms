import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Filter, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { documentService } from '../services/documentService';
import { DocumentRow } from '../components/ui/DocumentRow';
import { UploadDocumentModal } from '../components/modals/UploadDocumentModal';
import { AIDocumentScannerModal } from '../components/modals/AIDocumentScannerModal';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (err) {
      console.warn('Failed to load documents:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      doc.name?.toLowerCase().includes(q) ||
      doc.caseId?.toLowerCase().includes(q) ||
      doc.hash?.toLowerCase().includes(q) ||
      doc.type?.toLowerCase().includes(q);

    const matchesType = typeFilter === 'ALL' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Global repository of all case documents, MinIO storage keys, and cryptographic integrity records.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => setShowAiModal(true)} className="text-purple-700 bg-purple-50 border-purple-200">
            <Sparkles className="w-4 h-4 mr-2" /> AI OCR Scanner
          </Button>
          <Button variant="secondary" onClick={fetchDocuments}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" /> Upload Document
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, case ID, or SHA-256 hash..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
        >
          <option value="ALL">All Types</option>
          <option value="FIR">FIR</option>
          <option value="Charge Sheet">Charge Sheet</option>
          <option value="Witness Statement">Witness Statement</option>
          <option value="Financial Record">Financial Record</option>
          <option value="Forensic Report">Forensic Report</option>
        </select>
      </div>

      <div className="border-t border-gray-300">
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading documents from storage...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">No matching case documents found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
              <DocumentRow key={doc.id || doc.documentId} doc={doc} />
            ))}
          </div>
        )}
      </div>

      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={() => fetchDocuments()}
      />
      <AIDocumentScannerModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
}
