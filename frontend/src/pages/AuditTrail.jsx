import { useState, useEffect } from 'react';
import { Download, CheckCircle, ShieldAlert, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { auditService } from '../services/auditService';
import { Button } from '../components/ui/Button';

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAllAuditEvents();
      setLogs(data);
    } catch (err) {
      console.warn('Failed to load audit logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getIcon = (action) => {
    if (action.includes('Integrity') || action.includes('GRANTED') || action.includes('VERIFIED')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (action.includes('Denied') || action.includes('DENIED') || action.includes('Failed')) {
      return <ShieldAlert className="w-5 h-5 text-red-600" />;
    }
    if (action.includes('Transferred') || action.includes('TRANSFER')) {
      return <ArrowRight className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-slate-600" />;
  };

  const groupedLogs = {
    TODAY: logs.filter((l) => l.day === 'TODAY'),
    YESTERDAY: logs.filter((l) => l.day === 'YESTERDAY'),
    EARLIER: logs.filter((l) => l.day !== 'TODAY' && l.day !== 'YESTERDAY'),
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">System Activity Audit Trail</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chronological, immutable log of operational events, ABAC authorization checks, and security audits.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={fetchLogs}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" /> Export Log
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Querying security audit ledger...</div>
        ) : (
          Object.entries(groupedLogs)
            .filter(([, group]) => group.length > 0)
            .map(([day, dayLogs], groupIdx) => (
              <div key={day} className={groupIdx > 0 ? 'border-t border-gray-200' : ''}>
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h2 className="text-[13px] font-semibold text-gray-600 uppercase tracking-wider">{day}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {dayLogs.map((log) => (
                    <div key={log.id} className="p-6 flex space-x-6 hover:bg-slate-50 transition-colors">
                      <div className="text-right w-20 shrink-0 pt-1">
                        <p className="text-xs font-mono text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-1 flex space-x-4">
                        <div className="shrink-0 mt-0.5">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-2xs">
                            {getIcon(log.action)}
                          </div>
                        </div>
                        <div>
                          <p className="text-base font-bold text-gray-900">{log.action}</p>
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                          <div className="flex items-center space-x-3 mt-2 text-xs">
                            <span className="font-semibold text-blue-700">{log.user}</span>
                            {log.ipAddress && (
                              <span className="text-slate-400 font-mono text-[11px]">IP: {log.ipAddress}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
