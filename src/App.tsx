import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Feed } from './pages/Feed';
import { Auth } from './pages/Auth';
import { BottomNav } from './components/BottomNav';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages
const Explore = React.lazy(() => import('./pages/Explore').then(module => ({ default: module.Explore })));
const Create = React.lazy(() => import('./pages/Create').then(module => ({ default: module.Create })));
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { session, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace />;
  
  return children;
};

const App: React.FC = () => {
  const { session } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';
  const isCreatePage = location.pathname === '/create';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      <main className="mx-auto max-w-md bg-background min-h-screen shadow-2xl shadow-black relative border-x border-border">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={!session ? <Auth /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            
            <Route path="/explore" element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            } />
            
            <Route path="/create" element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        
        {/* Show Nav if logged in and not on Create page */}
        {session && !isCreatePage && (
          <BottomNav />
        )}
      </main>
    </div>
  );
};

export default App;