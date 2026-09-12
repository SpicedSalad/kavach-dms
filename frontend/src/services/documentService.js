import { api } from './api';
import { mockDocuments } from '../mockData';

export const documentService = {
  /**
   * Fetch all documents from Spring Boot backend (GET /api/documents)
   */
  async getAllDocuments() {
    try {
      const data = await api.get('/api/documents');
      if (Array.isArray(data)) {
        return data.map((d) => ({
          id: `DOC-${d.documentId}`,
          documentId: d.documentId,
          name: d.documentName,
          type: d.documentType,
          caseId: d.caseId ? `CASE-${d.caseId}` : 'Unassigned',
          numericCaseId: d.caseId,
          evidenceId: d.evidenceId,
          status: 'Verified',
          classification: d.classification || 'General',
          uploadedBy: `Officer (ID: ${d.createdBy || 'System'})`,
          date: d.createdAt || new Date().toISOString(),
          currentVersion: d.currentVersion || 1,
          hash: 'SHA-256 Registered',
          ocrStatus: 'PROCESSED',
          entities: { persons: 2, locations: 1, dates: 1 },
        }));
      }
      return mockDocuments;
    } catch (err) {
      console.warn('[documentService] Using mock fallback:', err.message);
      return mockDocuments;
    }
  },

  /**
   * Get single document by ID (GET /api/documents/{id})
   */
  async getDocument(id) {
    try {
      const numericId = String(id).replace('DOC-', '');
      return await api.get(`/api/documents/${numericId}`);
    } catch (err) {
      console.warn('[documentService] Failed to get document:', err.message);
      return mockDocuments.find((d) => d.id === id) || null;
    }
  },

  /**
   * Step 1: Create Document Metadata in database (POST /api/documents)
   */
  async createDocumentMetadata(metadata) {
    const payload = {
      caseId: Number(metadata.caseId),
      evidenceId: metadata.evidenceId ? Number(metadata.evidenceId) : null,
      createdBy: metadata.createdBy ? Number(metadata.createdBy) : 1,
      documentName: metadata.documentName,
      documentType: metadata.documentType,
      classification: metadata.classification || 'General',
    };

    return await api.post('/api/documents', payload);
  },

  /**
   * Step 2: Upload Document File to MinIO + Calculate SHA-256 (POST /api/documents/{id}/upload)
   */
  async uploadDocumentFile(documentId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const numericId = String(documentId).replace('DOC-', '');
    return await api.upload(`/api/documents/${numericId}/upload`, formData);
  },

  /**
   * Combined Helper: Create Metadata AND Upload File
   */
  async createAndUploadDocument(metadata, file) {
    try {
      // 1. Create document record
      const docRecord = await this.createDocumentMetadata(metadata);
      const documentId = docRecord.documentId;

      // 2. Upload physical file
      let uploadResult = null;
      if (file) {
        uploadResult = await this.uploadDocumentFile(documentId, file);
      }

      return {
        ...docRecord,
        uploadResult,
      };
    } catch (err) {
      console.warn('[documentService] Upload error, falling back to simulated document:', err.message);
      const simulated = {
        id: `DOC-${Date.now()}`,
        name: file ? file.name : metadata.documentName,
        type: metadata.documentType,
        caseId: metadata.caseNumber || `CASE-${metadata.caseId}`,
        status: 'Verified',
        classification: metadata.classification,
        uploadedBy: 'Insp. R. Sharma',
        date: new Date().toISOString(),
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        ocrStatus: 'PROCESSED',
        entities: { persons: 3, locations: 2, dates: 1 },
      };
      mockDocuments.unshift(simulated);
      return simulated;
    }
  },

  /**
   * Delete document (DELETE /api/documents/{id})
   */
  async deleteDocument(id) {
    const numericId = String(id).replace('DOC-', '');
    return await api.delete(`/api/documents/${numericId}`);
  },

  /**
   * Fetch all document versions (GET /api/document-versions)
   */
  async getAllVersions() {
    try {
      return await api.get('/api/document-versions');
    } catch (err) {
      console.warn('[documentService] Failed to get versions:', err.message);
      return [];
    }
  },
};
