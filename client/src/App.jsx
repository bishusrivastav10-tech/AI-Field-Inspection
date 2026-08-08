import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NewInspection from './components/NewInspection';
import WorkOrderDetail from './components/WorkOrderDetail';
import RepairVerification from './components/RepairVerification';
import AIAnalysisModal from './components/AIAnalysisModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedWoId, setSelectedWoId] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSelectWorkOrder = (idOrWo) => {
    if (typeof idOrWo === 'object' && idOrWo !== null) {
      setSelectedWorkOrder(idOrWo);
      setSelectedWoId(idOrWo.id);
    } else {
      setSelectedWoId(idOrWo);
    }
    setCurrentTab('work-order-detail');
  };

  const handleVerifyRepair = (id) => {
    setSelectedWoId(id);
    setCurrentTab('verification');
  };

  const handleStartAnalysisModal = () => {
    setAnalysisResult(null);
    setModalOpen(true);
  };

  const handleInspectionCreated = (result) => {
    setAnalysisResult(result);
    if (result && result.workOrder) {
      setSelectedWorkOrder(result.workOrder);
      setSelectedWoId(result.workOrder.id);
    }
  };

  const handleViewWorkOrderFromModal = (id) => {
    setModalOpen(false);
    if (id && (!selectedWoId || selectedWoId !== id)) {
      setSelectedWoId(id);
    }
    setCurrentTab('work-order-detail');
  };

  const handleViewDashboardFromModal = () => {
    setModalOpen(false);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setSelectedWoId(null);
          setSelectedWorkOrder(null);
          setCurrentTab(tab);
        }} 
        onNewInspection={() => {
          setSelectedWoId(null);
          setSelectedWorkOrder(null);
          setCurrentTab('new-inspection');
        }}
      />

      {/* Main App Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {currentTab === 'dashboard' && (
          <Dashboard 
            onSelectWorkOrder={handleSelectWorkOrder}
            onNewInspection={() => setCurrentTab('new-inspection')}
            onVerifyRepair={handleVerifyRepair}
          />
        )}

        {currentTab === 'new-inspection' && (
          <NewInspection 
            onStartAnalysisModal={handleStartAnalysisModal}
            onInspectionCreated={handleInspectionCreated}
          />
        )}

        {currentTab === 'work-orders' && (
          <Dashboard 
            onSelectWorkOrder={handleSelectWorkOrder}
            onNewInspection={() => setCurrentTab('new-inspection')}
            onVerifyRepair={handleVerifyRepair}
          />
        )}

        {currentTab === 'work-order-detail' && (
          <WorkOrderDetail 
            workOrderId={selectedWoId}
            initialWorkOrder={selectedWorkOrder}
            onBack={() => setCurrentTab('dashboard')}
            onVerifyRepair={handleVerifyRepair}
          />
        )}

        {currentTab === 'verification' && (
          <RepairVerification 
            preselectedWoId={selectedWoId}
            onVerificationCompleted={() => setCurrentTab('dashboard')}
          />
        )}

      </main>

      {/* AI Processing & Analysis Popup Modal */}
      <AIAnalysisModal 
        isOpen={modalOpen}
        result={analysisResult}
        onClose={() => setModalOpen(false)}
        onViewWorkOrder={handleViewWorkOrderFromModal}
        onViewDashboard={handleViewDashboardFromModal}
      />

      {/* Modern Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">AFO QuickFix</span>
            <span>— Visual Evidence to Action Orchestrator</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400">Gemini Vision AI Engine</span>
            <span>•</span>
            <span className="hover:text-slate-400">Deterministic Decision Engine</span>
            <span>•</span>
            <span className="hover:text-slate-400">Closed-Loop Repair Verification</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
