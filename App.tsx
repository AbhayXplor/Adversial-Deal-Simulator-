
import React, { useState, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import RiskCard from './components/RiskCard';
import { ProjectState, RiskSeverity, ImpactLevel } from './types';
import { analyzeCreditAgreement } from './services/geminiService';
import { ADVERSARIAL_PATTERNS, SYSTEM_LIMITATIONS } from './constants';

const ImpactMeter = ({ label, level }: { label: string, level: ImpactLevel }) => {
  const bars = { Low: 1, Medium: 2, High: 3 };
  return (
    <div className="flex items-center gap-4 group">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[100px]">{label}</span>
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i <= bars[level] 
              ? (level === 'High' ? 'bg-rose-500' : level === 'Medium' ? 'bg-orange-400' : 'bg-blue-500') 
              : 'bg-slate-100'
            }`} 
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-slate-400 w-12 text-right">{level}</span>
    </div>
  );
};

const HeatStrip = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="flex gap-0.5 h-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i} 
          className={`flex-1 rounded-sm ${i < value * 2 ? 'bg-blue-600' : 'bg-slate-100'}`} 
        />
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>({
    fileName: null,
    content: null,
    clauses: [],
    risks: [],
    isAnalyzing: false,
    analysisProgress: 0,
    view: 'landing',
    showAdversarial: true
  });

  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setState(prev => ({ ...prev, fileName: file.name, isAnalyzing: true, analysisProgress: 5, view: 'simulator' }));
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        const { clauses, risks } = await analyzeCreditAgreement(text, (p) => setState(prev => ({ ...prev, analysisProgress: p })));
        setState(prev => ({ ...prev, content: text, clauses, risks, isAnalyzing: false }));
        if (risks.length > 0) setSelectedRiskId(risks[0].id);
      } catch (error) {
        setState(prev => ({ ...prev, isAnalyzing: false, analysisProgress: 0 }));
      }
    };
    reader.readAsText(file);
  };

  const selectedRisk = useMemo(() => state.risks.find(r => r.id === selectedRiskId), [state.risks, selectedRiskId]);

  const dealRiskScore = useMemo(() => {
    if (!state.risks.length) return 'UNSCANNED';
    if (state.risks.some(r => r.severity === RiskSeverity.CRITICAL)) return 'CRITICAL';
    if (state.risks.some(r => r.severity === RiskSeverity.HIGH)) return 'HIGH';
    return 'ELEVATED';
  }, [state.risks]);

  const renderLanding = () => (
    <div className="min-h-[calc(100vh-73px)] bg-[#0B0F1A] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1 border border-blue-500/30 rounded-full bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Secured Asset Verification Engine
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9] text-center">
            ADVERSARIAL<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">DEAL SIMULATOR</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Uncover structural credit risks before they become legal realities. Deterministic logic scanning for enterprise-grade loan agreements.
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Ingest Agreement
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {ADVERSARIAL_PATTERNS.map((p, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg backdrop-blur-sm group hover:border-blue-500/50 transition-colors">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">{p.name.split(' ')[0]}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed group-hover:text-slate-300 transition-colors">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSimulator = () => (
    <div className="h-[calc(100vh-73px)] flex flex-col bg-[#F8FAFC]">
      {state.isAnalyzing ? (
        <div className="flex-1 flex items-center justify-center bg-[#0B0F1A]">
          <div className="text-center space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-800" />
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * state.analysisProgress) / 100} className="text-blue-500 transition-all duration-700 ease-in-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-white text-2xl tracking-tighter italic">
                {state.analysisProgress}%
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase">Initializing Deterministic Scan</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Running Structural Logic v4.2.1</p>
            </div>
          </div>
        </div>
      ) : !state.content ? (
        <div className="flex-1 flex items-center justify-center p-12">
           <div 
             onClick={() => fileInputRef.current?.click()} 
             className="max-w-xl w-full border-2 border-dashed border-slate-200 bg-white p-24 rounded-3xl text-center group hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer"
           >
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-slate-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-4">Awaiting Input</h3>
              <p className="text-slate-500 text-sm font-medium">Click to upload a Credit Agreement (.txt / .pdf) for scanning.</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Dashboard Header */}
          <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-12">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structural Risk Index</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   </div>
                   <h2 className={`text-4xl font-black tracking-tighter ${dealRiskScore === 'CRITICAL' ? 'text-rose-600' : 'text-slate-900'}`}>
                     {dealRiskScore}
                   </h2>
                </div>
                
                <div className="flex gap-8 border-l border-slate-100 pl-12 h-12 items-center">
                   <div className="w-40"><HeatStrip label="Asset" value={dealRiskScore === 'CRITICAL' ? 5 : 3} /></div>
                   <div className="w-40"><HeatStrip label="Control" value={4} /></div>
                   <div className="w-40"><HeatStrip label="Debt" value={2} /></div>
                </div>
             </div>

             <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Document Status</span>
                  <span className="block text-xs font-bold text-slate-700 italic uppercase tracking-tighter">{state.fileName}</span>
                </div>
                <button 
                  onClick={() => setState(prev => ({...prev, content: null}))}
                  className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 p-2.5 rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
             </div>
          </header>

          <main className="flex-1 flex overflow-hidden">
            {/* LEFT RAIL: VULNERABILITIES */}
            <aside className="w-80 bg-[#F1F5F9] border-r border-slate-200 flex flex-col shrink-0">
               <div className="p-5 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Registry</h4>
                  <span className="text-[10px] font-black text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm">{state.risks.length}</span>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {state.risks.map(r => (
                    <RiskCard key={r.id} risk={r} isSelected={selectedRiskId === r.id} onClick={() => setSelectedRiskId(r.id)} />
                  ))}
               </div>
            </aside>

            {/* MIDDLE: EVIDENCE VIEWER */}
            <section className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
               <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setState(prev => ({...prev, showAdversarial: false}))}
                      className={`px-6 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${!state.showAdversarial ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Base Clause
                    </button>
                    <button 
                      onClick={() => setState(prev => ({...prev, showAdversarial: true}))}
                      className={`px-6 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${state.showAdversarial ? 'bg-[#0B0F1A] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Adversarial Highlighting
                    </button>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Evidence Hash: {selectedRisk?.ruleLabel}</span>
               </div>

               <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
                  {selectedRisk ? (
                    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded">{selectedRisk.ruleLabel}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic decoration-slate-200 underline">Section Ref: {selectedRisk.affectedClauses[0]}</span>
                          </div>
                          <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">
                            {selectedRisk.title}
                          </h2>
                       </div>

                       <div className="relative group">
                          <div className={`absolute -inset-1 bg-gradient-to-r ${state.showAdversarial ? 'from-rose-500/20 to-blue-500/20' : 'from-slate-200 to-slate-200'} blur opacity-25 transition-all duration-500`}></div>
                          <div className={`relative bg-white border ${state.showAdversarial ? 'border-blue-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]' : 'border-slate-200 shadow-sm'} p-12 rounded-2xl min-h-[400px]`}>
                             <div className="mono text-sm leading-[1.8] text-slate-700 whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
                                {state.showAdversarial && selectedRisk.evidenceSnippet.includes(selectedRisk.adversarialHighlight) ? (
                                  <>
                                    {selectedRisk.evidenceSnippet.split(selectedRisk.adversarialHighlight)[0]}
                                    <span className="relative inline-block group">
                                      <span className="absolute -inset-0.5 bg-rose-500 opacity-10 rounded"></span>
                                      <span className="relative bg-rose-600 text-white px-1.5 py-0.5 font-bold rounded shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse">
                                        {selectedRisk.adversarialHighlight}
                                      </span>
                                    </span>
                                    {selectedRisk.evidenceSnippet.split(selectedRisk.adversarialHighlight)[1]}
                                  </>
                                ) : (
                                  selectedRisk.evidenceSnippet
                                )}
                             </div>
                          </div>
                       </div>
                       
                       {state.showAdversarial && (
                         <div className="p-6 bg-slate-900 rounded-xl flex items-start gap-4 shadow-xl translate-y-[-20px] mx-12">
                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center shrink-0">
                               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="space-y-1">
                               <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Adversarial Insight</h5>
                               <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                                 The language highlighted above creates a legal vacuum, permitting the borrower to redirect value without lender oversight.
                               </p>
                            </div>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                       <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                       </div>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Select Data Node</span>
                    </div>
                  )}
               </div>
            </section>

            {/* RIGHT RAIL: SCENARIO & IMPACT */}
            <aside className="w-[420px] bg-white overflow-y-auto p-8 flex flex-col shrink-0 space-y-10">
               {selectedRisk ? (
                 <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                    <section className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-3">Adversarial Simulation</h4>
                       <div className="bg-[#0B0F1A] p-8 rounded-2xl text-white shadow-2xl space-y-4">
                          <h5 className="text-lg font-black tracking-tight text-blue-400 leading-tight uppercase italic">{selectedRisk.scenarioTitle}</h5>
                          <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            {selectedRisk.scenarioNarrative}
                          </p>
                          <div className="pt-4 flex items-center gap-3">
                             <div className="px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase rounded shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                               {selectedRisk.scenarioImpact}
                             </div>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Simulated Impact</span>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-3">Risk Vector Analysis</h4>
                       <div className="space-y-8 px-2">
                          <ImpactMeter label="Recovery Risk" level={selectedRisk.recoveryRisk} />
                          <ImpactMeter label="Control Risk" level={selectedRisk.controlRisk} />
                          <ImpactMeter label="Timing Risk" level={selectedRisk.timingRisk} />
                       </div>
                    </section>

                    <section className="space-y-4">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-3">Logic Path</h4>
                       <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl">
                          <p className="text-[11px] text-slate-600 font-bold leading-relaxed italic mono">{selectedRisk.ruleLogic}</p>
                       </div>
                    </section>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Engine Standby</span>
                 </div>
               )}
            </aside>
          </main>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Navbar currentView={state.view} onNavigate={(v) => setState(prev => ({...prev, view: v}))} />
      {state.view === 'landing' ? renderLanding() : renderSimulator()}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.pdf" />
      <footer className="bg-white border-t border-slate-200 py-4 px-12 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em]">ADS Terminal v4.2.1</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <div className="flex gap-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <span>Institutional Grade Analysis</span>
             <span className="text-slate-200">|</span>
             <span>Deterministic Logic Engine</span>
          </div>
      </footer>
    </div>
  );
};

export default App;
