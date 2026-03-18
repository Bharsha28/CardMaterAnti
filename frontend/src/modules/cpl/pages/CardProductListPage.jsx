import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardProductService } from '../services/cardProductService';
import DataTable from '../../../shared/components/DataTable';
import { PlusCircle } from 'lucide-react';

const CATEGORY_BADGE = { PLATINUM:'badge-purple', GOLD:'badge-warning', CLASSIC:'badge-info', STUDENT:'badge-success' };
const STATUS_BADGE   = { ACTIVE:'badge-success', INACTIVE:'badge-neutral', DRAFT:'badge-warning' };

export default function CardProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardProductService.getAll()
      .then(res => setProducts(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key:'id', label:'ID' },
    { key:'productName', label:'Product Name' },
    { key:'category', label:'Category', render: v => <span className={`badge ${CATEGORY_BADGE[v]||'badge-neutral'}`}>{v}</span> },
    { key:'annualFee', label:'Annual Fee', render: v => v!=null ? `₹${Number(v).toLocaleString()}` : '—' },
    { key:'creditLimitMin', label:'Min Limit', render: v => v!=null ? `₹${Number(v).toLocaleString()}` : '—' },
    { key:'creditLimitMax', label:'Max Limit', render: v => v!=null ? `₹${Number(v).toLocaleString()}` : '—' },
    { key:'status', label:'Status', render: v => <span className={`badge ${STATUS_BADGE[v]||'badge-neutral'}`}>{v}</span> },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Card Products</h1>
          <p className="page-subtitle">Manage credit card product definitions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
          <PlusCircle size={16}/> Add Product
        </button>
      </div>
      <div className="card">
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : (
          <DataTable columns={columns} data={products} />
        )}
      </div>
    </div>
  );
}
