import { Download, CheckCircle, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { mockAuditLogs } from '../mockData';
import { Button } from '../components/ui/Button';

export default function AuditTrail() {
  const getIcon = (action) => {
    if (action.includes('Integrity')) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (action.includes('Denied') || action.includes('Failed')) return <ShieldAlert className="w-5 h-5 text-red-600" />;
    if (action.includes('Transferred')) return <ArrowRight className="w-5 h-5 text-blue-600" />;
    return <FileText className="w-5 h-5 text-slate-600" />;
  };

  const groupedLogs = {
    'TODAY': mockAuditLogs.filter(l => l.day === 'TODAY'),
    'YESTERDAY': mockAuditLogs.filter(l => l.day === 'YESTERDAY')
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">System Activity</h1>
          <p className="text-sm text-gray-500 mt-1">Chronological log of operational events and security audits.</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-2"/> Export Log</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm">
        {Object.entries(groupedLogs).map(([day, logs], groupIdx) => (
          <div key={day} className={groupIdx > 0 ? "border-t border-gray-200" : ""}>
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h2 className="text-[13px] font-semibold text-gray-500">{day}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="p-6 flex space-x-6 hover:bg-slate-50 transition-colors">
                  <div className="text-right w-16 shrink-0 pt-1">
                    <p className="text-sm font-mono text-gray-500">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className="flex-1 flex space-x-4">
                    <div className="shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        {getIcon(log.action)}
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      <p className="text-xs font-medium text-blue-700 mt-2">{log.user}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
