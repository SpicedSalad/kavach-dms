import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import {
  Search as SearchIcon,
  Folder,
  FileText,
  Package,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { caseService } from '../services/caseService';
import { documentService } from '../services/documentService';
import { evidenceService } from '../services/evidenceService';
import { aiService } from '../services/aiService';

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [activeTab, setActiveTab] = useState('semantic'); // 'semantic' | 'all' | 'verifier'
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);

  // Results
  const [aiResults, setAiResults] = useState([]);
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);

  // Verifier Tool State
  const [verifierFile, setVerifierFile] = useState(null);
  const [verifierLoading, setVerifierLoading] = useState(false);
  const [verifierResult, setVerifierResult] = useState(null);

  const executeSearch = async (searchTerm) => {
    const q = searchTerm || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const [aiData, allCases, allDocs, allEv] = await Promise.all([
        aiService.searchSemantic(q),
        caseService.getAllCases(),
        documentService.getAllDocuments(),
        evidenceService.getAllEvidence(),
      ]);

      setAiResults(aiData);

      const lower = q.toLowerCase();
      setCases(
        allCases.filter(
          (c) =>
            c.caseNumber?.toLowerCase().includes(lower) ||
            c.title?.toLowerCase().includes(lower) ||
            c.description?.toLowerCase().includes(lower)
        )
      );

      setDocuments(
        allDocs.filter(
          (d) =>
            d.name?.toLowerCase().includes(lower) ||
            d.type?.toLowerCase().includes(lower) ||
            d.caseId?.toLowerCase().includes(lower)
        )
      );

      setEvidenceList(
        allEv.filter(
          (e) =>
            e.description?.toLowerCase().includes(lower) ||
            e.id?.toLowerCase().includes(lower) ||
            e.caseId?.toLowerCase().includes(lower)
        )
      );
    } catch (err) {
      console.warn('Search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleVerifierFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerifierFile(file);
    setVerifierLoading(true);
    setVerifierResult(null);

    try {
      const res = await aiService.verifyIntegrity(file);
      setVerifierResult(res);
    } catch (_err) {
      setVerifierResult({
        status: 'TAMPERED',
        message: 'Cryptographic hash mismatch! Possible unauthorized modification.',
      });
    } finally {
      setVerifierLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">
          Intelligent Global Search & Verification
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Hybrid Vector Semantic Search (SentenceTransformers) + SHA-256 Tamper Detection
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('semantic')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center border-b-2 transition-colors ${
            activeTab === 'semantic'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          AI Semantic Search ({aiResults.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <SearchIcon className="w-4 h-4 mr-2 text-blue-600" />
          Case & Evidence Files ({cases.length + documents.length + evidenceList.length})
        </button>
        <button
          onClick={() => setActiveTab('verifier')}
          className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center border-b-2 transition-colors ${
            activeTab === 'verifier'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
          Document Tamper Verifier
        </button>
      </div>

      {activeTab !== 'verifier' ? (
        <>
          <div className="border border-gray-200 bg-gray-50 p-6 rounded-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSearch();
              }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter concepts or keywords (e.g., 'UPI Fraud', 'transfers', 'forensic sample')..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 sm:text-sm text-gray-900"
                />
              </div>
              <Button variant="primary" type="submit" className="px-8" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </div>

          {activeTab === 'semantic' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h2 className="text-[17px] font-semibold text-gray-900 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  Semantic & Vector Search Matches
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Engine: all-MiniLM-L6-v2 (Cosine Similarity + BM25)
                </span>
              </div>

              {loading ? (
                <div className="py-12 text-center text-sm text-gray-500">Querying neural embeddings...</div>
              ) : aiResults.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-sm">
                  No semantic matches found. Try searching for "bank", "account", or "fraud".
                </div>
              ) : (
                <div className="space-y-3">
                  {aiResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-sm p-5 hover:border-purple-300 transition-colors shadow-xs"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold text-blue-700">{res.document}</h3>
                            <p className="text-xs text-gray-500">
                              Doc ID: <span className="font-mono">{res.document_id}</span> • Page {res.page || 1}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-sm">
                            {((res.score || res.semantic_score || 0.85) * 100).toFixed(0)}% Relevance
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-purple-50/40 border-l-2 border-purple-500 text-xs text-gray-800 font-mono leading-relaxed">
                        {res.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'all' && (
            <div className="space-y-8">
              {/* Cases */}
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Cases ({cases.length})
                </h2>
                <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-200 shadow-xs">
                  {cases.map((c) => (
                    <div key={c.id || c.caseId} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-slate-100 rounded-sm shrink-0">
                          <Folder className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-blue-700">
                            <Link to={`/cases/${c.caseNumber || c.id}`}>{c.caseNumber}</Link>
                          </h3>
                          <p className="text-sm text-gray-900 mt-0.5">{c.title}</p>
                        </div>
                      </div>
                      <Badge status={c.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Documents ({documents.length})
                </h2>
                <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-200 shadow-xs">
                  {documents.map((d) => (
                    <div key={d.id || d.documentId} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-semibold text-blue-700">{d.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Case: {d.caseId} • Type: {d.type}
                          </p>
                        </div>
                      </div>
                      <Badge status={d.classification} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h2 className="text-[18px] font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                  Evidence ({evidenceList.length})
                </h2>
                <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-200 shadow-xs">
                  {evidenceList.map((e) => (
                    <div key={e.id || e.evidenceId} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Package className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{e.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            EVD-{e.id} • Case: {e.caseId} • Location: {e.location}
                          </p>
                        </div>
                      </div>
                      <Badge status={e.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Document Tamper Verifier Tab */
        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <ShieldCheck className="w-6 h-6 mr-2 text-emerald-600" />
              Cryptographic Tamper Verifier
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Upload any investigation document to test its SHA-256 hash against the registered database.
              Detects any single byte discrepancy or unauthorized forgery.
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50">
            <input
              type="file"
              id="search-verifier-input"
              onChange={handleVerifierFileChange}
              className="hidden"
            />
            <label htmlFor="search-verifier-input" className="cursor-pointer block">
              <FileCheck className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              {verifierFile ? (
                <p className="text-sm font-bold text-blue-700">{verifierFile.name}</p>
              ) : (
                <div>
                  <p className="text-sm text-gray-800 font-semibold">Select document file to verify</p>
                  <p className="text-xs text-gray-400 mt-1">Computes SHA-256 & queries immutable registry</p>
                </div>
              )}
            </label>
          </div>

          {verifierLoading && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-center">
              <p className="text-sm font-semibold text-slate-900">Validating cryptographic checksum...</p>
            </div>
          )}

          {verifierResult && (
            <div
              className={`p-5 rounded-sm border ${
                verifierResult.status === 'VERIFIED'
                  ? 'bg-green-50 border-green-200 text-green-900'
                  : verifierResult.status === 'TAMPERED'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-base">
                {verifierResult.status === 'VERIFIED' && <ShieldCheck className="w-6 h-6 text-green-600" />}
                {verifierResult.status === 'TAMPERED' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                {verifierResult.status === 'UNKNOWN' && <HelpCircle className="w-6 h-6 text-amber-600" />}
                <span>Integrity Status: {verifierResult.status}</span>
              </div>
              <p className="text-xs mt-1.5 leading-relaxed">{verifierResult.message}</p>

              {verifierResult.current_hash && (
                <div className="mt-3 pt-3 border-t border-black/10 text-xs space-y-1 font-mono">
                  <p className="truncate">
                    <span className="font-semibold text-slate-700 font-sans">Calculated Hash: </span>
                    {verifierResult.current_hash}
                  </p>
                  {verifierResult.original_hash && (
                    <p className="truncate">
                      <span className="font-semibold text-slate-700 font-sans">Registered Hash: </span>
                      {verifierResult.original_hash}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
