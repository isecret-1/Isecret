import React from 'react';
import { Home, Search, Plus, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  const navItemClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
      currentView === view ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-border pb-safe pt-2 px-6 h-16 z-50 flex justify-between items-center max-w-md mx-auto">
      <button className={navItemClass(ViewState.FEED)} onClick={() => onChange(ViewState.FEED)}>
        <Home size={24} strokeWidth={currentView === ViewState.FEED ? 2.5 : 2} />
      </button>
      
      <button className={navItemClass(ViewState.EXPLORE)} onClick={() => onChange(ViewState.EXPLORE)}>
        <Search size={24} strokeWidth={currentView === ViewState.EXPLORE ? 2.5 : 2} />
      </button>

      {/* TikTok style Create Button */}
      <button 
        className="flex items-center justify-center w-12 h-8 mx-2 relative group"
        onClick={() => onChange(ViewState.CREATE)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-full bg-secondary rounded-lg transform -translate-x-[3px]" />
        <div className="absolute right-0 top-0 bottom-0 w-full bg-primary rounded-lg transform translate-x-[3px]" />
        <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center z-10">
           <Plus size={20} className="text-black" strokeWidth={3} />
        </div>
      </button>

      {/* Placeholder for Notifications/Activity if needed, using Profile for now */}
      <button className={navItemClass(ViewState.PROFILE)} onClick={() => onChange(ViewState.PROFILE)}>
        <User size={24} strokeWidth={currentView === ViewState.PROFILE ? 2.5 : 2} />
      </button>
    </div>
  );
};