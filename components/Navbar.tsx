
import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'simulator') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F1A] border-b border-slate-800 px-8 py-4 flex justify-between items-center">
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onNavigate('landing')}
      >
        <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center group-hover:bg-blue-500 transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-lg font-black text-white tracking-widest uppercase italic">ADS<span className="text-blue-500">.</span>SIM</span>
      </div>
      
      <div className="flex items-center space-x-12">
        <div className="flex space-x-8">
          <button 
            onClick={() => onNavigate('landing')}
            className={`text-xs font-bold uppercase tracking-widest transition-all ${currentView === 'landing' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
          >
            Terminal
          </button>
          <button 
            onClick={() => onNavigate('simulator')}
            className={`text-xs font-bold uppercase tracking-widest transition-all ${currentView === 'simulator' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
          >
            Simulator
          </button>
        </div>
        
        <button 
          onClick={() => onNavigate('simulator')}
          className="bg-white hover:bg-slate-100 text-black px-6 py-2 rounded font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
        >
          Initialize Scan
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
