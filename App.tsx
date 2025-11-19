import React, { useState, Suspense } from 'react';
import { Feed } from './pages/Feed';
// Lazy load other components to speed up initial render
const Explore = React.lazy(() => import('./pages/Explore').then(module => ({ default: module.Explore })));
const Create = React.lazy(() => import('./pages/Create').then(module => ({ default: module.Create })));
const Profile = React.lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));

import { BottomNav } from './components/BottomNav';
import { ViewState } from './types';

// Simple loading fallback for lazy components
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.FEED);

  const renderView = () => {
    switch (view) {
      case ViewState.FEED:
        // Feed is critical, render directly
        return <Feed />;
      case ViewState.EXPLORE:
        return (
          <Suspense fallback={<PageLoader />}>
            <Explore />
          </Suspense>
        );
      case ViewState.CREATE:
        return (
          <Suspense fallback={<PageLoader />}>
            <Create onNavigate={setView} />
          </Suspense>
        );
      case ViewState.PROFILE:
        return (
          <Suspense fallback={<PageLoader />}>
            <Profile />
          </Suspense>
        );
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      {/* Main Content Area */}
      <main className="mx-auto max-w-md bg-black min-h-screen shadow-2xl shadow-zinc-900 relative border-x border-zinc-900">
        {renderView()}
        
        {/* Hide bottom nav on Create screen for better focus */}
        {view !== ViewState.CREATE && (
          <BottomNav currentView={view} onChange={setView} />
        )}
      </main>
    </div>
  );
};

export default App;