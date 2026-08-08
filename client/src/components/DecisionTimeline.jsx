import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Cpu, Wrench, ShieldAlert } from 'lucide-react';

export default function DecisionTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-slate-500 text-sm italic py-4">No timeline logs recorded yet.</div>
    );
  }

  const getStepIcon = (text) => {
    const t = text.toLowerCase();
    if (t.includes('gemini') || t.includes('ai') || t.includes('identified')) {
      return <Cpu className="w-4 h-4 text-cyan-400" />;
    }
    if (t.includes('decision') || t.includes('classified') || t.includes('priority')) {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
    if (t.includes('verified') || t.includes('closed') || t.includes('completed')) {
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    }
    if (t.includes('warning') || t.includes('hazard')) {
      return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
    return <Wrench className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
      {timeline.map((item, idx) => (
        <div key={idx} className="relative group">
          {/* Node Icon */}
          <div className="absolute -left-[31px] top-0.5 h-6 w-6 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center group-hover:border-cyan-500 transition-colors">
            {getStepIcon(item.text)}
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono text-cyan-400/90 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(item.time).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
