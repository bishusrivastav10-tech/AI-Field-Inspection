import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Layers 
} from 'lucide-react';

export default function AIAnalysisModal({ isOpen, result, onClose, onViewWorkOrder, onViewDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      const timer1 = setTimeout(() => setCurrentStep(2), 700);
      const timer2 = setTimeout(() => setCurrentStep(3), 1400);
      const timer3 = setTimeout(() => setCurrentStep(4), 2100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isComplete = result && currentStep >= 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className={`w-6 h-6 ${!isComplete ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>AFO AI Processing Engine</span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 rounded-full border border-cyan-800">
                  REAL-TIME
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isComplete ? 'Analysis completed & Work Order generated' : 'Executing vision triage & decision matrix...'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Step Tracker */}
        {!isComplete ? (
          <div className="py-8 space-y-6">
            
            {/* Visual Radar Animation Box */}
            <div className="relative h-44 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500/5" />
              {/* Radar beam line */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/30 to-transparent animate-radar" />
              
              <div className="relative z-10 text-center space-y-2">
                <Sparkles className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
                <p className="text-sm font-semibold text-slate-200">Analyzing Photo Pixel Vectors & Geometry...</p>
                <p className="text-xs font-mono text-cyan-400">Gemini Vision Model v2.5 Flash</p>
              </div>
            </div>

            {/* Step Items */}
            <div className="space-y-3">
              
              <div className={`flex items-center space-x-3 p-3 rounded-xl border text-xs transition-all ${
                currentStep >= 1 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${currentStep >= 1 ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className="font-semibold">Step 1: Visual Defect Extraction & Segmentation</span>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-xl border text-xs transition-all ${
                currentStep >= 2 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${currentStep >= 2 ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className="font-semibold">Step 2: Multimodal AI Classification & Confidence Metric</span>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-xl border text-xs transition-all ${
                currentStep >= 3 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${currentStep >= 3 ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className="font-semibold">Step 3: Decision Engine Priority & Team Assignment</span>
              </div>

              <div className={`flex items-center space-x-3 p-3 rounded-xl border text-xs transition-all ${
                currentStep >= 4 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${currentStep >= 4 ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className="font-semibold">Step 4: Dispatch Work Order Record</span>
              </div>

            </div>

          </div>
        ) : (
          /* Analysis Complete Result Card */
          <div className="space-y-5 py-2">
            
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Work Order Generated Successfully</h4>
                  <p className="text-xs text-emerald-300">ID: <strong className="font-mono text-emerald-400">{result?.workOrder?.id}</strong></p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {result?.workOrder?.priority} PRIORITY
              </span>
            </div>

            {/* Generated Attributes Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Detected Issue</span>
                <span className="font-bold text-white text-sm">{result?.aiAnalysis?.issue_type}</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">AI Confidence Score</span>
                <span className="font-bold text-cyan-400 text-sm">{result?.aiAnalysis?.confidence}% Confidence</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Assigned Maintenance Team</span>
                <span className="font-semibold text-blue-400">{result?.decision?.assignedTeam}</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">SLA Response Window</span>
                <span className="font-semibold text-amber-400">{result?.decision?.slaWindow}</span>
              </div>
            </div>

            {/* Safety Warning */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Safety Caution:</strong> {result?.decision?.safetyWarning}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onViewWorkOrder(result?.workOrder?.id)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <FileText className="w-4 h-4" />
                <span>Open Work Order Details</span>
              </button>

              <button
                onClick={onViewDashboard}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Go to Dashboard
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
