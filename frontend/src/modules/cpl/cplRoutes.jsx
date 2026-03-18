import { Route } from 'react-router-dom';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import { ROLES } from '../../shared/constants/roles';
import AdminDashboard from './pages/AdminDashboard';
import CardProductListPage from './pages/CardProductListPage';
import CardProductFormPage from './pages/CardProductFormPage';
import FeeConfigListPage from './pages/FeeConfigListPage';

export const cplRoutes = [
  <Route key="admin-dash" path="/dashboard/admin" element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <AdminDashboard />
    </ProtectedRoute>
  }/>,
  <Route key="products" path="/products" element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <CardProductListPage />
    </ProtectedRoute>
  }/>,
  <Route key="products-new" path="/products/new" element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <CardProductFormPage />
    </ProtectedRoute>
  }/>,
  <Route key="fees" path="/fees" element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <FeeConfigListPage />
    </ProtectedRoute>
  }/>,
];
