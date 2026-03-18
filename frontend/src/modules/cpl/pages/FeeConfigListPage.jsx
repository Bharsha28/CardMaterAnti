import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeConfigService } from '../services/cardProductService';
import DataTable from '../../../shared/components/DataTable';
import { useForm } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';

const FEE_TYPES = ['ANNUAL','LATE_PAYMENT','OVERLIMIT','CASH_ADVANCE','FOREIGN_TRANSACTION'];

export default function FeeConfigListPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    setLoading(true);
    feeConfigService.getAll().then(r => setFees(r.data||[])).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try { await feeConfigService.create(data); reset(); setShowForm(false); load(); }
    catch(e){ console.error(e); } finally { setSaving(false); }
  };

  const columns = [
    { key:'id', label:'ID' },
    { key:'productId', label:'Product ID' },
    { key:'feeType', label:'Fee Type' },
    { key:'amount', label:'Amount', render: v => v!=null?`₹${Number(v).toLocaleString()}`:'—' },
    { key:'percentage', label:'Percentage', render: v => v!=null?`${v}%`:'—' },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Fee Configurations</h1><p className="page-subtitle">Define fees for card products</p></div>
        <button className="btn btn-primary" onClick={()=>setShowForm(f=>!f)}>
          {showForm ? <><X size={16}/> Cancel</> : <><PlusCircle size={16}/> Add Fee</>}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:20 }}>
          <h3 style={{ fontWeight:700, marginBottom:16 }}>New Fee Configuration</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="required">Product ID</label>
                <input {...register('productId')} type="number" required />
              </div>
              <div className="form-group">
                <label className="required">Fee Type</label>
                <select {...register('feeType')} required>
                  <option value="">Select…</option>
                  {FEE_TYPES.map(f=><option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Fixed Amount (₹)</label>
                <input {...register('amount')} type="number" step="0.01" />
              </div>
              <div className="form-group">
                <label>Percentage (%)</label>
                <input {...register('percentage')} type="number" step="0.01" />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Save Fee'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? <div className="loading-overlay"><div className="spinner"/></div> : <DataTable columns={columns} data={fees}/>}
      </div>
    </div>
  );
}
