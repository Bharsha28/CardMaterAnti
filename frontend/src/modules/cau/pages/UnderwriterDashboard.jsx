import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../paa/services/applicationService';
import { underwritingService } from '../services/underwritingService';
import { ShieldCheck, Brain, ClipboardList, AlertCircle } from 'lucide-react';

export default function UnderwriterDashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getAll()
      .then(res => setApps(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = apps.filter(a => a.status === 'PENDING' || a.status === 'UNDER_REVIEW');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Underwriter Dashboard</h1>
          <p className="page-subtitle">Assess applications and make credit decisions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/underwriting')}>
          <ClipboardList size={16}/> View All
        </button>
      </div>

      <div className="stat-grid">
        {[
          { label:'Applications', value: apps.length, icon:'📋', cls:'blue' },
          { label:'Pending Review', value: pending.length, icon:'⏳', cls:'gold' },
          { label:'Approved', value: apps.filter(a=>a.status==='APPROVED').length, icon:'✅', cls:'green' },
          { label:'Rejected', value: apps.filter(a=>a.status==='REJECTED').length, icon:'🚫', cls:'red' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{loading ? '—' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ fontWeight:700, marginBottom:16 }}>Applications Requiring Underwriting</div>
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>App ID</th><th>Customer ID</th><th>Card Type</th><th>Requested Limit</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {pending.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign:'center', padding:'32px', color:'var(--text-secondary)' }}>No pending reviews 🎉</td></tr>
                )}
                {pending.slice(0,15).map(a => (
                  <tr key={a.applicationId}>
                    <td>#{a.applicationId}</td>
                    <td>{a.customerId}</td>
                    <td>{a.cardType||'—'}</td>
                    <td>{a.requestedLimit?`₹${Number(a.requestedLimit).toLocaleString()}`:'—'}</td>
                    <td><span className="badge badge-warning">{a.status}</span></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/underwriting')}>
                        <Brain size={13}/> Assess
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
