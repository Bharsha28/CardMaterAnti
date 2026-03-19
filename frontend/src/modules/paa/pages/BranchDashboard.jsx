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
          <button className="btn btn-outline" onClick={() => navigate('/cards')}><PlusCircle size={16}/> Issue Card</button>
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

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24 }}>
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontWeight:700 }}>Pending Applications</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/applications')}>View All</button>
          </div>
          {loading ? <div className="spinner"/> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>App ID</th><th>Customer</th><th>Card Type</th><th>Status</th></tr></thead>
                <tbody>
                  {pending.slice(0,5).map(a => (
                    <tr key={a.applicationId} onClick={() => navigate(`/applications`)} style={{ cursor:'pointer' }}>
                      <td>#{a.applicationId}</td>
                      <td>{a.customerId}</td>
                      <td>{a.cardType || '—'}</td>
                      <td><span className={`badge ${STATUS_BADGE[a.status]||'badge-neutral'}`}>{a.status}</span></td>
                    </tr>
                  ))}
                  {pending.length === 0 && <tr><td colSpan={4} style={{ textAlign:'center', padding:20, color:'var(--text-muted)' }}>No pending apps.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontWeight:700 }}>Recent Customers</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/customers')}>View All</button>
          </div>
          {loading ? <div className="spinner"/> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Action</th></tr></thead>
                <tbody>
                  {customers.slice(0,5).map(c => (
                    <tr key={c.customerId || c.id}>
                      <td>#{c.customerId || c.id}</td>
                      <td>{c.name || `${c.firstName} ${c.lastName}`}</td>
                      <td>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => navigate(`/customers/${c.customerId || c.id}`)}><Users size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
