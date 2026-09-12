import { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, FileCheck, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { aiService } from '../../services/aiService';

export function IntegrityVerifierModal({ isOpen, onClose }) {
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
      const res = await aiService.verifyIntegrity(file);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-700" />
            Document Integrity & Tamper Verifier
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs text-gray-500 mb-3">
              Upload any document to compute its cryptographic SHA-256 hash and verify whether it matches the registered ledger record.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-sm p-6 text-center hover:border-slate-500 transition-colors cursor-pointer bg-slate-50/50">
              <input
                type="file"
                id="integrity-file-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="integrity-file-input" className="cursor-pointer block">
                <FileCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                {selectedFile ? (
                  <p className="text-sm font-semibold text-blue-700">{selectedFile.name}</p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Select file to verify integrity</p>
                    <p className="text-xs text-gray-400 mt-1">Tests for bit-level tampering or forgery</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {loading && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-center">
              <p className="text-sm font-semibold text-slate-900">Computing SHA-256 & querying integrity records...</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm">
              {error}
            </div>
          )}

          {result && (
            <div
              className={`p-4 rounded-sm border ${
                result.status === 'VERIFIED'
                  ? 'bg-green-50 border-green-200 text-green-900'
                  : result.status === 'TAMPERED'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-yellow-50 border-yellow-200 text-yellow-900'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-base">
                {result.status === 'VERIFIED' && <ShieldCheck className="w-6 h-6 text-green-600" />}
                {result.status === 'TAMPERED' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                {result.status === 'UNKNOWN' && <HelpCircle className="w-6 h-6 text-yellow-600" />}
                <span>Status: {result.status}</span>
              </div>
              <p className="text-xs mt-1 leading-relaxed">{result.message}</p>

              {result.current_hash && (
                <div className="mt-3 pt-3 border-t border-black/10 text-xs space-y-1 font-mono">
                  <p className="truncate">
                    <span className="font-semibold text-slate-700 font-sans">Current Hash: </span>
                    {result.current_hash}
                  </p>
                  {result.original_hash && (
                    <p className="truncate">
                      <span className="font-semibold text-slate-700 font-sans">Original Hash: </span>
                      {result.original_hash}
                    </p>
                  )}
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
