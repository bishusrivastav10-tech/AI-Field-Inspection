import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Search, 
  PlusCircle, 
  ShieldAlert, 
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { fetchWorkOrders, fetchStats } from '../utils/api';

export default function Dashboard({ onSelectWorkOrder, onNewInspection, onVerifyRepair }) {
  const [workOrders, setWorkOrders] = useState([]);
  const [stats, setStats] = useState({
    totalWorkOrders: 0,
    urgentCount: 0,
    pendingCount: 0,
    closedCount: 0,
    aiAccuracyRate: '96.4%',
    avgResolutionTime: '42 mins'
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [woRes, statsRes] = await Promise.all([
        fetchWorkOrders({ status: statusFilter, priority: priorityFilter, search: searchQuery }),
        fetchStats()
      ]);
      setWorkOrders(woRes.workOrders || []);
      if (statsRes.stats) setStats(statsRes.stats);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter, searchQuery]);

  const getPriorityBadge = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'emergency':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1 shadow-sm shadow-rose-500/20 animate-pulse"><ShieldAlert className="w-3 h-3"/> Emergency</span>;
      case 'urgent':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Urgent</span>;
      case 'scheduled':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Scheduled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-400 border border-slate-700">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'closed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Closed & Verified</span>;
      case 'in progress':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center gap-1"><Clock className="w-3 h-3"/> In Progress</span>;
      case 'reassigned':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Rework Required</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">Created</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner / Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Field Operations Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time visual defect triage, automated work orders, and AI repair verification.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-all active:scale-95"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onNewInspection}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Inspection</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Work Orders</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-extrabold text-white">{stats.totalWorkOrders}</span>
            <span className="ml-2 text-xs font-medium text-slate-400">active records</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-400 flex items-center gap-1">
            <span>⚡ Automated Creation</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Urgent / Emergency</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-extrabold text-rose-400">{stats.urgentCount}</span>
            <span className="ml-2 text-xs font-medium text-slate-400">high priority</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-400/90 font-medium">
            Strict SLA &lt; 4 Hours
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Action</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-extrabold text-amber-400">{stats.pendingCount}</span>
            <span className="ml-2 text-xs font-medium text-slate-400">in dispatch</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400/90 font-medium">
            Avg Resolution: {stats.avgResolutionTime}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Verified & Closed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-3xl font-extrabold text-emerald-400">{stats.closedCount}</span>
            <span className="ml-2 text-xs font-medium text-slate-400">completed</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span>Accuracy Rate: {stats.aiAccuracyRate}</span>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search WO ID, issue, team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-1 hidden sm:block" />
            {['All', 'In Progress', 'Scheduled', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Work Orders List / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Work Orders</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-normal">
              {workOrders.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-r-transparent"></div>
            <p className="text-sm text-slate-400">Querying work orders database...</p>
          </div>
        ) : workOrders.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3 border-dashed border-slate-800">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-300">No Work Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching work orders were found. Submit a new field photo inspection to generate one automatically.
            </p>
            <button
              onClick={onNewInspection}
              className="mt-2 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start New Inspection</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workOrders.map((wo) => (
              <div 
                key={wo.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image Preview & Bounding Box */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden border-b border-slate-800">
                    <img 
                      src={wo.beforeImage} 
                      alt={wo.issueType}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/uploads/sample_leak.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Top Badges overlay */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-950/80 text-cyan-400 border border-slate-700/80 backdrop-blur-md">
                        {wo.id}
                      </span>
                      {getPriorityBadge(wo.priority)}
                    </div>

                    {/* Bottom Issue Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        {wo.assignedTeam}
                      </div>
                      <div className="text-base font-bold text-white tracking-tight line-clamp-1">
                        {wo.issueType}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 truncate max-w-[180px]">📍 {wo.location}</span>
                      {getStatusBadge(wo.status)}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                      "{wo.evidence}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Conf: <strong className="text-cyan-400">{wo.confidence}%</strong></span>
                      <span>Est: <strong className="text-slate-200">{wo.estimatedDuration}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onSelectWorkOrder(wo.id)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                  >
                    <span>Details & Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {wo.status !== 'Closed' && (
                    <button
                      onClick={() => onVerifyRepair(wo.id)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Fix</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
