import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_COLORS = {
  ADMIN: 'role-ADMIN',
  CUSTOMER: 'role-CUSTOMER',
  OFFICER: 'role-OFFICER',
  UNDERWRITER: 'role-UNDERWRITER',
  RISK: 'role-RISK',
};

export default function Navbar({ title = 'Dashboard' }) {
  const { user, role } = useAuth();
  const initial = (user?.sub || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="page-title" style={{ fontSize: '1.1rem' }}>{title}</span>
      </div>

      <div className="navbar-right">
        <button className="btn btn-ghost btn-icon">
          <Bell size={18} />
        </button>

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
      </div>
    </header>
  );
}
