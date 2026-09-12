import { useState } from 'react';
import { X, FolderPlus, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { caseService } from '../../services/caseService';

export function CreateCaseModal({ isOpen, onClose, onCaseCreated }) {
  const [formData, setFormData] = useState({
    caseNumber: `FIR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: '',
    description: '',
    classification: 'Restricted',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.caseNumber) {
      setError('Please provide a Case ID and Title.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const created = await caseService.createCase(formData);
      if (onCaseCreated) onCaseCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-blue-700" />
            New Investigation Case
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Case / FIR Number *
            </label>
            <input
              type="text"
              required
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="e.g. FIR-2026-0099"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Case Title / Subject *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="e.g. Ransomware Extortion Syndicate"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Security Classification Level
            </label>
            <select
              value={formData.classification}
              onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="General">General (Internal Police Access)</option>
              <option value="Confidential">Confidential (Investigating Team)</option>
              <option value="Restricted">Restricted (Designated Officers Only)</option>
              <option value="Top Secret">Top Secret (National Security Protocol)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Incident Description & Scope
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="Provide background, legal provisions invoked (e.g. IT Act 66D, IPC 420), and key entities..."
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm flex items-start space-x-2">
            <Shield className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600">
              Upon submission, an immutable audit event will be recorded and role-based access controls will be initialized.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Case Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
