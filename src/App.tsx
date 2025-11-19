import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';
import { Profile } from './pages/Profile';
import { useAuth } from './hooks/useAuth';
import { getBrowserLanguage, t } from './lib/i18n';

export default function App() {
  const { session, loading } = useAuth();
  const lang = getBrowserLanguage();
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
     const env = (import.meta as any).env;
     if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
         setIsConfigured(false);
     }
  }, []);

  if (!isConfigured) {
      return (
          <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-3xl font-bold text-[#ff4b4b] mb-4">{t('setup_required', lang)}</h1>
              <p className="text-gray-400 mb-4">{t('setup_msg', lang)}</p>
              <div className="bg-[#1B1B26] p-4 rounded text-left font-mono text-sm text-[#00D4FF] w-full max-w-md overflow-x-auto">
                  VITE_SUPABASE_URL=...<br/>
                  VITE_SUPABASE_ANON_KEY=...
              </div>
          </div>
      )
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-[#6C38FF]">Loading...</div>;
  }

  if (!session) {
    return <Login lang={lang} />;
  }

  return (
    <Layout lang={lang}>
      <Routes>
        <Route path="/" element={<Home lang={lang} />} />
        <Route path="/create" element={<CreatePost lang={lang} />} />
        <Route path="/profile" element={<Profile lang={lang} />} />
        <Route path="/explore" element={<div className="p-10 text-center text-gray-500">{t('explore', lang)} (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}