/**
 * Deterministic Decision Engine for AFO QuickFix
 * Converts AI vision analysis metrics into operational actions, priorities, team assignments, and safety requirements.
 */

export function executeDecisionEngine(aiResult, location) {
  const { issue_type, severity, evidence } = aiResult;
  const issueLower = (issue_type || '').toLowerCase();
  const severityLower = (severity || '').toLowerCase();

  let priority = "Medium";
  let assignedTeam = "General Maintenance";
  let slaWindow = "Within 24 hours";
  let requiredMaterials = [];
  let safetyWarning = "Ensure standard PPE (gloves, hardhat, safety glasses) is worn.";
  let estimatedDuration = "60 minutes";

  // Priority classification based on deterministic rules
  if (severityLower.includes("critical") || severityLower.includes("extreme") || issueLower.includes("electrical") || issueLower.includes("fire")) {
    priority = "Emergency";
    slaWindow = "Immediate (Within 1 Hour)";
  } else if (severityLower.includes("high") || severityLower.includes("severe") || issueLower.includes("leak") || issueLower.includes("burst")) {
    priority = "Urgent";
    slaWindow = "Within 4 hours";
  } else if (severityLower.includes("medium") || severityLower.includes("moderate")) {
    priority = "Scheduled";
    slaWindow = "Within 24 hours";
  } else {
    priority = "Low";
    slaWindow = "Next maintenance cycle";
  }

  // Team assignment and specialized equipment recommendations
  if (issueLower.includes("water") || issueLower.includes("leak") || issueLower.includes("pipe") || issueLower.includes("plumb")) {
    assignedTeam = "Plumbing Operations";
    requiredMaterials = ["Industrial Pipe Sealant", "Replacement Coupling Flange", "Rubber Gasket Set", "Pipe Wrench & Pressure Gauge"];
    safetyWarning = "Keep all portable electrical tools and live electrical cables away from standing water.";
    estimatedDuration = "45 minutes";
  } else if (issueLower.includes("electric") || issueLower.includes("wire") || issueLower.includes("panel") || issueLower.includes("breaker") || issueLower.includes("short")) {
    assignedTeam = "Electrical & Safety Team";
    requiredMaterials = ["Insulated Multi-meter", "Replacement Circuit Breaker", "Heat Shrink Tubing", "Arc Flash PPE Kit"];
    safetyWarning = "CRITICAL: Lockout-Tagout (LOTO) protocol mandatory. Verify zero voltage prior to panel contact.";
    estimatedDuration = "60 minutes";
    if (priority !== "Emergency") priority = "Urgent";
  } else if (issueLower.includes("crack") || issueLower.includes("wall") || issueLower.includes("concrete") || issueLower.includes("structural") || issueLower.includes("foundation")) {
    assignedTeam = "Structural Maintenance";
    requiredMaterials = ["Structural Epoxy Grout", "Crack Injection Ports", "Concrete Moisture Meter", "Laser Level"];
    safetyWarning = "Inspect overhead structures for loose debris before standing directly under damaged masonry.";
    estimatedDuration = "120 minutes";
  } else if (issueLower.includes("hvac") || issueLower.includes("duct") || issueLower.includes("compressor") || issueLower.includes("cool") || issueLower.includes("vent")) {
    assignedTeam = "HVAC Systems Team";
    requiredMaterials = ["Refrigerant Pressure Gauges", "Replacement Air Filter", "Coil Cleaner Solution", "Thermal Camera"];
    safetyWarning = "Ensure proper ventilation when testing pressurized refrigerant lines.";
    estimatedDuration = "90 minutes";
  } else if (issueLower.includes("rust") || issueLower.includes("corrosion") || issueLower.includes("metal") || issueLower.includes("gate") || issueLower.includes("hinge")) {
    assignedTeam = "Asset Rehabilitation Team";
    requiredMaterials = ["Rust Converter Spray", "Wire Brush Attachment", "Anti-Corrosive Primer", "Industrial Touch-up Paint"];
    safetyWarning = "Wear eye protection and N95 respirator when grinding or brushing corroded metal surfaces.";
    estimatedDuration = "40 minutes";
  } else {
    assignedTeam = "General Facilities Team";
    requiredMaterials = ["General Maintenance Tool Set", "Heavy Duty Cleaning Solvents", "Utility Repair Tape"];
    safetyWarning = "Maintain standard personal protective equipment (PPE) during operation.";
    estimatedDuration = "30 minutes";
  }

  // Location based escalations
  if (location && (location.toLowerCase().includes("basement") || location.toLowerCase().includes("server") || location.toLowerCase().includes("power"))) {
    if (priority === "Scheduled") priority = "Urgent";
  }

  return {
    priority,
    assignedTeam,
    slaWindow,
    requiredMaterials,
    safetyWarning,
    estimatedDuration
  };
}
