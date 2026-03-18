import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { applicationService } from '../services/applicationService';
import { customerService } from '../services/customerService';
import { cardProductService } from '../../cpl/services/cardProductService';
import { ChevronLeft, Save, User, Briefcase, IndianRupee, Calendar } from 'lucide-react';

const schema = yup.object({
  customerId: yup.string().required('Select a customer'),
  productId: yup.string().required('Select a card product'),
  requestedLimit: yup.number().typeError('Must be a number').positive().required('Credit limit is required'),
});

export default function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlCustomerId = queryParams.get('customerId');

  const isEdit = !!id && id !== 'new';
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm({ 
    resolver: yupResolver(schema),
    defaultValues: { 
      status: 'Submitted',
      customerId: urlCustomerId || ''
    }
  });

  const watchedCustomerId = useWatch({ control, name: 'customerId' });

  useEffect(() => {
    if (urlCustomerId) {
      setValue('customerId', urlCustomerId);
    }
  }, [urlCustomerId, setValue]);

  useEffect(() => {
    customerService.getAll().then(res => setCustomers(res.data?.data || []));
    cardProductService.getAll().then(res => setProducts(res.data?.data || []));
    if (isEdit) {
      applicationService.getById(id).then(res => {
        const app = res.data?.data;
        reset({
          customerId: app.customerId?.toString(),
          productId: app.productId?.toString(),
          requestedLimit: app.requestedLimit,
          status: app.status
        });
      });
    }
  }, [id, isEdit, reset]);

  useEffect(() => {
    if (watchedCustomerId) {
      customerService.getById(watchedCustomerId).then(res => setSelectedCustomer(res.data?.data));
    } else {
      setSelectedCustomer(null);
    }
  }, [watchedCustomerId]);

  const onSubmit = async (data) => {
    setSaving(true); setServerError('');
    try {
      const payload = {
        ...data,
        customerId: parseInt(data.customerId),
        productId: parseInt(data.productId),
        status: isEdit ? data.status : 'Submitted',
        applicationDate: new Date().toISOString().split('T')[0]
      };
      
      if (isEdit) await applicationService.updateStatus(id, data.status);
      else await applicationService.create(payload);
      navigate('/applications');
    } catch (err) {
      setServerError(err.response?.data?.msg || 'Failed to submit application.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Update Application' : 'New Application'}</h1>
          <p className="page-subtitle">Submit a credit card application for a customer</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/applications')}>
          <ChevronLeft size={16}/> Back
        </button>
      </div>

      <div className="card">
        {serverError && (
          <div style={{ padding:'12px 16px', background:'#fee2e2', color:'#991b1b', borderRadius:'var(--radius)', marginBottom:'20px', borderLeft:'4px solid var(--danger)', fontSize:'.875rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-group">
              <label className="required">Select Customer</label>
              <select {...register('customerId')} className={errors.customerId ? 'error' : ''}>
                <option value="">Choose a customer…</option>
                {customers.map(c => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.name} (ID: {c.customerId})
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="error-msg">{errors.customerId.message}</span>}
            </div>

            <div className="form-group">
              <label className="required">Card Product</label>
              <select {...register('productId')} className={errors.productId ? 'error' : ''}>
                <option value="">Select a product…</option>
                {products.map(p => (
                  <option key={p.productId} value={p.productId}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
              {errors.productId && <span className="error-msg">{errors.productId.message}</span>}
            </div>

            <div className="form-group">
              <label className="required">Requested Credit Limit (₹)</label>
              <input {...register('requestedLimit')} type="number" placeholder="e.g. 100000" className={errors.requestedLimit ? 'error' : ''} />
              {errors.requestedLimit && <span className="error-msg">{errors.requestedLimit.message}</span>}
            </div>
          </div>

          {selectedCustomer && (
            <div style={{ marginTop:'32px', padding:'24px', background:'var(--bg-light)', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontSize:'.9rem', fontWeight:700, color:'var(--navy)', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
                <User size={16}/> Customer Profile Preview
              </h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  <span style={{ fontSize:'.75rem', color:'var(--text-muted)', textTransform:'uppercase' }}>Full Name</span>
                  <span style={{ fontWeight:600 }}>{selectedCustomer.name}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  <span style={{ fontSize:'.75rem', color:'var(--text-muted)', textTransform:'uppercase' }}>Date of Birth</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><Calendar size={14}/> {selectedCustomer.dob}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  <span style={{ fontSize:'.75rem', color:'var(--text-muted)', textTransform:'uppercase' }}>Annual Income</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--success)', fontWeight:700 }}><IndianRupee size={14}/> {selectedCustomer.income?.toLocaleString()}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  <span style={{ fontSize:'.75rem', color:'var(--text-muted)', textTransform:'uppercase' }}>Employment</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><Briefcase size={14}/> {selectedCustomer.employmentType}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                  <span style={{ fontSize:'.75rem', color:'var(--text-muted)', textTransform:'uppercase' }}>Contact Email</span>
                  <span>{selectedCustomer.contactInfo?.email}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop:'32px' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/applications')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16}/> {saving ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
