import { useState } from 'react';
import { X, Package, QrCode } from 'lucide-react';
import { Button } from '../ui/Button';
import { evidenceService } from '../../services/evidenceService';

export function RegisterEvidenceModal({ isOpen, onClose, defaultCaseId, onRegistered }) {
  const [formData, setFormData] = useState({
    caseId: defaultCaseId || 1,
    evidenceCode: `EVD-2026-${Math.floor(100 + Math.random() * 900)}`,
    barcodeOrQr: `QR-EVD-${Math.floor(10000 + Math.random() * 90000)}`,
    description: '',
    evidenceType: 'Digital Device',
    status: 'Verified',
    currentLocation: 'Evidence Locker B-12',
    currentHolder: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      setError('Please provide a description of the physical evidence.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await evidenceService.registerEvidence(formData);
      if (onRegistered) onRegistered(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register evidence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-700" />
            Register Physical Evidence Asset
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Case ID *
              </label>
              <input
                type="text"
                required
                value={formData.caseId}
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Asset Code
              </label>
              <input
                type="text"
                value={formData.evidenceCode}
                onChange={(e) => setFormData({ ...formData, evidenceCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Asset Description *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="e.g. Apple MacBook Pro M2 (Serial # C02XYZ123)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Evidence Type
              </label>
              <select
                value={formData.evidenceType}
                onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <option value="Digital Device">Digital Device (Mobile, Laptop)</option>
                <option value="Digital Media">Digital Storage Media (USB, SSD)</option>
                <option value="Physical Document">Physical Document / Contract</option>
                <option value="Biological / Forensic">Biological / Forensic Sample</option>
                <option value="Weapon / Contraband">Weapon / Contraband</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Initial Storage Location
              </label>
              <input
                type="text"
                required
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
                placeholder="e.g. Safe Vault 3"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm flex items-center space-x-3">
            <QrCode className="w-8 h-8 text-slate-600 shrink-0" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Assigned QR Barcode: </span>
              <span className="font-mono text-blue-700">{formData.barcodeOrQr}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">A secure cryptographic asset identity tag will be minted.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Evidence'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
