import React, { useState } from 'react';
import { Ghost, Globe } from 'lucide-react';
import { APP_NAME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Auth: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { signInWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        <Globe size={16} className="text-subtext" />
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as any)}
          className="bg-transparent text-sm text-subtext border-none focus:ring-0 cursor-pointer"
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center text-center">
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-surface/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-neon border border-white/5 rotate-3">
             <Ghost size={48} className="text-primary drop-shadow-lg" />
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-2 glitch-text" data-text={APP_NAME}>
          {APP_NAME}
        </h1>
        <h2 className="text-xl font-bold text-white mb-4">
          {t.welcomeTitle}
        </h2>
        <p className="text-subtext text-sm leading-relaxed mb-12 max-w-[280px]">
          {t.welcomeSubtitle}
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-transform active:scale-95 shadow-lg disabled:opacity-70"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {isLoggingIn ? '...' : t.loginGoogle}
          </button>

          <div className="text-xs text-zinc-500 mt-4">
            * {t.loginFooter}
          </div>
        </div>
      </div>
    </div>
  );
};