import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../shared/components/ProtectedRoute';
import { ROLES } from '../../shared/constants/roles';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserListPage from './pages/UserListPage';

export const iamPublicRoutes = [
  <Route key="login"    path="/login"    element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
];

export const iamProtectedRoutes = [
  <Route key="users" path="/users" element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <UserListPage />
    </ProtectedRoute>
  }/>,
];
