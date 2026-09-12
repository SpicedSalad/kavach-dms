import { useState } from 'react';
import { X, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { evidenceService } from '../../services/evidenceService';

export function TransferCustodyModal({ isOpen, onClose, evidence, onTransferred }) {
  const [formData, setFormData] = useState({
    eventType: 'TRANSFER_TO_FORENSICS',
    toLocation: 'Central Forensic Science Laboratory (CFSL)',
    toHolder: 2,
    reason: 'Forensic bit-stream imaging and memory extraction',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !evidence) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await evidenceService.logCustodyEvent({
        evidenceId: evidence.evidenceId || evidence.id,
        fromLocation: evidence.location,
        toLocation: formData.toLocation,
        toHolder: formData.toHolder,
        eventType: formData.eventType,
        reason: formData.reason,
      });

      if (onTransferred) onTransferred();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record custody transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <ArrowRightLeft className="w-5 h-5 mr-2 text-blue-700" />
            Log Chain of Custody Transfer
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

          <div className="p-3 bg-slate-100 rounded-sm border border-slate-200">
            <p className="text-xs font-semibold uppercase text-slate-500">Evidence Asset</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{evidence.description}</p>
            <p className="text-xs text-slate-600 mt-1">
              Current Location: <span className="font-semibold">{evidence.location}</span> • Current Custodian: <span className="font-semibold">{evidence.custodian}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Transfer Event Type *
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="TRANSFER_TO_FORENSICS">Transfer to Forensic Laboratory</option>
              <option value="COURT_PRODUCTION">Court Production / Judicial Custody</option>
              <option value="STORAGE_RELOCATION">Storage Vault Relocation</option>
              <option value="OFFICER_HANDOVER">Investigating Officer Handover</option>
              <option value="EVIDENCE_DISPOSAL">Sealed Disposal / Destruction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Destination Location *
            </label>
            <input
              type="text"
              required
              value={formData.toLocation}
              onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="e.g. Special Judge Court Room 4"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Purpose / Reason for Movement
            </label>
            <textarea
              rows={2}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="e.g. Production during bail hearing..."
            />
          </div>

          <div className="bg-green-50 border border-green-200 p-3 rounded-sm flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-green-700 mt-0.5 shrink-0" />
            <p className="text-xs text-green-800">
              Custody transfers are cryptographically signed, creating an unbroken chain of custody record in the backend audit database.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Record Transfer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
