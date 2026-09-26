import React from 'react';
import { Home, Layers, Award, MessageSquare, BarChart2 } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigateTo, role } = useAuth();

  // If in admin mode, don't show the student bottom bar
  if (role === 'ADMIN') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around safe-bottom shadow-lg">
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
          currentView === 'home' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Home</span>
      </button>

      <button
        onClick={() => navigateTo('units')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
          currentView === 'units' || currentView === 'unit-detail' || currentView === 'lecture'
            ? 'text-indigo-600 font-semibold'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Units</span>
      </button>

      <button
        onClick={() => navigateTo('sample-papers')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
          currentView === 'sample-papers' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Award className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">CBSE Papers</span>
      </button>

      <button
        onClick={() => navigateTo('suggestions')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
          currentView === 'suggestions' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <MessageSquare className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Suggestions</span>
      </button>

      <button
        onClick={() => navigateTo('progress')}
        className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] min-h-[44px] rounded-lg transition-colors cursor-pointer ${
          currentView === 'progress' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <BarChart2 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">Progress</span>
      </button>
    </nav>
  );
};
