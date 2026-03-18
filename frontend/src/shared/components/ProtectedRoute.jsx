import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16 }}>
        <span style={{ fontSize:'3rem' }}>🚫</span>
        <h2 style={{ fontWeight:700 }}>Access Denied</h2>
        <p style={{ color:'var(--text-secondary)' }}>You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
