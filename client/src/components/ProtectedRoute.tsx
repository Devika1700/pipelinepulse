import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
export function ProtectedRoute() {
const { status } = useAuth();
const location = useLocation();
if (status === 'loading') {
return <p className="px-4 py-20 text-center text-sm text-slate500">Loading…</p>;
}
if (status === 'unauthenticated') {
return <Navigate to="/login" replace state={{ from: location }} />;
}
return <Outlet />;
}