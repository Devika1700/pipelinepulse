import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './features/auth/AuthProvider';
import AuthPage from './pages/AuthPage';
import RunsPage from './pages/RunsPage';
export default function App() {
return (
<BrowserRouter>
<AuthProvider>
<Routes>
<Route path="/login" element={<AuthPage mode="login" />} />
<Route path="/register" element={<AuthPage mode="register" />} />
<Route element={<ProtectedRoute />}>
<Route element={<AppLayout />}>
<Route index element={<RunsPage />} />
</Route>
</Route>
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</AuthProvider>
</BrowserRouter>
);
}