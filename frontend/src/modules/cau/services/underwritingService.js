import api from '../../../shared/services/api';

export const underwritingService = {
  generateScore: (appId, data) => 
    api.post(`/applications/${appId}/scores`, {
      bureauScore: data.creditBureauScore
    }),
  
  getLatestScore: (appId) => 
    api.get(`/applications/${appId}/scores/latest`),
  
  createDecision: (appId, data) => 
    api.post(`/applications/${appId}/decisions`, {
      decision: data.decisionType,
      remarks: data.remarks,
      approvedLimit: data.approvedLimit
    }),
  
  getLatestDecision: (appId) => 
    api.get(`/applications/${appId}/decisions/latest`),
};
