import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../services/userService';
import { CreditCard, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const schema = yup.object({ email: yup.string().email().required(), password: yup.string().required() });

export default function LoginPage() {
  const { login, mockLogin } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true); setServerError('');
    
    // Default Login Bypass for site verification
    const mockAccounts = {
      'admin@cardmaster.com': 'ADMIN',
      'officer@cardmaster.com': 'OFFICER',
      'underwriter@cardmaster.com': 'UNDERWRITER',
      'customer@cardmaster.com': 'CUSTOMER',
    };

    if (data.password === 'password' && mockAccounts[data.email]) {
      setTimeout(() => {
        mockLogin(mockAccounts[data.email]);
        setLoading(false);
        navigate('/dashboard');
      }, 800);
      return;
    }

    try {
      const res = await userService.login(data.email, data.password);
      const token = res.data?.data;
      login(token);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.msg || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'3.5rem', marginBottom:'24px' }}>💳</div>
          <h1 style={{ color:'white', fontSize:'2.5rem', fontWeight:800, marginBottom:12 }}>
            CardMaster
          </h1>
          <p style={{ color:'rgba(255,255,255,.65)', fontSize:'1.1rem', lineHeight:1.7, maxWidth:'400px' }}>
            A complete credit card management platform — from application to billing, all in one place.
          </p>

          <div style={{ marginTop:'48px', display:'flex', flexDirection:'column', gap:'16px' }}>
            {[
              { icon:'🔐', text:'Enterprise-grade JWT Authentication' },
              { icon:'🏦', text:'Role-based Access for every department' },
              { icon:'📊', text:'Real-time dashboards and analytics' },
              { icon:'💸', text:'End-to-end transaction management' },
            ].map(f => (
              <div key={f.text} style={{ display:'flex', alignItems:'center', gap:'12px', color:'rgba(255,255,255,.8)' }}>
                <span style={{ fontSize:'1.2rem' }}>{f.icon}</span>
                <span style={{ fontSize:'.9rem' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-logo">💳</div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your CardMaster account</p>

          {serverError && (
            <div style={{ padding:'12px 16px', background:'#fee2e2', color:'#991b1b', borderRadius:'var(--radius)', fontSize:'.875rem', marginBottom:'20px', borderLeft:'4px solid var(--danger)' }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group" style={{ marginBottom:'16px' }}>
              <label className="required">Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={errors.email ? 'error' : ''}
                  style={{ paddingLeft:'40px' }}
                />
              </div>
              {errors.email && <span className="error-msg">{errors.email.message}</span>}
            </div>

            <div className="form-group" style={{ marginBottom:'24px' }}>
              <label className="required">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={errors.password ? 'error' : ''}
                  style={{ paddingLeft:'40px', paddingRight:'40px' }}
                />
                <button type="button" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', background:'none' }} onClick={() => setShowPw(p => !p)}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <span className="error-msg">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop:'20px', padding:'12px', background:'rgba(0,0,0,0.03)', borderRadius:'var(--radius)', fontSize:'.75rem', border:'1px dashed var(--border)' }}>
            <div style={{ fontWeight:700, marginBottom:8, color:'var(--navy)' }}>Demo Credentials (password: `password`)</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <code>admin@cardmaster.com</code>
              <code>officer@cardmaster.com</code>
              <code>underwriter@cardmaster.com</code>
              <code>customer@cardmaster.com</code>
            </div>
          </div>

          <div className="auth-divider" style={{ marginTop:'24px' }}>or</div>

          <p style={{ textAlign:'center', fontSize:'.875rem', color:'var(--text-secondary)' }}>
            New user? <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
