import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { useGetMeQuery } from './store/api/authApi';
import { setCredentials, logout } from './store/slices/authSlice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserJobs from './pages/UserJobs';
import AppliedJobs from './pages/AppliedJobs';
import Layout from './components/Layout';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'admin' | 'user' }) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/jobs'} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { data: userData, isError } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (userData && token) {
      dispatch(setCredentials({ user: userData.user, token }));
    }
    if (isError) {
      dispatch(logout());
    }
  }, [userData, isError, token, dispatch]);

  // Show loading state while fetching user data
  if (token && !user && !isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/jobs'} replace />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/jobs'} replace />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/jobs') : '/login'} replace />} />
          
          <Route path="admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="jobs" element={
            <ProtectedRoute role="user">
              <UserJobs />
            </ProtectedRoute>
          } />
          
          <Route path="applied-jobs" element={
            <ProtectedRoute role="user">
              <AppliedJobs />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}
