import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { customerService } from '../services/customerService';
import { ChevronLeft, Save, User, Mail, Phone, MapPin, Briefcase, Activity, Calendar, IndianRupee } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../shared/constants/roles';

const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email().required('Email is required'),
  phone: yup.string().required('Phone is required').max(10),
  dob: yup.string().required('Date of birth is required'),
  address: yup.string().required('Address is required'),
  income: yup.number().typeError('Must be a number').positive().required('Income is required'),
  employmentType: yup.string().required('Employment type is required'),
  status: yup.string().required('Status is required'),
});

const EMPLOYMENT_TYPES = ['Salaried', 'SelfEmployed', 'Student', 'Retired', 'Unemployed'];
const CUSTOMER_STATUSES = ['Active', 'Inactive', 'Suspended', 'Closed'];

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOfficer = user?.role === ROLES.OFFICER;
  const isEdit = !!id && id !== 'new';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { status: 'Active', employmentType: 'Salaried' }
  });

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      customerService.getById(id)
        .then(res => {
          const data = res.data?.data;
          reset({
            name: data.name,
            email: data.contactInfo?.email,
            phone: data.contactInfo?.phone,
            address: data.contactInfo?.address,
            dob: data.dob,
            income: data.income,
            employmentType: data.employmentType,
            status: data.status,
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (formData) => {
    setSaving(true); setServerError('');
    try {
      const payload = {
        name: formData.name,
        dob: formData.dob,
        income: formData.income,
        employmentType: formData.employmentType,
        status: formData.status,
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }
      };

      let newId = id;
      if (isEdit) {
        await customerService.update(id, payload);
      } else {
        const res = await customerService.create(payload);
        newId = res.data?.data?.customerId || res.data?.customerId;
      }

      if (isOfficer && !isEdit && newId) {
        navigate(`/applications/new?customerId=${newId}`);
      } else {
        navigate('/customers');
      }
    } catch (err) {
      setServerError(err.response?.data?.msg || 'Failed to save customer.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Customer' : 'Add Customer'}</h1>
          <p className="page-subtitle">Aligning with core banking standards</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/customers')}>
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className="card">
        {serverError && (
          <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '.875rem', borderLeft: '4px solid var(--danger)' }}>
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-group full" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <label className="required"><User size={14} /> Full Name</label>
              <input {...register('name')} placeholder="John Doe" className={errors.name ? 'error' : ''} />
              {errors.name && <span className="error-msg">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="required"><Email size={14} /> Email Address</label>
              <input {...register('email')} type="email" placeholder="john@example.com" className={errors.email ? 'error' : ''} />
              {errors.email && <span className="error-msg">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="required"><Phone size={14} /> Phone Number</label>
              <input {...register('phone')} placeholder="9876543210" className={errors.phone ? 'error' : ''} />
              {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
            </div>

            <div className="form-group">
              <label className="required"><Calendar size={14} /> Date of Birth</label>
              <input {...register('dob')} type="date" className={errors.dob ? 'error' : ''} />
              {errors.dob && <span className="error-msg">{errors.dob.message}</span>}
            </div>

            <div className="form-group">
              <label className="required"><IndianRupee size={14} /> Annual Income (₹)</label>
              <input {...register('income')} type="number" placeholder="e.g. 500000" className={errors.income ? 'error' : ''} />
              {errors.income && <span className="error-msg">{errors.income.message}</span>}
            </div>

            <div className="form-group">
              <label className="required"><Briefcase size={14} /> Employment Type</label>
              <select {...register('employmentType')} className={errors.employmentType ? 'error' : ''}>
                {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.employmentType && <span className="error-msg">{errors.employmentType.message}</span>}
            </div>

            <div className="form-group">
              <label className="required"><Activity size={14} /> Status</label>
              <select {...register('status')} className={errors.status ? 'error' : ''}>
                {CUSTOMER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.status && <span className="error-msg">{errors.status.message}</span>}
            </div>

            <div className="form-group full">
              <label className="required"><MapPin size={14} /> Residential Address</label>
              <textarea {...register('address')} rows={3} placeholder="Full street address, city, pin code..." className={errors.address ? 'error' : ''} />
              {errors.address && <span className="error-msg">{errors.address.message}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/customers')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save Customer Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
