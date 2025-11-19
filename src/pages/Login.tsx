import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { Language, t } from '../lib/i18n';
import { Ghost, Chrome, Sparkles } from 'lucide-react';

export function Login({ lang }: { lang: Language }) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleAnonLogin = async () => {
    await supabase.auth.signInAnonymously();
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600 rounded-full filter blur-[100px] opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        <div className="mb-8 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400 blur-lg opacity-50 rounded-full"></div>
           <div className="relative bg-[#05050A] p-4 rounded-2xl border border-white/10 shadow-2xl">
             <Ghost size={48} className="text-white" />
           </div>
        </div>

        <h1 className="text-5xl font-bold mb-3 tracking-tighter text-white">
          iSecret
        </h1>
        <p className="text-gray-400 mb-12 text-lg">Where secrets live in the shadows.</p>

        <div className="space-y-4 w-full">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Chrome size={20} />
            {t('login_google', lang)}
          </button>
          
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1"></div>
            <span className="text-gray-500 text-sm uppercase tracking-widest font-medium">Options</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent flex-1"></div>
          </div>

          <button
            onClick={handleAnonLogin}
            className="group w-full flex items-center justify-center gap-3 glass-panel py-4 px-6 rounded-2xl font-bold text-gray-200 hover:text-white hover:border-violet-500/50 transition-all duration-300 hover:scale-[1.02]"
          >
            <Sparkles size={20} className="text-violet-400 group-hover:text-cyan-400 transition-colors" />
            {t('login_anon', lang)}
          </button>
        </div>
        
        <p className="mt-12 text-xs text-gray-600">
          By continuing, you agree to stay anonymous.
        </p>
      </div>
    </div>
  );
}