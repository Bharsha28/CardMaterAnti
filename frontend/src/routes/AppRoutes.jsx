import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { iamPublicRoutes, iamProtectedRoutes } from '../modules/iam/iamRoutes';
import { paaRoutes, paaDashboardRoutes } from '../modules/paa/paaRoutes';
import { cauRoutes } from '../modules/cau/cauRoutes';
import { cplRoutes } from '../modules/cpl/cplRoutes';
import { ciasRoutes } from '../modules/cias/ciasRoutes';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../shared/constants/roles';

export default function AppRoutes() {
  const { role, isAuthenticated } = useAuth();

  // Dynamic dashboard redirect based on role
  const getDashboard = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    switch (role) {
      case ROLES.ADMIN:       return <Navigate to="/dashboard/admin" replace />;
      case ROLES.OFFICER:     return <Navigate to="/dashboard/branch" replace />;
      case ROLES.UNDERWRITER: return <Navigate to="/dashboard/underwriter" replace />;
      case ROLES.CUSTOMER:    return <Navigate to="/dashboard/customer" replace />;
      default:                return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      {iamPublicRoutes}

      {/* Protected Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/"          element={getDashboard()} />
        <Route path="/dashboard" element={getDashboard()} />
        
        {iamProtectedRoutes}
        {paaRoutes}
        {paaDashboardRoutes}
        {cauRoutes}
        {cplRoutes}
        {ciasRoutes}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
