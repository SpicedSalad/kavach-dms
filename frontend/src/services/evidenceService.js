import { api } from './api';
import { mockEvidence } from '../mockData';

export const evidenceService = {
  /**
   * Fetch all physical evidence items (GET /api/evidence)
   */
  async getAllEvidence() {
    try {
      const data = await api.get('/api/evidence');
      if (Array.isArray(data)) {
        // Fetch custody events to build the timeline
        let events = [];
        try {
          events = await api.get('/api/custody-events');
        } catch {
          // ignore
        }

        return data.map((e) => {
          // Filter events for this evidence item
          const itemEvents = Array.isArray(events)
            ? events.filter((ev) => ev.evidenceId === e.evidenceId)
            : [];

          const chain =
            itemEvents.length > 0
              ? itemEvents.map((ev) => ({
                  step: ev.eventType || 'TRANSFER',
                  date: ev.timestamp || new Date().toISOString(),
                  by: `Officer ID: ${ev.transferredBy || 'System'}`,
                  location: ev.toLocation,
                }))
              : [
                  {
                    step: 'REGISTERED',
                    date: new Date().toISOString(),
                    by: 'Investigating Officer',
                    location: e.currentLocation,
                  },
                ];

          return {
            id: String(e.evidenceId),
            evidenceId: e.evidenceId,
            caseId: e.caseId ? `CASE-${e.caseId}` : 'Unassigned',
            numericCaseId: e.caseId,
            description: e.description,
            type: e.evidenceType,
            status: e.status,
            location: e.currentLocation,
            custodian: e.currentHolder ? `User #${e.currentHolder}` : 'Evidence Locker',
            date: new Date().toISOString(),
            barcodeOrQr: e.barcodeOrQr || `QR-EVD-${e.evidenceId}`,
            evidenceCode: e.evidenceCode || `CODE-${e.evidenceId}`,
            chain,
          };
        });
      }
      return mockEvidence;
    } catch (err) {
      console.warn('[evidenceService] Using mock fallback:', err.message);
      return mockEvidence;
    }
  },

  /**
   * Register new physical evidence (POST /api/evidence)
   */
  async registerEvidence(data) {
    const payload = {
      caseId: Number(data.caseId),
      evidenceCode: data.evidenceCode || `EVD-${Date.now().toString().slice(-4)}`,
      barcodeOrQr: data.barcodeOrQr || `QR-${Date.now().toString().slice(-6)}`,
      description: data.description,
      evidenceType: data.evidenceType || 'Digital Device',
      status: data.status || 'Verified',
      currentLocation: data.currentLocation || 'Evidence Locker A-1',
      currentHolder: data.currentHolder ? Number(data.currentHolder) : 1,
    };

    try {
      const res = await api.post('/api/evidence', payload);
      return {
        id: String(res.evidenceId),
        evidenceId: res.evidenceId,
        caseId: `CASE-${res.caseId}`,
        description: res.description,
        type: res.evidenceType,
        status: res.status,
        location: res.currentLocation,
        custodian: 'Officer',
        date: new Date().toISOString(),
        barcodeOrQr: res.barcodeOrQr,
        evidenceCode: res.evidenceCode,
        chain: [
          {
            step: 'REGISTERED',
            date: new Date().toISOString(),
            by: 'Investigating Officer',
          },
        ],
      };
    } catch (err) {
      console.warn('[evidenceService] Simulation fallback for evidence registration:', err.message);
      const simulated = {
        id: String(Date.now()).slice(-5),
        description: payload.description,
        type: payload.evidenceType,
        caseId: data.caseNumber || `CASE-${payload.caseId}`,
        status: 'Verified',
        location: payload.currentLocation,
        custodian: 'Investigating Officer',
        date: new Date().toISOString(),
        chain: [
          {
            step: 'REGISTERED',
            date: new Date().toISOString(),
            by: 'Insp. R. Sharma',
          },
        ],
      };
      mockEvidence.unshift(simulated);
      return simulated;
    }
  },

  /**
   * Log a custody transfer event (POST /api/custody-events)
   */
  async logCustodyEvent(data) {
    const payload = {
      evidenceId: Number(data.evidenceId),
      fromHolder: data.fromHolder ? Number(data.fromHolder) : null,
      toHolder: data.toHolder ? Number(data.toHolder) : 2,
      transferredBy: data.transferredBy ? Number(data.transferredBy) : 1,
      fromLocation: data.fromLocation || '',
      toLocation: data.toLocation || 'Forensic Lab',
      eventType: data.eventType || 'CUSTODY_TRANSFER',
    };

    try {
      return await api.post('/api/custody-events', payload);
    } catch (err) {
      console.warn('[evidenceService] Simulation fallback for custody transfer:', err.message);
      return {
        custodyEventId: Date.now(),
        ...payload,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Fetch all custody events (GET /api/custody-events)
   */
  async getAllCustodyEvents() {
    try {
      return await api.get('/api/custody-events');
    } catch (err) {
      console.warn('[evidenceService] Failed to get custody events:', err.message);
      return [];
    }
  },
};
