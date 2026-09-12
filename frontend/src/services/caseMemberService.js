import { api } from './api';

export const caseMemberService = {
  /**
   * Fetch all case members across cases (GET /api/case-members)
   */
  async getAllMembers() {
    try {
      return await api.get('/api/case-members');
    } catch (err) {
      console.warn('[caseMemberService] Fallback:', err.message);
      return [
        {
          membershipId: 1,
          caseId: 1,
          userEmail: 'sharma@kavach.gov.in',
          userName: 'Insp. R. Sharma',
          accessLevel: 'FULL',
          status: 'ACTIVE',
        },
        {
          membershipId: 2,
          caseId: 1,
          userEmail: 'kumar@kavach.gov.in',
          userName: 'SI A. Kumar',
          accessLevel: 'WRITE',
          status: 'ACTIVE',
        },
      ];
    }
  },

  /**
   * Add a new member to a case (POST /api/case-members)
   */
  async addMember(data) {
    const payload = {
      caseId: Number(data.caseId),
      userEmail: data.userEmail,
      accessLevel: data.accessLevel || 'READ', // READ, WRITE, FULL
    };

    return await api.post('/api/case-members', payload);
  },

  /**
   * Remove a member from a case (DELETE /api/case-members/{id})
   */
  async removeMember(id) {
    return await api.delete(`/api/case-members/${id}`);
  },
};
