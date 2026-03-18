import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import DataTable from '../../../shared/components/DataTable';
import { FilePlus, Eye, CheckCircle, XCircle } from 'lucide-react';

const STATUS_BADGE = {
  PENDING: 'badge-warning', APPROVED: 'badge-success', REJECTED: 'badge-danger',
  UNDER_REVIEW: 'badge-info',
};

export default function ApplicationListPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getAll()
      .then(res => setApps(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await applicationService.updateStatus(id, status);
      setApps(prev => prev.map(a => a.applicationId===id ? {...a, status} : a));
    } catch (e) { console.error(e); }
  };

  const columns = [
    { key:'applicationId', label:'App ID' },
    { key:'customerId', label:'Customer ID' },
    { key:'requestedLimit', label:'Requested Limit', render: v => v ? `₹${Number(v).toLocaleString()}` : '—' },
    { key:'cardType', label:'Card Type' },
    { key:'applicationDate', label:'Date' },
    { key:'status', label:'Status', render: v => <span className={`badge ${STATUS_BADGE[v]||'badge-neutral'}`}>{v}</span> },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Card Applications</h1>
          <p className="page-subtitle">Review and manage all credit card applications</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/applications/new')}>
          <FilePlus size={16}/> New Application
        </button>
      </div>
      <div className="card">
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : (
          <DataTable
            columns={columns}
            data={apps}
            actions={(row) => (
              <>
                <button className="btn btn-outline btn-sm btn-icon" title="View" onClick={() => navigate(`/applications/${row.applicationId}`)}>
                  <Eye size={14}/>
                </button>
                {row.status === 'PENDING' && (
                  <>
                    <button className="btn btn-success btn-sm btn-icon" title="Approve" onClick={() => updateStatus(row.applicationId, 'APPROVED')}><CheckCircle size={14}/></button>
                    <button className="btn btn-danger btn-sm btn-icon"  title="Reject"  onClick={() => updateStatus(row.applicationId, 'REJECTED')}><XCircle size={14}/></button>
                  </>
                )}
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
