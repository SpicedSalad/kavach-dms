import { useState } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Package, ChevronDown, ChevronUp, Link as LinkIcon, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustodyTimeline } from './CustodyTimeline';

export function EvidenceRow({ item, onTransferClick }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start lg:items-center flex-1">
          <div className="p-2 bg-slate-100 rounded-sm mr-4 shrink-0">
            <Package className="w-6 h-6 text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{item.description}</h3>
            <p className="text-xs text-gray-500 mt-1">
              ID: <span className="font-mono font-medium text-gray-900">EVD-{item.id}</span> • Case: <Link to={`/cases/${item.caseId}`} className="text-blue-600 hover:underline font-medium" onClick={e => e.stopPropagation()}>{item.caseId}</Link> • {item.type}
            </p>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-8">
          <div className="min-w-[150px]">
            <p className="text-[13px] text-gray-500 font-medium mb-1">Current Custodian</p>
            <p className="text-sm font-medium text-gray-900 truncate">{item.custodian}</p>
          </div>
          
          <div className="min-w-[100px]">
            <Badge status={item.status} />
          </div>
          
          <button className="text-gray-400 hover:text-slate-800">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-slate-50 p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-[13px] font-semibold text-gray-600 uppercase tracking-wider flex items-center">
              <QrCode className="w-4 h-4 mr-2 text-slate-500"/> Digital Identity
            </h4>
            <div className="bg-white border border-gray-200 rounded-sm p-4 text-sm">
              <div className="flex justify-center mb-4 pb-4 border-b border-gray-100">
                <div className="w-24 h-24 bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center">
                   <QrCode className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 flex justify-between"><span>Registered:</span> <span className="font-medium text-gray-900">{new Date(item.date).toLocaleDateString()}</span></p>
                <p className="text-xs text-gray-500 flex justify-between"><span>Location:</span> <span className="font-medium text-gray-900">{item.location}</span></p>
              </div>
            </div>
            <Button variant="secondary" className="w-full text-xs">Print QR Label</Button>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[13px] font-semibold text-gray-600 uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center"><LinkIcon className="w-4 h-4 mr-2 text-slate-500"/> Chain of Custody Timeline</div>
              <Button variant="secondary" className="text-xs py-1 px-3" onClick={onTransferClick}>
                Log Transfer
              </Button>
            </h4>
            <div className="bg-white border border-gray-200 rounded-sm p-6 text-sm">
              <CustodyTimeline chain={item.chain} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
