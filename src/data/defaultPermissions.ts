import { RolePermissionsMatrix, UserRole } from '../types';

export const DEFAULT_PERMISSIONS_MATRIX: Record<UserRole, RolePermissionsMatrix> = {
  superadmin: {
    properties: {
      viewPublic: true,
      viewInternal: true,
      viewConfidential: true,
      create: true,
      edit: true,
      delete: true,
      exportData: true
    },
    contacts: {
      viewPublic: true,
      viewInternal: true,
      viewConfidential: true,
      create: true,
      edit: true,
      delete: true,
      exportData: true,
      viewAllContacts: true,
      viewOwnerPhone: true
    },
    mandates: {
      view: true,
      create: true,
      editConditions: true,
      close: true,
      export: true
    },
    offers: {
      view: true,
      createOffer: true,
      counterOffer: true,
      acceptDeed: true
    },
    closing: {
      view: true,
      manageNotary: true,
      viewCommissions: true
    },
    financialStats: {
      viewGlobalRevenue: true,
      viewAgentCommissions: true,
      viewAgencyMargin: true
    },
    auditLogs: {
      viewLogs: true,
      purgeLogs: true
    },
    apiAndSyndication: {
      manageChannels: true,
      generateApiKeys: true,
      triggerBatchSync: true
    }
  },
  admin: {
    properties: {
      viewPublic: true,
      viewInternal: true,
      viewConfidential: true,
      create: true,
      edit: true,
      delete: false,
      exportData: true
    },
    contacts: {
      viewPublic: true,
      viewInternal: true,
      viewConfidential: true,
      create: true,
      edit: true,
      delete: false,
      exportData: true,
      viewAllContacts: true,
      viewOwnerPhone: true
    },
    mandates: {
      view: true,
      create: true,
      editConditions: true,
      close: true,
      export: true
    },
    offers: {
      view: true,
      createOffer: true,
      counterOffer: true,
      acceptDeed: true
    },
    closing: {
      view: true,
      manageNotary: true,
      viewCommissions: true
    },
    financialStats: {
      viewGlobalRevenue: true,
      viewAgentCommissions: true,
      viewAgencyMargin: false
    },
    auditLogs: {
      viewLogs: true,
      purgeLogs: false
    },
    apiAndSyndication: {
      manageChannels: true,
      generateApiKeys: false,
      triggerBatchSync: true
    }
  },
  agent: {
    properties: {
      viewPublic: true,
      viewInternal: true,
      viewConfidential: false,
      create: true,
      edit: true,
      delete: false,
      exportData: false
    },
    contacts: {
      viewPublic: true,
      viewInternal: true,
      viewConfidential: false,
      create: true,
      edit: true,
      delete: false,
      exportData: false,
      viewAllContacts: false, // Seulement ses propres contacts
      viewOwnerPhone: true
    },
    mandates: {
      view: true,
      create: true,
      editConditions: false,
      close: false,
      export: false
    },
    offers: {
      view: true,
      createOffer: true,
      counterOffer: true,
      acceptDeed: false
    },
    closing: {
      view: true,
      manageNotary: false,
      viewCommissions: false
    },
    financialStats: {
      viewGlobalRevenue: false,
      viewAgentCommissions: true, // Voit uniquement sa commission
      viewAgencyMargin: false
    },
    auditLogs: {
      viewLogs: false,
      purgeLogs: false
    },
    apiAndSyndication: {
      manageChannels: false,
      generateApiKeys: false,
      triggerBatchSync: false
    }
  },
  client: {
    properties: {
      viewPublic: true,
      viewInternal: false,
      viewConfidential: false,
      create: false,
      edit: false,
      delete: false,
      exportData: false
    },
    contacts: {
      viewPublic: false,
      viewInternal: false,
      viewConfidential: false,
      create: false,
      edit: false,
      delete: false,
      exportData: false,
      viewAllContacts: false,
      viewOwnerPhone: false
    },
    mandates: {
      view: false,
      create: false,
      editConditions: false,
      close: false,
      export: false
    },
    offers: {
      view: true, // Voit ses propres offres
      createOffer: true,
      counterOffer: false,
      acceptDeed: false
    },
    closing: {
      view: false,
      manageNotary: false,
      viewCommissions: false
    },
    financialStats: {
      viewGlobalRevenue: false,
      viewAgentCommissions: false,
      viewAgencyMargin: false
    },
    auditLogs: {
      viewLogs: false,
      purgeLogs: false
    },
    apiAndSyndication: {
      manageChannels: false,
      generateApiKeys: false,
      triggerBatchSync: false
    }
  },
  visitor: {
    properties: {
      viewPublic: true,
      viewInternal: false,
      viewConfidential: false,
      create: false,
      edit: false,
      delete: false,
      exportData: false
    },
    contacts: {
      viewPublic: false,
      viewInternal: false,
      viewConfidential: false,
      create: false,
      edit: false,
      delete: false,
      exportData: false,
      viewAllContacts: false,
      viewOwnerPhone: false
    },
    mandates: {
      view: false,
      create: false,
      editConditions: false,
      close: false,
      export: false
    },
    offers: {
      view: false,
      createOffer: false,
      counterOffer: false,
      acceptDeed: false
    },
    closing: {
      view: false,
      manageNotary: false,
      viewCommissions: false
    },
    financialStats: {
      viewGlobalRevenue: false,
      viewAgentCommissions: false,
      viewAgencyMargin: false
    },
    auditLogs: {
      viewLogs: false,
      purgeLogs: false
    },
    apiAndSyndication: {
      manageChannels: false,
      generateApiKeys: false,
      triggerBatchSync: false
    }
  }
};
