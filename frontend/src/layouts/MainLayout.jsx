import Sidebar from '../shared/components/Sidebar';
import Navbar from '../shared/components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard':   'Dashboard',
  '/users':       'User Management',
  '/register':    'Register User',
  '/customers':   'Customer Management',
  '/applications':'Card Applications',
  '/underwriting':'Credit Assessment & Underwriting',
  '/products':    'Card Products',
  '/fees':        'Fee Configurations',
  '/cards':       'Card Issuance',
  '/accounts':    'Account Setup',
  '/transactions':'Transactions',
  '/holds':       'Transaction Holds',
  '/payments':    'Payments',
  '/statements':  'Statements',
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const title = PAGE_TITLES[base] || 'CardMaster';

  return (
    <div className="app-wrapper">
      <Sidebar />
      <Navbar title={title} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
