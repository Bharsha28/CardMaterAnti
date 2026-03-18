import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { userService } from '../services/userService';
import { User, Mail, Lock, Eye, EyeOff, UserCheck, Phone } from 'lucide-react';

const schema = yup.object({
  name: yup.string().min(3, 'Name must be at least 3 characters').required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: yup.string().required('Role is required'),
});

const ROLES = ['CUSTOMER', 'OFFICER', 'UNDERWRITER', 'RISK', 'ADMIN'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ 
    resolver: yupResolver(schema),
    defaultValues: { role: 'CUSTOMER' }
  });

  const onSubmit = async (data) => {
    setLoading(true); setServerError('');
    try {
      await userService.register(data);
      setSuccess(true);
      reset();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.msg || 'Registration failed. Full name, email, and phone must match backend requirements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'24px' }}>🏦</div>
          <h1 style={{ color:'white', fontSize:'2.5rem', fontWeight:800, marginBottom:12 }}>Join CardMaster</h1>
          <p style={{ color:'rgba(255,255,255,.65)', fontSize:'1.1rem', lineHeight:1.7, maxWidth:'400px' }}>
            Create your account and get access to the full suite of credit card management tools.
          </p>
          <div style={{ marginTop:'40px', display:'flex', flexDirection:'column', gap:'14px' }}>
            {['Customers', 'Branch Officers', 'Underwriters', 'Risk Analysts', 'Administrators'].map(r => (
              <div key={r} style={{ display:'flex', alignItems:'center', gap:'10px', color:'rgba(255,255,255,.8)' }}>
                <UserCheck size={18} style={{ color:'var(--gold)' }}/>
                <span style={{ fontSize:'.9rem' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right" style={{ maxWidth:'520px' }}>
        <div className="auth-box">
          <div className="auth-logo">💳</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Register as a new CardMaster user</p>

          {success && (
            <div style={{ padding:'12px 16px', background:'#d1fae5', color:'#065f46', borderRadius:'var(--radius)', fontSize:'.875rem', marginBottom:'20px', borderLeft:'4px solid var(--success)' }}>
              ✅ Account created! Redirecting to login…
            </div>
          )}
          {serverError && (
            <div style={{ padding:'12px 16px', background:'#fee2e2', color:'#991b1b', borderRadius:'var(--radius)', fontSize:'.875rem', marginBottom:'20px', borderLeft:'4px solid var(--danger)' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid" style={{ gridTemplateColumns:'1fr', gap:'14px' }}>
              <div className="form-group">
                <label className="required">Full Name</label>
                <div style={{ position:'relative' }}>
                  <User size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                  <input {...register('name')} placeholder="John Doe" style={{ paddingLeft:'40px' }} className={errors.name ? 'error' : ''} />
                </div>
                {errors.name && <span className="error-msg">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="required">Email</label>
                <div style={{ position:'relative' }}>
                  <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                  <input {...register('email')} type="email" placeholder="you@example.com" style={{ paddingLeft:'40px' }} className={errors.email ? 'error' : ''} />
                </div>
                {errors.email && <span className="error-msg">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label className="required">Phone Number</label>
                <div style={{ position:'relative' }}>
                  <Phone size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                  <input {...register('phone')} placeholder="9876543210" style={{ paddingLeft:'40px' }} className={errors.phone ? 'error' : ''} />
                </div>
                {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
              </div>

              <div className="form-group">
                <label className="required">Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                  <input {...register('password')} type={showPw ? 'text':'password'} placeholder="Min 8 characters" style={{ paddingLeft:'40px', paddingRight:'40px' }} className={errors.password ? 'error' : ''} />
                  <button type="button" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', background:'none' }} onClick={() => setShowPw(p => !p)}>
                    {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {errors.password && <span className="error-msg">{errors.password.message}</span>}
              </div>

              <div className="form-group">
                <label className="required">Role</label>
                <select {...register('role')} className={errors.role ? 'error' : ''}>
                  <option value="">Select a role…</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.role && <span className="error-msg">{errors.role.message}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px', marginTop:'24px' }} disabled={loading}>
              {loading ? 'Registering…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:'.875rem', color:'var(--text-secondary)', marginTop:'20px' }}>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
