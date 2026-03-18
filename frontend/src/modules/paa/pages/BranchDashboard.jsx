import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { customerService } from '../services/customerService';
import { Users, FileText, Clock, CheckCircle, UserPlus } from 'lucide-react';

const STATUS_BADGE = {
  PENDING:'badge-warning', APPROVED:'badge-success', REJECTED:'badge-danger', UNDER_REVIEW:'badge-info'
};

export default function BranchDashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.getAll().then(r => r.data?.data || []),
      customerService.getAll().then(r => r.data?.data || []),
    ]).then(([a, c]) => { setApps(a); setCustomers(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = apps.filter(a => a.status === 'PENDING');
  const approved = apps.filter(a => a.status === 'APPROVED');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Branch Dashboard</h1>
          <p className="page-subtitle">Overview of branch activity and applications</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-outline" onClick={() => navigate('/customers/new')}><UserPlus size={16}/> Add Customer</button>
          <button className="btn btn-primary" onClick={() => navigate('/applications/new')}><FileText size={16}/> New Application</button>
        </div>
      </div>

      <div className="stat-grid">
        {[
          { label:'Total Customers',       value: customers.length, icon:'👥', cls:'blue'   },
          { label:'Total Applications',    value: apps.length,      icon:'📋', cls:'purple' },
          { label:'Pending Applications',  value: pending.length,   icon:'⏳', cls:'gold'   },
          { label:'Approved This Cycle',   value: approved.length,  icon:'✅', cls:'green'  },
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
        <div style={{ fontWeight:700, marginBottom:16 }}>Pending Applications — Action Required</div>
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>App ID</th><th>Customer</th><th>Card Type</th><th>Requested Limit</th><th>Status</th></tr></thead>
              <tbody>
                {pending.slice(0,10).map(a => (
                  <tr key={a.applicationId} style={{ cursor:'pointer' }} onClick={() => navigate(`/applications`)}>
                    <td>#{a.applicationId}</td>
                    <td>{a.customerId}</td>
                    <td>{a.cardType || '—'}</td>
                    <td>{a.requestedLimit ? `₹${Number(a.requestedLimit).toLocaleString()}` : '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[a.status]||'badge-neutral'}`}>{a.status}</span></td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:'32px', color:'var(--text-secondary)' }}>No pending applications 🎉</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
