import { useState } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { FileText, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Clock, Link as LinkIcon, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DocumentRow({ doc }) {
  const [expanded, setExpanded] = useState(false);

  const getIntegrityIcon = (status) => {
    switch(status) {
      case 'Verified': return <CheckCircle className="w-5 h-5 text-green-600 mr-2" />;
      case 'Warning':
      case 'Failed': return <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />;
      default: return <Clock className="w-5 h-5 text-yellow-600 mr-2" />;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start lg:items-center flex-1">
          <FileText className="w-8 h-8 text-gray-400 mr-4 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-700 hover:underline">{doc.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Case: <Link to={`/cases/${doc.caseId}`} className="text-blue-600 hover:underline font-medium" onClick={e => e.stopPropagation()}>{doc.caseId}</Link> • {doc.type} • Uploaded {new Date(doc.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-6">
          <Badge status={doc.classification} />
          
          <div className="flex items-center min-w-[140px]">
            {getIntegrityIcon(doc.status)}
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${doc.status === 'Verified' ? 'text-green-700' : doc.status === 'Failed' ? 'text-red-700' : 'text-yellow-700'}`}>
                {doc.status}
              </p>
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-slate-800">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-slate-50 p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Integrity Pane */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-semibold text-gray-600 uppercase tracking-wider flex items-center">
              <Database className="w-4 h-4 mr-2 text-slate-500"/> Integrity Details
            </h4>
            
            <div className="bg-white border border-gray-200 rounded-sm p-4 text-sm">
              <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
                <span className="text-gray-500">SHA-256</span>
                <span className="col-span-2 font-mono text-gray-900 truncate" title={doc.hash}>{doc.hash}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
                <span className="text-gray-500">Blockchain Record</span>
                <span className="col-span-2 font-medium text-gray-900">{doc.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500">Registered</span>
                <span className="col-span-2 text-gray-900 font-mono text-xs">{new Date(doc.date).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* OCR Processing Pane */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-semibold text-gray-600 uppercase tracking-wider flex items-center">
              <LinkIcon className="w-4 h-4 mr-2 text-slate-500"/> Content Analysis
            </h4>
            
            <div className="bg-white border border-gray-200 rounded-sm p-4 text-sm">
              {doc.ocrStatus === 'PROCESSING' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-semibold text-blue-700 uppercase">Extracting Data</span>
                    <span className="text-xs font-mono text-gray-500">{doc.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 mb-4 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${doc.progress}%` }}></div>
                  </div>
                  <ul className="text-xs space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2"/> Text content</li>
                    <li className="flex items-center"><CheckCircle className="w-3 h-3 text-green-500 mr-2"/> Document type</li>
                    <li className="flex items-center"><span className="w-3 h-3 border border-gray-300 rounded-full mr-2"/> Named Entities</li>
                  </ul>
                </div>
              ) : (
                <div>
                   <p className="text-[13px] font-semibold text-green-700 uppercase mb-3 flex items-center"><CheckCircle className="w-4 h-4 mr-1.5"/> Extraction Complete</p>
                   {doc.entities ? (
                     <div className="flex space-x-4 mt-2">
                       <div className="bg-slate-50 px-3 py-2 border border-slate-200 rounded-sm">
                         <p className="text-xs text-slate-500 uppercase">Persons</p>
                         <p className="font-bold text-slate-900 text-lg">{doc.entities.persons}</p>
                       </div>
                       <div className="bg-slate-50 px-3 py-2 border border-slate-200 rounded-sm">
                         <p className="text-xs text-slate-500 uppercase">Locations</p>
                         <p className="font-bold text-slate-900 text-lg">{doc.entities.locations}</p>
                       </div>
                     </div>
                   ) : (
                     <p className="text-gray-500 text-xs">No extractable entities found.</p>
                   )}
                   <Button variant="secondary" className="mt-4 text-xs py-1 px-3">Review Information</Button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
