import { Route } from 'react-router-dom';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import { ROLES } from '../../shared/constants/roles';
import CardIssuancePage from './pages/CardIssuancePage';

export const ciasRoutes = [
  <Route key="cards" path="/cards" element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER]}>
      <CardIssuancePage />
    </ProtectedRoute>
  }/>,
];
