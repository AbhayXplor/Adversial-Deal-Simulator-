import React from 'react';
import { RiskAnalysis, RiskSeverity } from '../types';

interface RiskCardProps {
  risk: RiskAnalysis;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryBadge = ({ category, isSelected }: { category: string, isSelected: boolean }) => {
  const color = isSelected ? 'text-indigo-200' : 'text-slate-400';
  return (
    <div className={`text-[10px] font-semibold uppercase tracking-wider ${color}`}>
      {category}
    </div>
  );
};

const RiskCard: React.FC<RiskCardProps> = ({ risk, isSelected, onClick }) => {
  const severityStyles = {
    [RiskSeverity.CRITICAL]: 'border-rose-500 text-rose-600 bg-rose-50',
    [RiskSeverity.HIGH]: 'border-orange-500 text-orange-600 bg-orange-50',
    [RiskSeverity.MEDIUM]: 'border-amber-500 text-amber-600 bg-amber-50',
    [RiskSeverity.LOW]: 'border-slate-300 text-slate-500 bg-slate-50',
  };

  return (
    <div 
      onClick={onClick}
      className={`group p-5 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isSelected 
        ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-200' 
        : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <CategoryBadge category={risk.category} isSelected={isSelected} />
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityStyles[risk.severity]}`}>
          {risk.severity}
        </span>
      </div>
      
      <h3 className={`font-semibold text-[15px] leading-snug mb-4 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
        {risk.title}
      </h3>
      
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-[11px] font-mono ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
          <span className="opacity-60">RULE:</span>
          <span className="font-bold">{risk.ruleLabel}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
};

export default RiskCard;