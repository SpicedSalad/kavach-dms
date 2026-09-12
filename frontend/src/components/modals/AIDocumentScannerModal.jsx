import { useState } from 'react';
import { X, Sparkles, FileText, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { aiService } from '../../services/aiService';

export function AIDocumentScannerModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await aiService.processDocument(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'AI processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-2xl w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            AI Document Intelligence & OCR Scanner
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select or Drop Document to Analyze (PDF, PNG, JPG)
            </label>
            <div className="border-2 border-dashed border-purple-200 rounded-sm p-6 text-center hover:border-purple-500 transition-colors cursor-pointer bg-purple-50/20">
              <input
                type="file"
                id="ai-scanner-file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="ai-scanner-file" className="cursor-pointer block">
                <Cpu className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                {selectedFile ? (
                  <p className="text-sm font-semibold text-purple-900">{selectedFile.name}</p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Click to select an investigation document</p>
                    <p className="text-xs text-gray-400 mt-1">Runs Optical Character Recognition + Named Entity Extraction</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {loading && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-sm text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700 mb-2"></div>
              <p className="text-sm font-semibold text-purple-900">Running Unified AI Pipeline...</p>
              <p className="text-xs text-purple-700 mt-1">Extracting text, classifying document type, detecting entities</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-600 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {/* Classification Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classification</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">{result.document_type}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Method: {result.extraction_method}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</span>
                    <p className="text-lg font-bold text-purple-700 mt-0.5">
                      {((result.classification_confidence || 0.9) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Entities */}
              {result.metadata && (
                <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-3">
                  <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Extracted Named Entities
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {result.metadata.persons?.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-1">Persons / Suspects:</span>
                        <span className="text-slate-900">{result.metadata.persons.join(', ')}</span>
                      </div>
                    )}
                    {result.metadata.locations?.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-1">Locations / Jurisdictions:</span>
                        <span className="text-slate-900">{result.metadata.locations.join(', ')}</span>
                      </div>
                    )}
                    {result.metadata.dates?.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-1">Incident Dates:</span>
                        <span className="text-slate-900">{result.metadata.dates.join(', ')}</span>
                      </div>
                    )}
                    {result.metadata.case_numbers?.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-1">Referenced Case IDs:</span>
                        <span className="text-slate-900 font-mono">{result.metadata.case_numbers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Extract Preview */}
              {result.text && (
                <div className="border border-gray-200 rounded-sm p-4 bg-gray-50">
                  <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    OCR Extracted Text Transcript
                  </h5>
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto bg-white p-3 border border-gray-200 rounded-sm">
                    {result.text}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
