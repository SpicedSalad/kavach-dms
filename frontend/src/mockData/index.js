export const mockCases = [
  {
    id: 'FIR-2026-0042',
    caseNumber: 'FIR-2026-0042',
    title: 'UPI Fraud Investigation',
    type: 'Cyber Crime',
    status: 'ACTIVE',
    assignedOfficer: 'Insp. R. Sharma',
    lastUpdated: '2026-09-10T14:32:00Z',
    priority: 'HIGH'
  },
  {
    id: 'INV-2026-0189',
    caseNumber: 'INV-2026-0189',
    title: 'Inter-state Narcotics Smuggling',
    type: 'Narcotics',
    status: 'ACTIVE',
    assignedOfficer: 'SI A. Kumar',
    lastUpdated: '2026-09-09T10:15:00Z',
    priority: 'HIGH'
  },
  {
    id: 'FOR-2026-0091',
    caseNumber: 'FOR-2026-0091',
    title: 'Passport Forgery Syndicate',
    type: 'Forgery',
    status: 'CLOSED',
    assignedOfficer: 'ACP M. Singh',
    lastUpdated: '2026-08-15T09:00:00Z',
    priority: 'MEDIUM'
  }
];

export const mockDocuments = [
  {
    id: 'DOC-101',
    name: 'Initial_FIR_Report.pdf',
    type: 'FIR',
    caseId: 'FIR-2026-0042',
    status: 'Verified', 
    classification: 'General',
    uploadedBy: 'Insp. R. Sharma',
    date: '2026-09-08T18:42:00Z',
    hash: '8a4f92c10db93e7f',
    ocrStatus: 'PROCESSED',
    entities: { persons: 2, locations: 1, dates: 1 }
  },
  {
    id: 'DOC-102',
    name: 'Suspect_Interview_Transcript.pdf',
    type: 'Witness Statement',
    caseId: 'FIR-2026-0042',
    status: 'Processing',
    classification: 'Confidential',
    uploadedBy: 'Insp. R. Sharma',
    date: '2026-09-10T09:14:00Z',
    hash: 'Pending...',
    ocrStatus: 'PROCESSING',
    progress: 78
  },
  {
    id: 'DOC-103',
    name: 'Bank_Transaction_Report.pdf',
    type: 'Financial Record',
    caseId: 'FIR-2026-0042',
    status: 'Verified',
    classification: 'Restricted',
    uploadedBy: 'ACP M. Singh',
    date: '2026-09-09T11:00:00Z',
    hash: 'b7f29a009c123',
    ocrStatus: 'PROCESSED',
    entities: { persons: 4, locations: 2, dates: 3 }
  },
  {
    id: 'DOC-104',
    name: 'Charge_Sheet_Final.pdf',
    type: 'Charge Sheet',
    caseId: 'INV-2026-0189',
    status: 'Failed',
    classification: 'Confidential',
    uploadedBy: 'SI A. Kumar',
    date: '2026-09-01T14:00:00Z',
    hash: 'c1a9382',
    ocrStatus: 'PROCESSED',
    entities: { persons: 6, locations: 4, dates: 2 }
  }
];

export const mockEvidence = [
  {
    id: '00421',
    description: 'Mobile Phone (iPhone 15 Pro)',
    type: 'Digital Device',
    caseId: 'FIR-2026-0042',
    status: 'Verified',
    location: 'Locker B-42',
    custodian: 'Forensic Laboratory',
    date: '2026-09-10T11:42:00Z',
    chain: [
      { step: 'SEIZED', date: '2026-09-08T18:42:00Z', by: 'Field Team' },
      { step: 'INVESTIGATING OFFICER', date: '2026-09-09T10:15:00Z', by: 'Insp. R. Sharma' },
      { step: 'FORENSIC LAB', date: '2026-09-10T11:42:00Z', by: 'SI A. Kumar' },
      { step: 'CURRENT CUSTODIAN', date: '2026-09-10T11:42:00Z', by: 'Forensic Laboratory' }
    ]
  },
  {
    id: '00422',
    description: 'USB Storage Device (64GB)',
    type: 'Digital Media',
    caseId: 'FIR-2026-0042',
    status: 'In Transit',
    location: 'Transport Vehicle DL-01',
    custodian: 'Insp. R. Sharma',
    date: '2026-09-10T14:00:00Z',
    chain: [
      { step: 'SEIZED', date: '2026-09-09T14:00:00Z', by: 'Insp. R. Sharma' },
      { step: 'CURRENT CUSTODIAN', date: '2026-09-10T14:00:00Z', by: 'Insp. R. Sharma' }
    ]
  }
];

export const mockAuditLogs = [
  { id: 1, action: 'Document Integrity Registered', details: 'SHA-256 hash registered on Fabric channel.', timestamp: '2026-09-10T14:35:00Z', user: 'SYSTEM', day: 'TODAY' },
  { id: 2, action: 'OCR Processing Completed', details: 'Extracted 4 entities from Bank_Transaction_Report.pdf.', timestamp: '2026-09-10T14:34:00Z', user: 'AI_SERVICE', day: 'TODAY' },
  { id: 3, action: 'Document Uploaded', details: 'Initial_FIR_Report.pdf added to FIR-2026-0042.', timestamp: '2026-09-10T14:32:00Z', user: 'Insp. R. Sharma', day: 'TODAY' },
  { id: 4, action: 'Evidence Transferred', details: 'EVD-00421 transferred to Forensic Laboratory.', timestamp: '2026-09-09T17:21:00Z', user: 'Insp. R. Sharma', day: 'YESTERDAY' },
  { id: 5, action: 'Access Denied', details: 'Failed attempt to view Restricted document DOC-103.', timestamp: '2026-09-09T11:15:00Z', user: 'Constable Unknown', day: 'YESTERDAY' }
];

export const getRecentCases = () => mockCases.filter(c => c.status === 'ACTIVE').slice(0, 5);
export const getRecentDocuments = () => mockDocuments.slice(0, 5);
export const getCaseById = (id) => mockCases.find(c => c.id === id);
export const getDocumentsByCaseId = (caseId) => mockDocuments.filter(d => d.caseId === caseId);
export const getEvidenceByCaseId = (caseId) => mockEvidence.filter(e => e.caseId === caseId);
