
import React from 'react';
import { RiskAnalysis, RiskSeverity } from '../types';

interface RiskCardProps {
  risk: RiskAnalysis;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  const c = category.toLowerCase();
  if (c.includes('subsidiary') || c.includes('transfer')) return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
  );
  if (c.includes('debt') || c.includes('incremental')) return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
  );
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
  );
};

const RiskCard: React.FC<RiskCardProps> = ({ risk, isSelected, onClick }) => {
  const severityColor = risk.severity === RiskSeverity.CRITICAL ? 'rose' : risk.severity === RiskSeverity.HIGH ? 'orange' : risk.severity === RiskSeverity.MEDIUM ? 'amber' : 'slate';

  return (
    <div 
      onClick={onClick}
      className={`relative group p-4 border transition-all duration-300 cursor-pointer ${
        isSelected 
        ? 'bg-[#1E293B] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
      
      <div className="flex justify-between items-center mb-2">
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
          <CategoryIcon category={risk.category} />
          {risk.category}
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${
          risk.severity === 'Critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
          risk.severity === 'High' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 
          'bg-amber-500'
        }`} />
      </div>
      
      <h3 className={`font-black text-xs leading-tight mb-3 uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
        {risk.title}
      </h3>
      
      <div className="flex items-center justify-between">
        <span className={`mono text-[9px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-slate-800 text-blue-300' : 'bg-slate-100 text-slate-500'}`}>
          {risk.ruleLabel}
        </span>
        <div className={`text-[9px] font-black uppercase tracking-tighter ${isSelected ? 'text-blue-400' : 'text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity'}`}>
          Review Analysis →
        </div>
      </div>
    </div>
  );
};

export default RiskCard;
