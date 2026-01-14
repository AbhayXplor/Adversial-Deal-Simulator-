import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'simulator') => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3.5 flex justify-between items-center">
      <div 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onNavigate('landing')}
      >
        <div className="bg-indigo-600 w-9 h-9 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:bg-indigo-700 transition-all">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold text-slate-900 tracking-tight">ADS<span className="text-indigo-600">.</span>SIM</span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Adversarial Engine</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-10">
        <div className="flex space-x-6">
          <button 
            onClick={() => onNavigate('landing')}
            className={`text-sm font-medium transition-all ${currentView === 'landing' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Product
          </button>
          <button 
            onClick={() => onNavigate('simulator')}
            className={`text-sm font-medium transition-all ${currentView === 'simulator' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Analysis Console
          </button>
        </div>
        
        <button 
          onClick={() => onNavigate('simulator')}
          className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <span>Run Intelligence Scan</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;