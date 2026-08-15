import { Navigate } from 'react-router-dom';

// Admin role removed from ShopNest 2.0
export default function AdminDashboardPage() {
  return <Navigate to="/" replace />;
}
