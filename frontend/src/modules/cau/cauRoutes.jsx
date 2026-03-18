import { Route } from 'react-router-dom';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import { ROLES } from '../../shared/constants/roles';
import UnderwriterDashboard from './pages/UnderwriterDashboard';
import UnderwritingPage from './pages/UnderwritingPage';

export const cauRoutes = [
  <Route key="uw-dash" path="/dashboard/underwriter" element={
    <ProtectedRoute allowedRoles={[ROLES.UNDERWRITER, ROLES.ADMIN, ROLES.RISK]}>
      <UnderwriterDashboard />
    </ProtectedRoute>
  }/>,
  <Route key="underwriting" path="/underwriting" element={
    <ProtectedRoute allowedRoles={[ROLES.UNDERWRITER, ROLES.ADMIN, ROLES.RISK]}>
      <UnderwritingPage />
    </ProtectedRoute>
  }/>,
];
