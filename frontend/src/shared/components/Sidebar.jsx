import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../constants/roles';
import {
  LayoutDashboard, Users, FileText, CreditCard, Briefcase,
  ArrowRightLeft, Receipt, Settings, LogOut, ChevronDown,
  ShieldCheck, UserCheck, DollarSign, Activity
} from 'lucide-react';

const moduleLinks = [
  {
    section: 'Overview',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/>, roles: null },
    ]
  },
  {
    section: 'Identity & Access',
    roles: [ROLES.ADMIN],
    links: [
      { to: '/users',    label: 'Users',       icon: <Users size={18}/>,      roles: [ROLES.ADMIN] },
      { to: '/register', label: 'Register User',icon: <UserCheck size={18}/>,  roles: [ROLES.ADMIN] },
    ]
  },
  {
    section: 'Profiles & Applications',
    roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER],
    links: [
      { to: '/customers',    label: 'Customers',    icon: <Users size={18}/>,    roles: [ROLES.ADMIN, ROLES.OFFICER] },
      { to: '/applications', label: 'Applications', icon: <FileText size={18}/>, roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER] },
    ]
  },
  {
    section: 'Credit Assessment',
    roles: [ROLES.ADMIN, ROLES.UNDERWRITER, ROLES.RISK],
    links: [
      { to: '/underwriting', label: 'Underwriting', icon: <ShieldCheck size={18}/>, roles: [ROLES.ADMIN, ROLES.UNDERWRITER, ROLES.RISK] },
    ]
  },
  {
    section: 'Card Products',
    roles: [ROLES.ADMIN],
    links: [
      { to: '/products', label: 'Card Products', icon: <CreditCard size={18}/>,  roles: [ROLES.ADMIN] },
      { to: '/fees',     label: 'Fee Configs',   icon: <Briefcase size={18}/>, roles: [ROLES.ADMIN] },
    ]
  },
  {
    section: 'Card Issuance',
    roles: [ROLES.ADMIN, ROLES.OFFICER],
    links: [
      { to: '/cards',    label: 'Cards',    icon: <CreditCard size={18}/>, roles: [ROLES.ADMIN, ROLES.OFFICER] },
      { to: '/accounts', label: 'Accounts', icon: <Settings size={18}/>,   roles: [ROLES.ADMIN, ROLES.OFFICER] },
    ]
  },
  {
    section: 'My Cards',
    roles: [ROLES.CUSTOMER],
    links: [
      { to: '/my-cards', label: 'My Cards', icon: <CreditCard size={18}/>, roles: [ROLES.CUSTOMER] },
    ]
  },
  {
    section: 'Transactions',
    roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER, ROLES.RISK],
    links: [
      { to: '/transactions', label: 'Transactions', icon: <ArrowRightLeft size={18}/>, roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER, ROLES.RISK] },
      { to: '/holds',        label: 'Holds',         icon: <Activity size={18}/>,      roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.RISK] },
    ]
  },
  {
    section: 'Billing & Payments',
    roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER],
    links: [
      { to: '/payments',   label: 'Payments',   icon: <DollarSign size={18}/>, roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER] },
      { to: '/statements', label: 'Statements', icon: <Receipt size={18}/>,    roles: [ROLES.ADMIN, ROLES.OFFICER, ROLES.CUSTOMER] },
    ]
  },
];

export default function Sidebar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const canAccess = (linkRoles) => {
    if (!linkRoles) return true;
    return linkRoles.includes(role);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">💳</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">CardMaster</span>
          <span className="sidebar-brand-sub">Credit System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {moduleLinks.map((section) => {
          if (section.roles && !section.roles.includes(role)) return null;
          const visibleLinks = section.links.filter(l => canAccess(l.roles));
          if (visibleLinks.length === 0) return null;
          return (
            <div key={section.section}>
              <div className="sidebar-section-title">{section.section}</div>
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
