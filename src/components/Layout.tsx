import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, User as UserIcon, Plus, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Language } from '../lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, active }: { to: string; icon: any; active: boolean }) => (
    <Link to={to} className="relative flex flex-col items-center justify-center w-12 h-12 group">
      <div className={`absolute inset-0 bg-violet-500/20 rounded-xl transition-all duration-300 ${active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
      <Icon 
        size={24} 
        className={`z-10 transition-all duration-300 ${active ? 'text-violet-400 -translate-y-1' : 'text-gray-400 group-hover:text-white'}`} 
        strokeWidth={active ? 2.5 : 2}
      />
      {active && <span className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />}
    </Link>
  );

  return (
    <div className="min-h-screen text-white flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl shadow-black">
      {/* Background Ambient Effects */}
      <div className="blob w-64 h-64 bg-violet-900 top-[-10%] left-[-20%] animate-float" />
      <div className="blob w-80 h-80 bg-cyan-900 bottom-[-10%] right-[-20%] animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center bg-transparent z-20">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">iSecret</span>
        </h1>
        <button 
          onClick={handleLogout} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 overflow-y-auto scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 px-4 pb-4">
        <div className="glass-nav rounded-2xl flex justify-between items-center px-6 py-2 shadow-2xl shadow-black/50">
          <NavItem to="/" icon={Home} active={location.pathname === '/'} />
          <NavItem to="/explore" icon={Search} active={location.pathname === '/explore'} />
          
          {/* Floating Action Button */}
          <Link to="/create" className="relative -top-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-[#05050A] p-1 rounded-full">
              <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-3 rounded-full text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Plus size={28} />
              </div>
            </div>
          </Link>

          <NavItem to="/profile" icon={UserIcon} active={location.pathname === '/profile'} />
        </div>
      </nav>
    </div>
  );
}