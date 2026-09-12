import { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { caseMemberService } from '../../services/caseMemberService';

export function AddCaseMemberModal({ isOpen, onClose, caseId, onMemberAdded }) {
  const [userEmail, setUserEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('READ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      setError('Please enter the officer email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const added = await caseMemberService.addMember({
        caseId: caseId || 1,
        userEmail,
        accessLevel,
      });
      if (onMemberAdded) onMemberAdded(added);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-md w-full border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-slate-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-700" />
            Assign Case Member
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
              Officer Email Address *
            </label>
            <input
              type="email"
              required
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-800"
              placeholder="e.g. sharma@kavach.gov.in"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Access & Authorization Level
            </label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
            >
              <option value="READ">READ (View case documents and evidence)</option>
              <option value="WRITE">WRITE (Upload documents, register evidence, log custody)</option>
              <option value="FULL">FULL (Manage case members, delete documents, close case)</option>
            </select>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm flex items-start space-x-2">
            <Shield className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600">
              KavachDMS enforces strict Attribute-Based Access Control (ABAC). Only authorized team members may view case contents.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Assigning...' : 'Assign Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
