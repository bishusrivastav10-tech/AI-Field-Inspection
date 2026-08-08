# 🛠️ AFO QuickFix — AI Field Maintenance Assistant

**AFO QuickFix** is an AI-powered field-operations platform that transforms field photographs into actionable, trackable, and verifiable work orders using multimodal vision AI and a deterministic decision engine.

![AFO QuickFix Architecture](https://img.shields.io/badge/Architecture-Multimodal%20AI%20%2B%20Decision%20Engine-cyan)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Node.js%20%7C%20Express%20%7C%20Gemini%20Vision-blue)

---

## ⚡ Key Features

- **📷 Field Image Capture**: Upload photographic evidence or capture asset photos directly using mobile cameras.
- **🧠 Multimodal AI Vision Analysis**: Powered by Google Gemini Vision API to detect defects (water leaks, structural cracks, exposed electrical wiring, HVAC duct disconnects) with confidence scoring and physical evidence quotes.
- **⚙️ Deterministic Decision Engine**: Classifies priority levels (`Emergency`, `Urgent`, `Scheduled`, `Low`), response SLA windows, maintenance team assignments, mandatory safety cautions, and required toolsets.
- **📋 Automated Work-Order Generation**: Auto-dispatches structured work orders (`AFO-xxxx`) with chronological **AI Decision Timeline** audit logs.
- **✅ Closed-Loop Repair Verification**: Compares before & after repair photos with vision AI to automatically close work orders upon resolution confirmation.

---

## 🚀 Quick Start (Running Locally)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/afo-quickfix.git
cd afo-quickfix
```

### 2. Install dependencies
```bash
# Install root, server, and client dependencies
npm run install:all
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
cp server/.env.example server/.env
```
*(Optional: Add your Google Gemini API Key in `server/.env` to enable live multimodal vision API).*

### 4. Run the application
```bash
# Terminal 1: Start Backend Express Server (Port 5000)
npm run server

# Terminal 2: Start Frontend React Client (Port 3000)
npm run client
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Project Architecture

```text
Field Asset Photo
       │
       ▼
Multimodal Vision AI (Gemini 2.5 Flash)
       │
       ▼
Deterministic Decision Engine (Priority & Team Assignment)
       │
       ▼
Work Order Dispatched (AFO-xxxx & Timeline Audit Log)
       │
       ▼
Technician Repair & Proof Upload
       │
       ▼
AI Repair Verification ──(Passed)──► Auto-Close & Archive
```
