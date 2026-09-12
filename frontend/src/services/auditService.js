import { api } from './api';
import { mockAuditLogs } from '../mockData';

export const auditService = {
  /**
   * Fetch live audit events from Spring Boot backend (GET /api/audit-events)
   */
  async getAllAuditEvents() {
    try {
      const data = await api.get('/api/audit-events');
      if (Array.isArray(data) && data.length > 0) {
        return data.map((ev) => {
          const date = new Date(ev.timestamp);
          const isToday =
            new Date().toDateString() === date.toDateString();

          return {
            id: ev.auditEventId,
            action: ev.eventType?.replace(/_/g, ' ') || 'SYSTEM ACTION',
            details: ev.details || `Resource #${ev.caseId || ev.documentId || ''}`,
            timestamp: ev.timestamp || new Date().toISOString(),
            user: ev.userId ? `Officer #${ev.userId}` : 'SYSTEM',
            day: isToday ? 'TODAY' : 'YESTERDAY',
            ipAddress: ev.ipAddress,
          };
        });
      }
      return mockAuditLogs;
    } catch (err) {
      console.warn('[auditService] Using mock fallback:', err.message);
      return mockAuditLogs;
    }
  },
};
