import React from 'react';
import { Home, Search, Plus, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItemClass = (path: string) => 
    `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
      currentPath === path ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-border pb-safe pt-2 px-6 h-16 z-50 flex justify-between items-center max-w-md mx-auto">
      <Link to="/" className={navItemClass('/')}>
        <Home size={24} strokeWidth={currentPath === '/' ? 2.5 : 2} />
      </Link>
      
      <Link to="/explore" className={navItemClass('/explore')}>
        <Search size={24} strokeWidth={currentPath ===('/explore') ? 2.5 : 2} />
      </Link>

      <Link to="/create" className="flex items-center justify-center w-12 h-8 mx-2 relative group">
        <div className="absolute left-0 top-0 bottom-0 w-full bg-secondary rounded-lg transform -translate-x-[3px] transition-transform group-active:translate-x-0" />
        <div className="absolute right-0 top-0 bottom-0 w-full bg-primary rounded-lg transform translate-x-[3px] transition-transform group-active:translate-x-0" />
        <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center z-10">
           <Plus size={20} className="text-black" strokeWidth={3} />
        </div>
      </Link>

      <Link to="/profile" className={navItemClass('/profile')}>
        <User size={24} strokeWidth={currentPath === '/profile' ? 2.5 : 2} />
      </Link>
    </div>
  );
};