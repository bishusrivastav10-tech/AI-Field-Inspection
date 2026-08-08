import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let DATA_DIR = path.join(__dirname, '../data');
let STORE_PATH = path.join(DATA_DIR, 'store.json');
let inMemoryStore = null;

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  DATA_DIR = os.tmpdir();
  STORE_PATH = path.join(DATA_DIR, 'afo_store.json');
}

// Initial pre-seeded work orders and inspections
const initialData = {
  workOrders: [
    {
      id: "AFO-1042",
      inspectionId: "INS-2001",
      location: "Building B, Basement Pipe Line",
      issueType: "Water leakage",
      severity: "High",
      confidence: 94,
      priority: "Urgent",
      status: "In Progress",
      assignedTeam: "Plumbing Operations",
      evidence: "Active water dripping from high-pressure flange joint, rust oxidation visible on copper pipe",
      recommendedAction: "Isolate main valve B-2, apply industrial pipe sealant and replace flange coupling within 4 hours",
      requiredMaterials: ["High-pressure pipe sealant", "1.5-inch Brass Flange Coupling", "Rubber Gaskets", "Pipe Wrench Set"],
      safetyWarning: "Caution: Water accumulation near sub-distribution electrical panel. De-energize nearby breakers before work.",
      estimatedDuration: "45 minutes",
      beforeImage: "/uploads/sample_leak.jpg",
      afterImage: null,
      verification: null,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      timeline: [
        { time: new Date(Date.now() - 3600000 * 2.1).toISOString(), text: "Field inspection photograph captured at Building B Basement" },
        { time: new Date(Date.now() - 3600000 * 2.0).toISOString(), text: "Gemini AI identified 'Water leakage' with 94% confidence" },
        { time: new Date(Date.now() - 3600000 * 2.0).toISOString(), text: "Decision Engine assigned Priority: URGENT (4h SLA SLA Window)" },
        { time: new Date(Date.now() - 3600000 * 2.0).toISOString(), text: "Work Order AFO-1042 dispatched to Plumbing Operations team" },
        { time: new Date(Date.now() - 3600000 * 1.5).toISOString(), text: "Technician Marcus Vance acknowledged task and initiated checklist" }
      ]
    },
    {
      id: "AFO-1041",
      inspectionId: "INS-2000",
      location: "East Wing exterior facade, 3rd Floor",
      issueType: "Wall cracking & concrete spalling",
      severity: "Medium",
      confidence: 88,
      priority: "Scheduled",
      status: "Inspection Scheduled",
      assignedTeam: "Structural Engineering",
      evidence: "Diagonal stress crack along load-bearing masonry header, depth ~4mm",
      recommendedAction: "Perform structural integrity laser mapping, inject epoxy structural grout",
      requiredMaterials: ["Structural Epoxy Resin", "Injection Ports", "Masonry Sealant"],
      safetyWarning: "Use fall protection harness when inspecting external elevation above 2nd floor",
      estimatedDuration: "120 minutes",
      beforeImage: "/uploads/sample_crack.jpg",
      afterImage: null,
      verification: null,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      timeline: [
        { time: new Date(Date.now() - 3600000 * 18.1).toISOString(), text: "Field image submitted by Facilities Supervisor" },
        { time: new Date(Date.now() - 3600000 * 18.0).toISOString(), text: "AI identified structural masonry stress crack (88% confidence)" },
        { time: new Date(Date.now() - 3600000 * 18.0).toISOString(), text: "Work Order AFO-1041 scheduled for Structural Engineering review" }
      ]
    },
    {
      id: "AFO-1039",
      inspectionId: "INS-1998",
      location: "Electrical Room 4, Ground Floor",
      issueType: "Exposed wire thermal oxidation",
      severity: "Critical",
      confidence: 96,
      priority: "Emergency",
      status: "Closed",
      assignedTeam: "High-Voltage Electrical Response",
      evidence: "Singed wire insulation and carbon residue around 40A circuit breaker terminal",
      recommendedAction: "Shutdown main breaker, replace melted wire leads and inspect contact terminals",
      requiredMaterials: ["40A Dual Pole Breaker", "THHN 8AWG Copper Wire", "Electrical Insulation Tape", "Thermal Imaging Scanner"],
      safetyWarning: "CRITICAL: High Voltage Arc Flash Hazard. Lockout-Tagout (LOTO) protocol mandatory before panel cover removal.",
      estimatedDuration: "60 minutes",
      beforeImage: "/uploads/sample_electrical.jpg",
      afterImage: "/uploads/sample_electrical_repaired.jpg",
      verification: {
        repairStatus: "Passed",
        reason: "After-repair visual evidence shows clean wire terminations, new 40A breaker installed, no carbon scoring present.",
        verifiedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        confidence: 97
      },
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      timeline: [
        { time: new Date(Date.now() - 3600000 * 24.0).toISOString(), text: "Emergency image capture: Damaged Electrical Panel" },
        { time: new Date(Date.now() - 3600000 * 23.9).toISOString(), text: "AI detected Critical Arc Flash Hazard (96% confidence)" },
        { time: new Date(Date.now() - 3600000 * 23.9).toISOString(), text: "Decision Engine triggered Immediate Supervisor Escalation" },
        { time: new Date(Date.now() - 3600000 * 20.0).toISOString(), text: "Technician Elena Rostova completed electrical repair" },
        { time: new Date(Date.now() - 3600000 * 5.0).toISOString(), text: "After-repair photo verified by AI Vision Model (Status: Passed)" },
        { time: new Date(Date.now() - 3600000 * 5.0).toISOString(), text: "Work Order AFO-1039 automatically closed & archived" }
      ]
    }
  ]
};

export function getStore() {
  if (inMemoryStore) return inMemoryStore;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      inMemoryStore = JSON.parse(raw);
      return inMemoryStore;
    }
  } catch (err) {
    console.warn("Error reading store.json, using initial data:", err.message);
  }
  inMemoryStore = JSON.parse(JSON.stringify(initialData));
  return inMemoryStore;
}

export function saveStore(data) {
  inMemoryStore = data;
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Handle EROFS on Vercel read-only serverless filesystem
    try {
      const tmpPath = path.join(os.tmpdir(), 'afo_store.json');
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (tmpErr) {
      console.warn("Serverless in-memory store active:", tmpErr.message);
    }
  }
}

export function getAllWorkOrders() {
  const store = getStore();
  return store.workOrders || [];
}

export function getWorkOrderById(id) {
  const workOrders = getAllWorkOrders();
  return workOrders.find(wo => wo.id === id);
}

export function createWorkOrder(workOrder) {
  const store = getStore();
  store.workOrders.unshift(workOrder);
  saveStore(store);
  return workOrder;
}

export function updateWorkOrder(id, updates) {
  const store = getStore();
  const index = store.workOrders.findIndex(wo => wo.id === id);
  if (index === -1) return null;

  store.workOrders[index] = {
    ...store.workOrders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveStore(store);
  return store.workOrders[index];
}

export function addTimelineEvent(id, text) {
  const store = getStore();
  const index = store.workOrders.findIndex(wo => wo.id === id);
  if (index !== -1) {
    if (!store.workOrders[index].timeline) store.workOrders[index].timeline = [];
    store.workOrders[index].timeline.push({
      time: new Date().toISOString(),
      text
    });
    saveStore(store);
  }
}
