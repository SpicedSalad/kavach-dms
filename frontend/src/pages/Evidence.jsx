import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { evidenceService } from '../services/evidenceService';
import { EvidenceRow } from '../components/ui/EvidenceRow';
import { RegisterEvidenceModal } from '../components/modals/RegisterEvidenceModal';
import { TransferCustodyModal } from '../components/modals/TransferCustodyModal';

export default function Evidence() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvidenceForTransfer, setSelectedEvidenceForTransfer] = useState(null);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const data = await evidenceService.getAllEvidence();
      setEvidenceList(data);
    } catch (err) {
      console.warn('Failed to load evidence:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const filteredEvidence = evidenceList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.description?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q) ||
      item.caseId?.toLowerCase().includes(q) ||
      item.custodian?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q);

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">Evidence Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">
            Digital identity, QR codes, and unbroken chain of custody for physical and digital investigation assets.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={fetchEvidence}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowRegisterModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Register Evidence
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
            placeholder="Search by Evidence ID, Case ID, custodian, or keyword..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-800"
        >
          <option value="ALL">All Types</option>
          <option value="Digital Device">Digital Device</option>
          <option value="Digital Media">Digital Storage Media</option>
          <option value="Physical Document">Physical Document</option>
          <option value="Biological / Forensic">Biological / Forensic</option>
        </select>
      </div>

      <div className="border-t border-gray-300">
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading evidence registry...</div>
        ) : filteredEvidence.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">No matching evidence records found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvidence.map((item) => (
              <EvidenceRow
                key={item.id || item.evidenceId}
                item={item}
                onTransferClick={() => setSelectedEvidenceForTransfer(item)}
              />
            ))}
          </div>
        )}
      </div>

      <RegisterEvidenceModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegistered={() => fetchEvidence()}
      />

      <TransferCustodyModal
        isOpen={!!selectedEvidenceForTransfer}
        evidence={selectedEvidenceForTransfer}
        onClose={() => setSelectedEvidenceForTransfer(null)}
        onTransferred={() => fetchEvidence()}
      />
    </div>
  );
}
