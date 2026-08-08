import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  FileText, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { submitInspection } from '../utils/api';

export default function NewInspection({ onInspectionCreated, onStartAnalysisModal }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [location, setLocation] = useState('Building B, Basement Pipe Line');
  const [description, setDescription] = useState('Water dripping from pipe connector flange near electrical panel');
  const [submitting, setSubmitting] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const fileInputRef = useRef(null);

  // Preset location quick selectors
  const presetLocations = [
    'Building B, Basement Pipe Line',
    'East Wing Exterior Wall, 3rd Floor',
    'Electrical Room 4, Substation B',
    'HVAC Roof Deck, Unit 2'
  ];

  // Quick demo sample photo presets
  const handleSelectSample = (sampleType) => {
    let sampleImgPath = '/uploads/sample_leak.jpg';
    let sampleLoc = 'Building B, Basement Pipe Line';
    let sampleDesc = 'Pressurized fluid dripping near flange joint';

    if (sampleType === 'crack') {
      sampleImgPath = '/uploads/sample_crack.jpg';
      sampleLoc = 'East Wing Exterior Wall, 3rd Floor';
      sampleDesc = 'Diagonal structural masonry crack along load-bearing wall';
    } else if (sampleType === 'electrical') {
      sampleImgPath = '/uploads/sample_electrical.jpg';
      sampleLoc = 'Electrical Room 4, Substation B';
      sampleDesc = 'Singed 240V wire terminal with carbon charring near breaker';
    }

    setPreviewUrl(sampleImgPath);
    setLocation(sampleLoc);
    setDescription(sampleDesc);
    setSelectedFile(null); // Will use sample image on backend
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewUrl && !selectedFile) {
      alert("Please upload or select an asset photo to analyze.");
      return;
    }

    setSubmitting(true);
    onStartAnalysisModal();

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      if (previewUrl) {
        formData.append('imageDataUrl', previewUrl);
      }
      formData.append('location', location);
      formData.append('description', description);

      const result = await submitInspection(formData);
      
      // Delay slightly so user can enjoy the AI scanner animation
      setTimeout(() => {
        setSubmitting(false);
        onInspectionCreated(result);
      }, 2500);

    } catch (err) {
      setSubmitting(false);
      alert("Error submitting inspection: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Vision Triage</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Field Asset Inspection & Damage Capture
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Upload or capture a photo of a damaged equipment or facility component. AFO QuickFix AI will analyze defects, determine severity, and trigger an automated work order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Upload or Capture Image */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>1. Field Photograph Evidence</span>
            </label>
            <span className="text-xs text-slate-400">Mobile Camera & Upload Supported</span>
          </div>

          {/* Preset Sample Selector for Fast Demos */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              ⚡ Quick Demo Sample Photos:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectSample('leak')}
                className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all"
              >
                <span>💧 Water Leak</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('crack')}
                className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all"
              >
                <span>🧱 Wall Crack</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('electrical')}
                className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all"
              >
                <span>⚡ Electrical Fault</span>
              </button>
            </div>
          </div>

          {/* Image Upload Box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              previewUrl 
                ? 'border-cyan-500/50 bg-cyan-950/20' 
                : 'border-slate-800 hover:border-cyan-500/40 bg-slate-900/40 hover:bg-slate-900/80'
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

            {previewUrl ? (
              <div className="relative max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700 group">
                <img 
                  src={previewUrl} 
                  alt="Asset Preview" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700">
                    Click to change photo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/90 text-rose-400 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload or take a photo with camera
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP up to 15MB
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Step 2: Location and Description */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>2. Asset Location & Field Context</span>
          </label>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">Asset Location Tag</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Building B, Basement Pipe Line"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            
            {/* Quick Location Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 self-center">Presets:</span>
              {presetLocations.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-all"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Technician / Reporter Notes (Optional)</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any visible details, leak rate, or safety context..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>Analyze Asset & Generate Work Order</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>

      </form>

    </div>
  );
}
