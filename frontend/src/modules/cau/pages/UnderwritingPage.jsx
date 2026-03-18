import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { underwritingService } from '../services/underwritingService';
import { applicationService } from '../../paa/services/applicationService';
import { Brain, ShieldCheck, CheckCircle, XCircle, ChevronLeft, List, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const scoreSchema = yup.object({
  appId: yup.number().typeError('Application ID required').required(),
  creditBureauScore: yup.number().min(300).max(900).required('Score 300–900 required'),
  debtToIncomeRatio: yup.number().min(0).max(100).required('DTI ratio required'),
  existingLoans: yup.number().min(0).required(),
});

const decisionSchema = yup.object({
  appId: yup.number().typeError('Application ID required').required(),
  decisionType: yup.string().required('Decision is required'),
  remarks: yup.string().required('Remarks are required'),
  approvedLimit: yup.number().typeError('Must be a number').nullable(),
});

export default function UnderwritingPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [decisionResult, setDecisionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const { register: rScore, handleSubmit: hScore, setValue: sScore, formState: { errors: eScore } } = useForm({ resolver: yupResolver(scoreSchema) });
  const { register: rDecision, handleSubmit: hDecision, setValue: sDecision, formState: { errors: eDecision } } = useForm({ resolver: yupResolver(decisionSchema) });

  useEffect(() => {
    applicationService.getAll()
      .then(res => {
        const submitted = (res.data?.data || []).filter(a => a.status === 'Submitted' || a.status === 'PENDING');
        setApps(submitted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    sScore('appId', app.applicationId);
    sDecision('appId', app.applicationId);
    setActiveTab('score');
  };

  const onScore = async (data) => {
    setScoreLoading(true); setScoreResult(null);
    try {
      const res = await underwritingService.generateScore(data.appId, { 
        creditBureauScore: data.creditBureauScore, 
        debtToIncomeRatio: data.debtToIncomeRatio, 
        existingLoans: data.existingLoans 
      });
      setScoreResult(res.data);
      // Switch to decision after score
      setTimeout(() => setActiveTab('decision'), 1500);
    } catch (err) { setScoreResult({ error: err.response?.data?.message || 'Failed to generate score.' }); }
    finally { setScoreLoading(false); }
  };

  const onDecision = async (data) => {
    setDecisionLoading(true); setDecisionResult(null);
    try {
      const res = await underwritingService.createDecision(data.appId, { 
        decisionType: data.decisionType, 
        remarks: data.remarks, 
        approvedLimit: data.approvedLimit 
      });
      setDecisionResult(res.data);
      // Refresh list after decision
      applicationService.getAll().then(r => setApps((r.data?.data || []).filter(a => a.status === 'Submitted' || a.status === 'PENDING')));
    } catch (err) { setDecisionResult({ error: err.response?.data?.message || 'Failed to submit decision.' }); }
    finally { setDecisionLoading(false); }
  };

  const tabStyle = (t) => ({
    padding:'9px 20px', borderRadius:'var(--radius)', fontWeight:600, fontSize:'.875rem',
    background: activeTab===t ? 'var(--navy)' : 'transparent',
    color: activeTab===t ? 'white' : 'var(--text-secondary)',
    border: activeTab===t ? 'none' : '1px solid var(--border)',
    cursor:'pointer', transition:'var(--transition)',
    display:'flex', alignItems:'center', gap:8
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Credit Assessment & Underwriting</h1>
          <p className="page-subtitle">Decide on applications based on bureau and internal scores</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={16}/> Dashboard
        </button>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        <button style={tabStyle('list')} onClick={() => setActiveTab('list')}><List size={15}/> Queue</button>
        <button style={tabStyle('score')} onClick={() => selectedApp && setActiveTab('score')} disabled={!selectedApp}><Brain size={15}/> 1. Credit Scoring</button>
        <button style={tabStyle('decision')} onClick={() => selectedApp && setActiveTab('decision')} disabled={!selectedApp}><ShieldCheck size={15}/> 2. Decision</button>
      </div>

      {activeTab === 'list' && (
        <div className="card">
          <h3 style={{ fontWeight:700, marginBottom:20 }}>Applications Pending Underwriting</h3>
          {loading ? <div className="spinner"/> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>App ID</th><th>Customer ID</th><th>Product</th><th>Requested Limit</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {apps.map(a => (
                    <tr key={a.applicationId}>
                      <td>#{a.applicationId}</td>
                      <td>{a.customerId}</td>
                      <td>{a.productId || 'Standard'}</td>
                      <td>₹{Number(a.requestedLimit).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => handleSelectApp(a)}>
                          <Target size={14}/> Assess
                        </button>
                      </td>
                    </tr>
                  ))}
                  {apps.length === 0 && <tr><td colSpan={5} style={{textAlign:'center', padding:40, color:'var(--text-muted)' }}>No submitted applications in queue.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedApp && activeTab==='score' && (
        <div className="card animate-fade-in">
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
            <h3 style={{ fontWeight:700 }}>Generate Credit Score for #{selectedApp.applicationId}</h3>
            <span className="badge badge-info">Step 1 of 2</span>
          </div>
          <form onSubmit={hScore(onScore)}>
            <input type="hidden" {...rScore('appId')} />
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Credit Bureau Score (300–900)</label>
                <input {...rScore('creditBureauScore')} type="number" placeholder="750" className={eScore.creditBureauScore?'error':''} />
                {eScore.creditBureauScore && <span className="error-msg">{eScore.creditBureauScore.message}</span>}
              </div>
              <div className="form-group">
                <label className="required">Debt-to-Income Ratio (%)</label>
                <input {...rScore('debtToIncomeRatio')} type="number" step="0.1" placeholder="30.5" className={eScore.debtToIncomeRatio?'error':''} />
                {eScore.debtToIncomeRatio && <span className="error-msg">{eScore.debtToIncomeRatio.message}</span>}
              </div>
              <div className="form-group">
                <label className="required">Existing Loans Count</label>
                <input {...rScore('existingLoans')} type="number" placeholder="2" className={eScore.existingLoans?'error':''} />
                {eScore.existingLoans && <span className="error-msg">{eScore.existingLoans.message}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={scoreLoading}>
                <Brain size={15}/> {scoreLoading ? 'Calculating…' : 'Generate Internal Score'}
              </button>
            </div>
          </form>

          {scoreResult && (
            <div style={{ marginTop:24, padding:20, background: scoreResult.error?'#fee2e2':'#f0f9ff', borderRadius:'var(--radius)', borderLeft:`4px solid ${scoreResult.error?'var(--danger)':'var(--primary)'}` }}>
              {scoreResult.error ? <p style={{ color:'#991b1b' }}>{scoreResult.error}</p> : (
                <div>
                  <h4 style={{ fontSize:'.875rem', fontWeight:700, marginBottom:12, color:'var(--navy)' }}>Scoring Results</h4>
                  <div className="detail-grid">
                    <div className="detail-item"><span className="detail-label">Bureau Score</span><span className="detail-value">{scoreResult.bureauScore}</span></div>
                    <div className="detail-item"><span className="detail-label">Internal Risk Score</span><span className="detail-value" style={{ color:'var(--primary)', fontWeight:800 }}>{scoreResult.internalScore} / 100</span></div>
                    <div className="detail-item"><span className="detail-label">Generated Date</span><span className="detail-value">{new Date(scoreResult.generatedDate).toLocaleDateString()}</span></div>
                  </div>
                  <div style={{ marginTop:12, fontSize:'.75rem', color:'var(--text-muted)' }}>✅ Scores generated. Moving to Decision step...</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedApp && activeTab==='decision' && (
        <div className="card animate-fade-in">
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
            <h3 style={{ fontWeight:700 }}>Submit Underwriting Decision for #{selectedApp.applicationId}</h3>
            <span className="badge badge-success">Step 2 of 2</span>
          </div>
          <form onSubmit={hDecision(onDecision)}>
            <input type="hidden" {...rDecision('appId')} />
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Decision</label>
                <select {...rDecision('decisionType')} className={eDecision.decisionType?'error':''}>
                  <option value="">Select decision…</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CONDITIONAL">CONDITIONAL</option>
                </select>
                {eDecision.decisionType && <span className="error-msg">{eDecision.decisionType.message}</span>}
              </div>
              <div className="form-group">
                <label>Approved Limit (₹)</label>
                <input {...rDecision('approvedLimit')} type="number" placeholder="500000" />
              </div>
              <div className="form-group full">
                <label className="required">Remarks</label>
                <textarea {...rDecision('remarks')} rows={3} placeholder="Based on good bureau score and stable DTI..." className={eDecision.remarks?'error':''} />
                {eDecision.remarks && <span className="error-msg">{eDecision.remarks.message}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={decisionLoading}>
                <ShieldCheck size={15}/> {decisionLoading ? 'Submitting…' : 'Finalize Decision'}
              </button>
            </div>
          </form>

          {decisionResult && (
            <div style={{ marginTop:24, padding:20, background: decisionResult.error?'#fee2e2':'#d1fae5', borderRadius:'var(--radius)', borderLeft:`4px solid ${decisionResult.error?'var(--danger)':'var(--success)'}` }}>
              {decisionResult.error ? <p style={{ color:'#991b1b' }}>{decisionResult.error}</p> : (
                <div style={{ textAlign:'center' }}>
                  <CheckCircle size={40} style={{ color:'var(--success)', marginBottom:12 }}/>
                  <h4 style={{ color:'var(--success)', fontWeight:700 }}>Decision Submitted!</h4>
                  <p style={{ fontSize:'.875rem', marginTop:8 }}>Application #{selectedApp.applicationId} has been marked as <strong>{decisionResult.decision}</strong>.</p>
                  <button className="btn btn-outline btn-sm" style={{ marginTop:16 }} onClick={() => { setSelectedApp(null); setActiveTab('list'); setDecisionResult(null); setScoreResult(null); }}>Return to Queue</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
