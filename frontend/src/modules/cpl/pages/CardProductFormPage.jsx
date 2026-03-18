import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cardProductService } from '../services/cardProductService';
import { ChevronLeft, Save } from 'lucide-react';

const schema = yup.object({
  productName: yup.string().required('Product name is required'),
  category: yup.string().required('Category is required'),
  annualFee: yup.number().min(0).required('Annual fee required'),
  creditLimitMin: yup.number().min(0).required('Min limit required'),
  creditLimitMax: yup.number().min(0).required('Max limit required'),
  interestRate: yup.number().min(0).max(100).required('Interest rate required'),
});

export default function CardProductFormPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState:{errors} } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setSaving(true); setServerError('');
    try {
      await cardProductService.create(data);
      navigate('/products');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create product.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Add Card Product</h1><p className="page-subtitle">Define a new credit card product</p></div>
        <button className="btn btn-outline" onClick={() => navigate('/products')}><ChevronLeft size={16}/> Back</button>
      </div>
      <div className="card">
        {serverError && <div style={{ padding:'12px 16px', background:'#fee2e2', color:'#991b1b', borderRadius:'var(--radius)', marginBottom:20, borderLeft:'4px solid var(--danger)', fontSize:'.875rem' }}>{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-group">
              <label className="required">Product Name</label>
              <input {...register('productName')} className={errors.productName?'error':''} />
              {errors.productName && <span className="error-msg">{errors.productName.message}</span>}
            </div>
            <div className="form-group">
              <label className="required">Category</label>
              <select {...register('category')} className={errors.category?'error':''}>
                <option value="">Select…</option>
                {['PLATINUM','GOLD','CLASSIC','STUDENT'].map(c=><option key={c}>{c}</option>)}
              </select>
              {errors.category && <span className="error-msg">{errors.category.message}</span>}
            </div>
            <div className="form-group">
              <label className="required">Annual Fee (₹)</label>
              <input {...register('annualFee')} type="number" className={errors.annualFee?'error':''} />
              {errors.annualFee && <span className="error-msg">{errors.annualFee.message}</span>}
            </div>
            <div className="form-group">
              <label className="required">Interest Rate (%)</label>
              <input {...register('interestRate')} type="number" step="0.1" className={errors.interestRate?'error':''} />
              {errors.interestRate && <span className="error-msg">{errors.interestRate.message}</span>}
            </div>
            <div className="form-group">
              <label className="required">Min Credit Limit (₹)</label>
              <input {...register('creditLimitMin')} type="number" className={errors.creditLimitMin?'error':''} />
              {errors.creditLimitMin && <span className="error-msg">{errors.creditLimitMin.message}</span>}
            </div>
            <div className="form-group">
              <label className="required">Max Credit Limit (₹)</label>
              <input {...register('creditLimitMax')} type="number" className={errors.creditLimitMax?'error':''} />
              {errors.creditLimitMax && <span className="error-msg">{errors.creditLimitMax.message}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/products')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}><Save size={16}/> {saving ? 'Saving…' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
