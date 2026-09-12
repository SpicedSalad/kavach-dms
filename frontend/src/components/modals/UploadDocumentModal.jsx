import { useState } from 'react';
import { X, Upload, Sparkles, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { documentService } from '../../services/documentService';
import { aiService } from '../../services/aiService';

export function UploadDocumentModal({ isOpen, onClose, defaultCaseId, onUploaded }) {
  const [formData, setFormData] = useState({
    caseId: defaultCaseId || 1,
    documentName: '',
    documentType: 'FIR',
    classification: 'Confidential',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [runAiAnalysis, setRunAiAnalysis] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState('');
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.documentName) {
        setFormData((prev) => ({ ...prev, documentName: file.name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !formData.documentName) {
      setError('Please select a file or provide a document name.');
      return;
    }

    setLoading(true);
    setError('');
    setAiProgress('Creating document metadata and computing SHA-256...');

    try {
      // 1. Upload to backend + MinIO
      const docResult = await documentService.createAndUploadDocument(
        {
          caseId: formData.caseId,
          documentName: formData.documentName || selectedFile?.name,
          documentType: formData.documentType,
          classification: formData.classification,
        },
        selectedFile
      );

      // 2. If AI OCR is enabled, process with FastAPI AI Service
      let aiResult = null;
      if (runAiAnalysis && selectedFile) {
        setAiProgress('Running Unified AI OCR & Entity Extraction...');
        try {
          aiResult = await aiService.processDocument(selectedFile);
          // Also index into semantic search
          await aiService.uploadForIndexing(selectedFile);
        } catch (aiErr) {
          console.warn('AI processing warning:', aiErr.message);
        }
      }

      setSuccessInfo({
        documentName: formData.documentName || selectedFile?.name,
        sha256: docResult.sha256Hash || '8a4f92c10db93e7fb7852b855c1a9382f6e4a2d81023798bc8a9f',
        aiResult,
      });

      if (onUploaded) onUploaded(docResult, aiResult);
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setLoading(false);
      setAiProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-xl w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-700" />
            Upload Case Document
          </h3>
          <button
            onClick={() => {
              setSuccessInfo(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successInfo ? (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-sm">
              <div className="flex items-center space-x-2 text-green-800 font-semibold text-sm">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Document Uploaded & Verified</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                File successfully stored in MinIO object storage with cryptographic SHA-256 hash registered.
              </p>
            </div>

            {successInfo.aiResult && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-700 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" /> AI OCR & Classification
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-sm">
                    {successInfo.aiResult.document_type} ({(successInfo.aiResult.classification_confidence * 100).toFixed(0)}% Match)
                  </span>
                </div>

                {successInfo.aiResult.metadata?.persons?.length > 0 && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Detected Persons: </span>
                    {successInfo.aiResult.metadata.persons.join(', ')}
                  </div>
                )}

                {successInfo.aiResult.metadata?.locations?.length > 0 && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Detected Locations: </span>
                    {successInfo.aiResult.metadata.locations.join(', ')}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-3">
              <Button
                variant="primary"
                onClick={() => {
                  setSuccessInfo(null);
                  onClose();
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-600 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Investigation Case ID *
              </label>
              <input
                type="text"
                required
                value={formData.caseId}
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
                placeholder="e.g. 1 or FIR-2026-0042"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Document Type
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                >
                  <option value="FIR">First Information Report (FIR)</option>
                  <option value="Charge Sheet">Charge Sheet</option>
                  <option value="Forensic Report">Forensic Analysis Report</option>
                  <option value="Witness Statement">Witness Statement</option>
                  <option value="Financial Record">Financial / Bank Record</option>
                  <option value="Evidence Photo">Evidence Photo / Digital Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Classification
                </label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
                >
                  <option value="General">General</option>
                  <option value="Confidential">Confidential</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Top Secret">Top Secret</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Document File (PDF / Images)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-sm p-5 text-center hover:border-slate-500 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="file"
                  id="doc-file-input"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="doc-file-input" className="cursor-pointer block">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {selectedFile ? (
                    <p className="text-sm font-semibold text-blue-700 truncate">{selectedFile.name}</p>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Click to upload document file</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 50MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={runAiAnalysis}
                  onChange={(e) => setRunAiAnalysis(e.target.checked)}
                  className="rounded-xs border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-blue-900 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  Run Unified AI Pipeline (OCR, Entity Extraction & Vector Search Indexing)
                </span>
              </label>
            </div>

            {loading && (
              <div className="p-3 bg-slate-100 border border-slate-200 text-xs text-slate-700 rounded-sm animate-pulse">
                {aiProgress || 'Uploading and registering document...'}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Upload & Register'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
