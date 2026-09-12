import { api } from './api';
import { mockCases } from '../mockData';

export const caseService = {
  /**
   * Fetch all cases from Spring Boot backend (GET /api/cases)
   */
  async getAllCases() {
    try {
      const data = await api.get('/api/cases');
      if (Array.isArray(data)) {
        return data.map((c) => ({
          id: c.caseNumber || `CASE-${c.caseId}`,
          caseId: c.caseId,
          caseNumber: c.caseNumber,
          title: c.title,
          description: c.description,
          type: c.classification || 'Investigation',
          status: c.status || 'ACTIVE',
          assignedOfficer: 'Assigned Team',
          lastUpdated: c.createdAt || new Date().toISOString(),
          priority: 'HIGH',
          classification: c.classification,
        }));
      }
      return mockCases;
    } catch (err) {
      console.warn('[caseService] Using mock fallback:', err.message);
      return mockCases;
    }
  },

  /**
   * Create a new investigation case (POST /api/cases)
   */
  async createCase(caseData) {
    const payload = {
      caseNumber: caseData.caseNumber,
      title: caseData.title,
      description: caseData.description || '',
      classification: caseData.classification || 'Restricted',
    };

    try {
      const created = await api.post('/api/cases', payload);
      return {
        id: created.caseNumber || `CASE-${created.caseId}`,
        caseId: created.caseId,
        caseNumber: created.caseNumber,
        title: created.title,
        description: created.description,
        type: created.classification,
        status: created.status || 'ACTIVE',
        assignedOfficer: 'You',
        lastUpdated: created.createdAt || new Date().toISOString(),
        priority: 'HIGH',
        classification: created.classification,
      };
    } catch (err) {
      console.warn('[caseService] Backend unavailable, simulating case creation:', err.message);
      const simulated = {
        id: payload.caseNumber,
        caseId: Date.now(),
        caseNumber: payload.caseNumber,
        title: payload.title,
        description: payload.description,
        type: payload.classification,
        status: 'ACTIVE',
        assignedOfficer: 'Insp. R. Sharma',
        lastUpdated: new Date().toISOString(),
        priority: 'HIGH',
        classification: payload.classification,
      };
      mockCases.unshift(simulated);
      return simulated;
    }
  },

  /**
   * Get single case by ID or CaseNumber
   */
  async getCaseById(id) {
    const allCases = await this.getAllCases();
    return (
      allCases.find(
        (c) =>
          String(c.caseId) === String(id) ||
          c.caseNumber === id ||
          c.id === id
      ) || null
    );
  },
};
