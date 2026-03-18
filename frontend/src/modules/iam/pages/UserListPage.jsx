import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../shared/components/DataTable';
import Modal from '../../../shared/components/Modal';
import { userService } from '../services/userService';
import { UserPlus, Eye, Trash2 } from 'lucide-react';

const ROLE_BADGE = { ADMIN:'badge-danger', CUSTOMER:'badge-info', OFFICER:'badge-success', UNDERWRITER:'badge-warning', RISK:'badge-purple' };

export default function UserListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    userService.getAllUsers()
      .then(res => setUsers(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key:'id', label:'ID' },
    { key:'username', label:'Name' },
    { key:'email', label:'Email' },
    { key:'role', label:'Role', render: (v) => <span className={`badge ${ROLE_BADGE[v]||'badge-neutral'}`}>{v}</span> },
    { key:'active', label:'Status', render: (v) => <span className={`badge ${v?'badge-success':'badge-neutral'}`}>{v?'Active':'Inactive'}</span> },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">All registered users in the system</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/register')}>
          <UserPlus size={16}/> Add User
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-overlay"><div className="spinner"/></div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            actions={(row) => (
              <>
                <button className="btn btn-outline btn-sm btn-icon" title="View" onClick={() => navigate(`/users/${row.id}`)}>
                  <Eye size={14}/>
                </button>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
