import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLE_COLORS = {
  ADMIN: 'role-ADMIN',
  CUSTOMER: 'role-CUSTOMER',
  OFFICER: 'role-OFFICER',
  UNDERWRITER: 'role-UNDERWRITER',
  RISK: 'role-RISK',
};

export default function Navbar({ title = 'Dashboard' }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.sub || user?.email || 'U').charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="page-title" style={{ fontSize: '1.1rem' }}>{title}</span>
      </div>

      <div className="navbar-right">
        <div className="user-badge">
          <div className="user-avatar">{initial}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '.85rem', lineHeight: 1.2 }}>
              {user?.sub || user?.email || 'User'}
            </div>
            {role && (
              <span className={`role-pill ${ROLE_COLORS[role] || 'badge-neutral'}`}>
                {role}
              </span>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ 
            padding: '8px', 
            borderRadius: '50%',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
