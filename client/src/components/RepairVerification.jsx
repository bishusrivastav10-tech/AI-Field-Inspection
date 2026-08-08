import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Upload, 
  Camera, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  X, 
  FileText,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchWorkOrders, fetchWorkOrderById, verifyRepair } from '../utils/api';

export default function RepairVerification({ preselectedWoId, onVerificationCompleted }) {
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWoId, setSelectedWoId] = useState(preselectedWoId || '');
  const [workOrder, setWorkOrder] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchWorkOrders().then(res => {
      if (res.workOrders) {
        setWorkOrders(res.workOrders);
        if (!selectedWoId && res.workOrders.length > 0) {
          setSelectedWoId(res.workOrders[0].id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (selectedWoId) {
      fetchWorkOrderById(selectedWoId).then(res => {
        if (res.workOrder) {
          setWorkOrder(res.workOrder);
          setVerificationResult(res.workOrder.verification || null);
          setAfterPreview(res.workOrder.afterImage || null);
        }
      }).catch(err => console.error(err));
    }
  }, [selectedWoId]);

  const handleSelectSampleAfter = (type) => {
    let imgPath = '/uploads/sample_electrical_repaired.jpg';
    if (type === 'leak') {
      imgPath = '/uploads/sample_leak.jpg'; // or repaired leak image
    }
    setAfterPreview(imgPath);
    setAfterFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleRunVerification = async (e) => {
    e.preventDefault();
    if (!selectedWoId) {
      alert("Please select a work order to verify.");
      return;
    }
    if (!afterPreview && !afterFile) {
      alert("Please upload an after-repair proof photograph.");
      return;
    }

    setVerifying(true);
    try {
      const formData = new FormData();
      if (afterFile) {
        formData.append('afterImage', afterFile);
      }

      const res = await verifyRepair(selectedWoId, formData);
      setVerificationResult(res.verification);
      setWorkOrder(res.workOrder);

      // Trigger confetti celebration if Passed!
      if ((res.verification.repairStatus || '').toLowerCase() === 'passed') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

    } catch (err) {
      alert("Error verifying repair: " + err.message);
    } fontFinally: {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Closed-Loop Quality Control</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Repair Verification & Proof of Fix
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload an after-repair photo. The Gemini Vision AI model will compare before & after evidence to confirm defect resolution and close the work order automatically.
        </p>
      </div>

      {/* Select Work Order Dropdown */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Select Active Work Order to Verify:
          </label>
          <select
            value={selectedWoId}
            onChange={(e) => setSelectedWoId(e.target.value)}
            className="mt-1.5 bg-slate-900 border border-slate-700 text-sm font-bold text-cyan-400 rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
          >
            {workOrders.map((wo) => (
              <option key={wo.id} value={wo.id}>
                {wo.id} — {wo.issueType} ({wo.location}) [{wo.status}]
              </option>
            ))}
          </select>
        </div>

        {workOrder && (
          <div className="text-xs text-right">
            <span className="text-slate-400 block">Assigned Team:</span>
            <span className="font-bold text-white text-sm">{workOrder.assignedTeam}</span>
          </div>
        )}
      </div>

      {/* Side-by-side Visual Comparison Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Box: BEFORE REPAIR */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> BEFORE REPAIR (INITIAL DAMAGE)
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-900 text-slate-400">
              {workOrder?.id || 'WO-1042'}
            </span>
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            {workOrder ? (
              <img 
                src={workOrder.beforeImage} 
                alt="Before repair" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/uploads/sample_leak.jpg'; }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Select a Work Order
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-950/80 rounded-lg text-[11px] font-mono text-slate-300">
              ISSUE: {workOrder?.issueType || 'Water Leakage'}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold block mb-0.5">Original AI Evidence:</span>
            "{workOrder?.evidence || 'Visible defect on asset'}"
          </div>
        </div>

        {/* Right Box: AFTER REPAIR */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> AFTER REPAIR (TECHNICIAN PROOF)
            </span>
            <span className="text-xs text-slate-400">Upload Proof</span>
          </div>

          {/* Quick Demo Sample After Selector */}
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">⚡ Sample After Photos:</span>
            <button
              type="button"
              onClick={() => handleSelectSampleAfter('electrical')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700"
            >
              Repaired Panel Proof
            </button>
          </div>

          {/* Upload Dropzone for After Image */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-52 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${
              afterPreview 
                ? 'border-emerald-500/50 bg-emerald-950/20' 
                : 'border-slate-800 hover:border-emerald-500/40 bg-slate-900/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {afterPreview ? (
              <div className="relative w-full h-full group">
                <img 
                  src={afterPreview} 
                  alt="After repair preview" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.target.src = '/uploads/sample_electrical_repaired.jpg'; }}
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700">
                    Change After Photo
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 p-4">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-200">
                  Upload or Capture After-Repair Photo
                </p>
                <p className="text-[10px] text-slate-400">
                  Mobile camera or file upload supported
                </p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleRunVerification}
            disabled={verifying}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? 'Running AI Verification Comparison...' : 'Compare Images & Verify Fix'}</span>
          </button>

        </div>

      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div className={`glass-panel p-6 rounded-2xl border-2 space-y-4 ${
          (verificationResult.repairStatus || '').toLowerCase() === 'passed'
            ? 'border-emerald-500/60 bg-emerald-950/30'
            : 'border-rose-500/60 bg-rose-950/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${
                (verificationResult.repairStatus || '').toLowerCase() === 'passed'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>AI Verification Result:</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                    (verificationResult.repairStatus || '').toLowerCase() === 'passed'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}>
                    {verificationResult.repairStatus}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Confidence Metric: <strong className="text-cyan-400">{verificationResult.confidence || 96}%</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              AI Vision Comparative Analysis:
            </span>
            <p className="text-xs text-slate-100 leading-relaxed">
              "{verificationResult.reason}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-400">Recommended Next Action:</span>
            <span className="font-bold text-emerald-400 uppercase">{verificationResult.next_action || 'Close Work Order'}</span>
          </div>
        </div>
      )}

    </div>
  );
}
