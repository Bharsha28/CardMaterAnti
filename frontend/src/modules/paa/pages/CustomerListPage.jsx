import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../shared/components/DataTable';
import Modal from '../../../shared/components/Modal';
import { customerService } from '../services/customerService';
import { UserPlus, Eye, Pencil, Trash2 } from 'lucide-react';

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    customerService.getAll()
      .then(res => setCustomers(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await customerService.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key:'id', label:'ID' },
    { key:'firstName', label:'First Name' },
    { key:'lastName', label:'Last Name' },
    { key:'email', label:'Email' },
    { key:'phone', label:'Phone' },
    { key:'dateOfBirth', label:'DOB' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">All registered customers</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>
          <UserPlus size={16}/> Add Customer
        </button>
      </div>
      <div className="card">
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : (
          <DataTable
            columns={columns}
            data={customers}
            actions={(row) => (
              <>
                <button className="btn btn-outline btn-sm btn-icon" onClick={() => navigate(`/customers/${row.id}`)}><Eye size={14}/></button>
                <button className="btn btn-outline btn-sm btn-icon" onClick={() => navigate(`/customers/${row.id}/edit`)}><Pencil size={14}/></button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteTarget(row)}><Trash2 size={14}/></button>
              </>
            )}
          />
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        title="Delete Customer"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        confirmClass="btn btn-danger"
        loading={deleting}
      >
        <p>Are you sure you want to delete <strong>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
