import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Clock, 
  Wrench, 
  Package, 
  Printer, 
  Sparkles, 
  MapPin, 
  FileText,
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { fetchWorkOrderById, updateWorkOrderStatus } from '../utils/api';
import DecisionTimeline from './DecisionTimeline';

export default function WorkOrderDetail({ workOrderId, onBack, onVerifyRepair }) {
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Review safety warnings and wear designated PPE", completed: true },
    { id: 2, text: "Isolate asset / turn off adjacent power breaker", completed: false },
    { id: 3, text: "Gather required replacement parts & toolset", completed: false },
    { id: 4, text: "Execute recommended repair action", completed: false },
    { id: 5, text: "Capture after-repair photograph for AI verification", completed: false }
  ]);

  const loadWorkOrder = async () => {
    setLoading(true);
    try {
      const res = await fetchWorkOrderById(workOrderId);
      if (res.workOrder) {
        setWorkOrder(res.workOrder);
      }
    } catch (err) {
      console.error("Error fetching work order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workOrderId) loadWorkOrder();
  }, [workOrderId]);

  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateWorkOrderStatus(workOrderId, { status: newStatus });
      if (res.workOrder) {
        setWorkOrder(res.workOrder);
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-r-transparent"></div>
        <p className="text-sm text-slate-400">Loading Work Order details...</p>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-4xl mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Work Order Not Found</h3>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 print:p-0">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrintReport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Work Order Report</span>
          </button>

          {workOrder.status !== 'Closed' && (
            <button
              onClick={() => onVerifyRepair(workOrder.id)}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Repair Proof</span>
            </button>
          )}
        </div>
      </div>

      {/* Main WO Header Banner */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xl font-extrabold text-cyan-400">
                {workOrder.id}
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                workOrder.priority === 'Emergency' || workOrder.priority === 'Urgent'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
              }`}>
                {workOrder.priority} PRIORITY
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                workOrder.status === 'Closed'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
              }`}>
                {workOrder.status}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-white mt-2">
              {workOrder.issueType}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{workOrder.location}</span>
            </p>
          </div>

          {/* Quick status selector */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 print:hidden">
            <span className="text-[11px] text-slate-400 block font-semibold">Change Workflow Status:</span>
            <select
              value={workOrder.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="Created">Created</option>
              <option value="In Progress">In Progress</option>
              <option value="Inspection Scheduled">Inspection Scheduled</option>
              <option value="Closed">Closed & Verified</option>
              <option value="Reassigned">Reassigned for Rework</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide): Visual Evidence & AI Action Plan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Photo & AI Diagnosis */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Multimodal AI Vision Diagnosis</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Photo Preview */}
              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 h-56">
                <img 
                  src={workOrder.beforeImage} 
                  alt="Defect evidence"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/uploads/sample_leak.jpg'; }}
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg border border-slate-700 text-[11px] font-mono text-cyan-400 font-bold">
                  CONFIDENCE: {workOrder.confidence}%
                </div>
              </div>

              {/* Structured AI Output Details */}
              <div className="space-y-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Visual Physical Evidence</span>
                  <p className="text-xs text-slate-200 font-medium mt-0.5 leading-relaxed">
                    "{workOrder.evidence}"
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Recommended Action</span>
                  <p className="text-xs text-cyan-300 font-semibold mt-0.5 leading-relaxed">
                    {workOrder.recommendedAction}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Assigned Team</span>
                    <span className="font-bold text-blue-400">{workOrder.assignedTeam}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Est. Duration</span>
                    <span className="font-bold text-slate-200">{workOrder.estimatedDuration}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Safety Warnings Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>MANDATORY SAFETY WARNING</span>
            </div>
            <p className="text-xs leading-relaxed pl-6">
              {workOrder.safetyWarning}
            </p>
          </div>

          {/* Required Materials & Stock Check */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Required Tools & Material Inventory</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workOrder.requiredMaterials && workOrder.requiredMaterials.map((mat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-200 font-medium">{mat}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                    In Stock
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technician Interactive Checklist */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Field Technician Task Execution Checklist</span>
              </h2>
              <span className="text-xs text-slate-400">
                {checklist.filter(c => c.completed).length} / {checklist.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    item.completed 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 line-through opacity-80' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-xs font-medium">{item.text}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col wide): Timeline & After Repair Proof */}
        <div className="space-y-6">
          
          {/* Closed-Loop Verification Result (If present) */}
          {workOrder.verification && (
            <div className="glass-panel p-5 rounded-2xl border-emerald-500/40 bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> AI Verification Verdict
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {workOrder.verification.repairStatus}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                "{workOrder.verification.reason}"
              </p>
              {workOrder.afterImage && (
                <div className="h-36 rounded-xl overflow-hidden border border-emerald-500/30">
                  <img src={workOrder.afterImage} alt="After repair proof" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* AI Decision Timeline */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>AI Decision Timeline Audit</span>
            </h2>

            <DecisionTimeline timeline={workOrder.timeline} />
          </div>

        </div>

      </div>

    </div>
  );
}
