import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../../../context/AuthContext';
import { FileText, Clock, CheckCircle, XCircle, FilePlus } from 'lucide-react';

const STATUS_BADGE = {
  PENDING: 'badge-warning', APPROVED: 'badge-success', REJECTED: 'badge-danger', UNDER_REVIEW: 'badge-info',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getAll()
      .then(res => setApps(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    apps.length,
    pending:  apps.filter(a => a.status === 'PENDING').length,
    approved: apps.filter(a => a.status === 'APPROVED').length,
    rejected: apps.filter(a => a.status === 'REJECTED').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.sub || 'Customer'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/applications/new')}>
          <FilePlus size={16}/> Apply for Card
        </button>
      </div>

      <div className="stat-grid">
        {[
          { label:'Total Applications', value: stats.total,    icon:'📋', cls:'blue'   },
          { label:'Pending Review',     value: stats.pending,  icon:'⏳', cls:'gold'   },
          { label:'Approved',           value: stats.approved, icon:'✅', cls:'green'  },
          { label:'Rejected',           value: stats.rejected, icon:'❌', cls:'red'    },
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
        <div style={{ fontWeight:700, marginBottom:16 }}>Recent Applications</div>
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : (
          apps.length === 0 ? (
            <div className="empty-state">
              <FileText size={40}/>
              <h3>No applications yet</h3>
              <p>Apply for a credit card to get started.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>App ID</th><th>Card Type</th><th>Requested Limit</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {apps.slice(0,10).map(a => (
                    <tr key={a.applicationId} style={{ cursor:'pointer' }} onClick={() => navigate(`/applications/${a.applicationId}`)}>
                      <td>#{a.applicationId}</td>
                      <td>{a.cardType || '—'}</td>
                      <td>{a.requestedLimit ? `₹${Number(a.requestedLimit).toLocaleString()}` : '—'}</td>
                      <td>{a.applicationDate || '—'}</td>
                      <td><span className={`badge ${STATUS_BADGE[a.status]||'badge-neutral'}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
