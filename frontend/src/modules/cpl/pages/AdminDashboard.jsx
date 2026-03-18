import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../paa/services/applicationService';
import { customerService } from '../../paa/services/customerService';
import { cardProductService } from '../services/cardProductService';
import { Users, CreditCard, FileText, Settings, PlusCircle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ apps:[], customers:[], products:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationService.getAll().then(r => r.data?.data || []),
      customerService.getAll().then(r => r.data?.data || []),
      cardProductService.getAll().then(r => r.data || []),
    ]).then(([apps, customers, products]) => setData({ apps, customers, products }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { apps, customers, products } = data;
  const pendingApps = apps.filter(a => a.status==='PENDING').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System-wide overview and controls</p>
        </div>
      </div>

      <div className="stat-grid">
        {[
          { label:'Total Customers', value: customers.length, icon:<Users size={22}/>, cls:'blue',   to:'/customers' },
          { label:'Total Applications', value: apps.length, icon:<FileText size={22}/>, cls:'purple', to:'/applications' },
          { label:'Pending Applications', value: pendingApps, icon:'⏳', cls:'gold',   to:'/applications' },
          { label:'Card Products', value: products.length, icon:<CreditCard size={22}/>, cls:'green',  to:'/products' },
        ].map(s => (
          <div className="stat-card" key={s.label} style={{ cursor:'pointer' }} onClick={() => navigate(s.to)}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{loading ? '—' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <div style={{ fontWeight:700, marginBottom:16 }}>Quick Actions</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { label:'Add New Customer',   to:'/customers/new',    icon:<Users size={16}/> },
              { label:'New Application',    to:'/applications/new', icon:<FileText size={16}/> },
              { label:'Add Card Product',   to:'/products/new',     icon:<CreditCard size={16}/> },
              { label:'Register User',      to:'/register',          icon:<Settings size={16}/> },
              { label:'Issue Card',         to:'/cards',             icon:<CreditCard size={16}/> },
            ].map(a => (
              <button key={a.to} className="btn btn-outline" style={{ justifyContent:'flex-start', gap:10 }} onClick={() => navigate(a.to)}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight:700, marginBottom:16 }}>Recent Applications</div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Customer</th><th>Status</th></tr></thead>
              <tbody>
                {apps.slice(0,8).map(a=>(
                  <tr key={a.applicationId}>
                    <td>#{a.applicationId}</td>
                    <td>{a.customerId}</td>
                    <td>
                      <span className={`badge ${a.status==='APPROVED'?'badge-success':a.status==='REJECTED'?'badge-danger':a.status==='PENDING'?'badge-warning':'badge-info'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {apps.length===0 && <tr><td colSpan={3} style={{ textAlign:'center', padding:'16px', color:'var(--text-secondary)' }}>No applications</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
