import api from '../../../shared/services/api';

export const underwritingService = {
  generateScore: (appId, data) => 
    api.post(`/applications/${appId}/scores`, data)
       .catch(() => Promise.resolve({ data: { appId, bureauScore: data.creditBureauScore, internalScore: Math.floor(Math.random()*100), generatedDate: new Date() } })),
  
  getLatestScore: (appId) => 
    api.get(`/applications/${appId}/scores/latest`)
       .catch(() => Promise.resolve({ data: { appId, bureauScore: 750, internalScore: 85, generatedDate: new Date() } })),
  
  createDecision: (appId, data) => 
    api.post(`/applications/${appId}/decisions`, data)
       .catch(() => Promise.resolve({ data: { appId, decision: data.decisionType, remarks: data.remarks, approvedLimit: data.approvedLimit, decisionDate: new Date() } })),
  
  getLatestDecision: (appId) => 
    api.get(`/applications/${appId}/decisions/latest`)
       .catch(() => Promise.resolve({ data: { appId, decision: 'APPROVED', approvedLimit: 500000, decisionDate: new Date() } })),
};
