import React, { useState, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import RiskCard from './components/RiskCard';
import { ProjectState, RiskSeverity, ImpactLevel } from './types';
import { analyzeCreditAgreement } from './services/geminiService';
import { ADVERSARIAL_PATTERNS } from './constants';

const Indicator = ({ level }: { level: ImpactLevel }) => {
  const activeCount = level === 'High' ? 3 : level === 'Medium' ? 2 : 1;
  const color = level === 'High' ? 'bg-rose-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map(i => (
        <div key={i} className={`w-2.5 h-1.5 rounded-sm transition-colors ${i <= activeCount ? color : 'bg-slate-100'}`} />
      ))}
    </div>
  );
};

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
    if (!state.risks.length) return 'UNRATED';
    const hasCritical = state.risks.some(r => r.severity === RiskSeverity.CRITICAL);
    if (hasCritical) return 'CRITICAL';
    if (state.risks.length > 3) return 'HIGH RISK';
    return 'ELEVATED';
  }, [state.risks]);

  const renderLanding = () => (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-indigo-600 text-[11px] font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Deterministic Credit Intelligence
            </div>
            <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
              Anticipate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">Loophole</span> before it opens.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
              The world's first adversarial engine for credit agreements. We scan legal text to identify structural weaknesses used by sophisticated borrowers to strip assets and dilute collateral.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all flex items-center gap-3"
              >
                Launch Scanner
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <div className="text-slate-400 text-sm font-medium px-4">
                Institutional-grade security. <br/> deterministic rule-matching.
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-blue-500 opacity-10 blur-3xl rounded-[3rem]"></div>
            <div className="relative bg-white border border-slate-200 p-8 rounded-[2rem] shadow-2xl">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="font-bold text-slate-900">Live Analysis Demo</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-50 rounded-md w-3/4"></div>
                  <div className="h-4 bg-slate-50 rounded-md w-full"></div>
                  <div className="h-4 bg-indigo-50 rounded-md w-1/2 border border-indigo-100 flex items-center px-2">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter">Loophole Detected: J.Crew Step-Down</span>
                  </div>
                  <div className="h-4 bg-slate-50 rounded-md w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {ADVERSARIAL_PATTERNS.map((p, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all space-y-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug">{p.name}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSimulator = () => (
    <div className="h-[calc(100vh-73px)] flex flex-col bg-white">
      {state.isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
          <div className="max-w-md w-full text-center space-y-10">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 rounded-full border-[6px] border-slate-200"></div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={465} strokeDashoffset={465 - (465 * state.analysisProgress) / 100} className="text-indigo-600 transition-all duration-700 ease-out" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900">{state.analysisProgress}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Processed</span>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Applying Intelligence Filters</h2>
              <p className="text-slate-500 font-medium">Indexing clause interactions across Article VI and VIII...</p>
            </div>
          </div>
        </div>
      ) : !state.content ? (
        <div className="flex-1 flex items-center justify-center p-12 bg-slate-50">
           <div 
             onClick={() => fileInputRef.current?.click()} 
             className="max-w-xl w-full border-2 border-dashed border-slate-200 bg-white p-20 rounded-3xl text-center shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group"
           >
              <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500">
                <svg className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Ingest Contractual Data</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Upload any Credit Agreement or Loan Document to begin rule-based risk identification.</p>
           </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex overflow-hidden">
            <aside className="w-[380px] bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
               <div className="p-6 space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest">Risk Registry</h4>
                    <span className="text-[11px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-0.5 rounded-full">{state.risks.length} Issues</span>
                 </div>
                 
                 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Structural Risk Index</div>
                       <div className={`text-2xl font-black italic tracking-tighter ${dealRiskScore.includes('CRITICAL') ? 'text-rose-600' : 'text-slate-900'}`}>{dealRiskScore}</div>
                    </div>
                 </div>
               </div>

               <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
                  {state.risks.map(r => (
                    <RiskCard key={r.id} risk={r} isSelected={selectedRiskId === r.id} onClick={() => setSelectedRiskId(r.id)} />
                  ))}
               </div>
            </aside>

            <section className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button 
                      onClick={() => setState(prev => ({...prev, showAdversarial: false}))}
                      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${!state.showAdversarial ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Clause
                    </button>
                    <button 
                      onClick={() => setState(prev => ({...prev, showAdversarial: true}))}
                      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${state.showAdversarial ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      AI Insight
                    </button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-12">
                  {selectedRisk ? (
                    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                       <div className="space-y-4">
                          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {selectedRisk.title}
                          </h2>
                          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                            {selectedRisk.description}
                          </p>
                       </div>

                       <div className="relative group">
                          <div className={`relative bg-white border ${state.showAdversarial ? 'border-indigo-100' : 'border-slate-100'} p-12 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] min-h-[450px]`}>
                             <div className="mono text-[15px] leading-[1.8] text-slate-700 whitespace-pre-wrap">
                                {state.showAdversarial && selectedRisk.evidenceSnippet.includes(selectedRisk.adversarialHighlight) ? (
                                  <>
                                    {selectedRisk.evidenceSnippet.split(selectedRisk.adversarialHighlight)[0]}
                                    <span className="relative inline px-1 py-0.5 font-bold text-slate-900 underline decoration-rose-500 decoration-4 underline-offset-4 bg-rose-50 rounded">
                                        {selectedRisk.adversarialHighlight}
                                    </span>
                                    {selectedRisk.evidenceSnippet.split(selectedRisk.adversarialHighlight)[1]}
                                  </>
                                ) : (
                                  selectedRisk.evidenceSnippet
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                       <h3 className="text-xl font-bold text-slate-400">Select Risk from Registry</h3>
                    </div>
                  )}
               </div>
            </section>

            <aside className="w-[440px] bg-slate-50 overflow-y-auto shrink-0 border-l border-slate-200">
               {selectedRisk && (
                 <div className="p-10 space-y-12">
                    <div className="space-y-6">
                       <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Adversarial Projection</h4>
                       <div className="bg-slate-900 p-10 rounded-[2rem] text-white shadow-2xl">
                          <h5 className="text-xl font-bold text-indigo-300 italic uppercase mb-4">{selectedRisk.scenarioTitle}</h5>
                          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                             {selectedRisk.scenarioNarrative}
                          </p>
                          <div className="inline-flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
                             <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                             <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest">{selectedRisk.scenarioImpact}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Risk Vectors</h4>
                       <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                          <div className="flex justify-between items-center">
                             <div className="text-[11px] font-bold text-slate-900 uppercase">Recovery Risk</div>
                             <Indicator level={selectedRisk.recoveryRisk} />
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="text-[11px] font-bold text-slate-900 uppercase">Control Risk</div>
                             <Indicator level={selectedRisk.controlRisk} />
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="text-[11px] font-bold text-slate-900 uppercase">Timing Risk</div>
                             <Indicator level={selectedRisk.timingRisk} />
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </aside>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-600 selection:text-white antialiased">
      <Navbar currentView={state.view} onNavigate={(v) => setState(prev => ({...prev, view: v}))} />
      {state.view === 'landing' ? renderLanding() : renderSimulator()}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.pdf" />
      <footer className="bg-white border-t border-slate-100 py-4 px-12 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>ADS // Institutional Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>v4.2.1-prod</span>
          </div>
      </footer>
    </div>
  );
};

export default App;