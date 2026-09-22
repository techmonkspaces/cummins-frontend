# Cummins PPWR • Packaging Consumption & Data Capture Platform

> **Frontend Demo Specification & Implementation**  
> *Frontend-only MVP • Realistic Mock Data • Three Packaging Recording Methodologies • IntegrityNext & EU PPWR Ready*

---

## 📌 1. Objective & Overview

This application is an industrial frontend demo for spare-parts & tools manufacturing operations (**Cummins context**). It records, calculates, and standardizes packaging materials used across batches and individual products to capture regulatory **EU Packaging and Packaging Waste Regulation (PPWR 2024/0000)** compliance data.

### Key Highlights:
- **Clean Service Boundaries**: Isolate Product API, Packaging Inventory API, and Packaging Calculation/Rules Engine for plug-and-play backend/ERP integration.
- **Three Recording Methodologies**: Harmonize batch inventory deduction, rule-engine top-down estimation, and floor operator logging into one common data schema.
- **Unified Summary & Audit Ledger**: Standardized Bill-of-Materials (BOM) review with real-time PPWR material fraction breakdown (Corrugated, Plastics, Recycled content %, CO₂e).
- **IntegrityNext Ready**: One-click JSON export schema formatted for enterprise sustainability & supplier compliance workflows.
- **Built-in Guided Demo Story**: 8-step interactive evaluator banner at the top of the interface.

---

## 🔄 2. Core Product Flow

$$\text{Product Selection} \longrightarrow \text{Choose Recording Method} \longrightarrow \text{Enter / Calculate Packaging} \longrightarrow \text{Common Packaging Summary Review} \longrightarrow \text{Confirm Record} \longrightarrow \text{Audit Ledger \& Export}$$

---

## ⚙️ 3. The Three Required Packaging Recording Approaches

| Approach | Name | Operational Context | Example Calculation / Scenario |
| :--- | :--- | :--- | :--- |
| **Approach A** | **Inventory / Consumption Based** | Used when the business tracks material stock deductions from inventory over an accounting period and knows the volume of packed products. | **1,000 Gear Assemblies** packed with **500 kg Cardboard**, **80 kg Cushioning**, **20 kg Tape** consumed.<br>$\rightarrow 500\text{ kg} \div 1,000 = \mathbf{0.500\text{ kg/unit}}$ Cardboard.<br>$\rightarrow \mathbf{0.600\text{ kg/unit}}$ total packaging mass. |
| **Approach B** | **System Calculated (Top-Down)** | Used when product physical geometry (weight, dimensions, volume, fragility) is known and the operator wants the rule engine to recommend an optimal packaging BOM. | **Gear Assembly (8.0 kg)**:<br>• Cardboard Box: 1 pc (450g)<br>• Cushioning: 120 g<br>• Thermocol/EPS: 80 g<br>• Packaging Tape: 25 g<br>*(Fully editable by operator before confirmation)* |
| **Approach C** | **User Input / Floor Operator Log** | Used when floor packaging operators manually log actual materials consumed at the packing bench using physical scales/scanners. | **Dynamic Material Picker**:<br>• Cardboard Box: 1 pc<br>• Cushioning: 100 g<br>• Thermocol/EPS: 60 g<br>• Packaging Tape: 20 g<br>*(Real-time conversion to standardized kg)* |

---

## 📊 4. Common Packaging Record Data Model

Regardless of which approach creates the record, all entries conform to a single unified schema:

```json
{
  "id": "PR-1001",
  "productId": "GA-102",
  "productName": "Gear Assembly",
  "productSku": "GA-102",
  "productQuantity": 100,
  "method": "INVENTORY | CALCULATED | USER_INPUT",
  "materials": [
    {
      "materialId": "MAT-001",
      "materialName": "Cardboard Box",
      "category": "Paper/Cardboard",
      "quantity": 100,
      "unit": "pcs",
      "weight": 45,
      "weightUnit": "kg",
      "weightKg": 45
    }
  ],
  "totalPackagingWeightKg": 67.5,
  "perUnitPackagingWeightKg": 0.675,
  "status": "DRAFT | CONFIRMED",
  "period": "2026-W38 (Sep 15 - Sep 21)",
  "createdAt": "2026-09-22",
  "confirmedAt": "2026-09-22",
  "ppwrSummary": {
    "paperCardboardKg": 57.0,
    "paperCardboardPct": 84.4,
    "plasticKg": 10.5,
    "plasticPct": 15.6,
    "otherKg": 0,
    "otherPct": 0,
    "avgRecyclablePct": 94.2,
    "estimatedCo2eKg": 58.4
  }
}
```

---

## 🗂️ 5. Mock Master Data

### Mock Products (`src/data/mockData.ts`)
- **GA-102**: Gear Assembly (8.0 kg, $30 \times 20 \times 15\text{ cm}$, Powertrain) — *Primary Demo Hero SKU*
- **BP-201**: Brake Assembly (5.5 kg, $25 \times 18 \times 12\text{ cm}$, Chassis)
- **VL-310**: Industrial Valve (12.0 kg, $35 \times 25 \times 20\text{ cm}$, Controls)
- **SP-415**: Spare Part Kit (3.0 kg, $20 \times 15 \times 10\text{ cm}$, Maintenance)
- **TC-550**: Turbocharger Cartridge (6.8 kg, $28 \times 22 \times 18\text{ cm}$, Exhaust)
- **IN-108**: Heavy Duty Fuel Injector (1.4 kg, $15 \times 10 \times 8\text{ cm}$, Fuel Systems)

### Mock Packaging Inventory Master
- **Cardboard Box** (`PAP-20`, Paper/Cardboard, 2,500 pcs)
- **Corrugated Cardboard** (`PAP-21`, Paper/Cardboard, 800 kg)
- **Cushioning** (`PAP-22`, Paper, 350 kg)
- **Thermocol / EPS** (`PS-06`, Plastic, 180 kg)
- **Bubble Wrap** (`LDPE-04`, Plastic, 120 kg)
- **Plastic Bag** (`HDPE-02`, Plastic, 500 kg)
- **Packaging Tape** (`BOPP-05`, Plastic, 90 kg)
- **Foam Sheet** (`EPE-04`, Plastic, 100 kg)
- **Stretch Film** (`LLDPE-04`, Plastic, 150 kg)

---

## 🚀 6. Getting Started & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (runs on port 3000)
npm run dev

# 3. Build for production distribution
npm run build

# 4. Preview the production build
npm run preview
```

Open `http://localhost:3000/` in your browser.

---

## 🧭 7. 8-Step Evaluator Demo Story Walkthrough

The application includes an interactive top navigation guide to demonstrate the system end-to-end:

1. **Step 1 — Select Product**: Browse the product catalog and select `GA-102 Gear Assembly`.
2. **Step 2 — Choose Method**: Compare Approach A, Approach B, and Approach C on dedicated cards.
3. **Step 3 — Inventory Method (A)**: Observe batch deduction ($500\text{ kg} \div 1,000 = 0.500\text{ kg/unit}$).
4. **Step 4 — Calculated Method (B)**: Inspect the rule engine's automated BOM recommendations and edit line items.
5. **Step 5 — User Input Method (C)**: Experience floor operator manual entry with dynamic units (`pcs`, `g`, `kg`).
6. **Step 6 — Review Common Summary**: Inspect unified BOM table and PPWR Article 9/11 compliance cards.
7. **Step 7 — Confirm Record**: Commit the record to the compliance ledger.
8. **Step 8 — Audit & Export**: Inspect record provenance and generate the **IntegrityNext JSON payload**.

---

## 🏗️ 8. Project Architecture & Modular Boundaries

```
f:/cummins-ppwr/
├── src/
│   ├── types/
│   │   └── index.ts                 # Clean TypeScript models & schemas
│   ├── data/
│   │   └── mockData.ts              # Mock products, packaging materials & initial records
│   ├── services/
│   │   ├── productService.ts        # Product API boundary (ready for SAP/ERP API)
│   │   ├── inventoryService.ts      # Packaging inventory API boundary (ready for WMS)
│   │   ├── calculationEngine.ts     # Modular Top-Down rule engine
│   │   └── recordsService.ts        # Persistence, PPWR analytics & IntegrityNext JSON export
│   ├── components/
│   │   ├── layout/                  # Header, Navigation, DemoGuideBar
│   │   ├── dashboard/               # KPIs, Method distribution, PPWR fraction graphs
│   │   ├── products/                # Product catalog with filters & recording triggers
│   │   ├── packaging-flow/          # 3 Approach forms & Common PackagingSummary review
│   │   ├── records/                 # Audit ledger, Detail drawer, IntegrityNext export
│   │   └── inventory/               # Packaging master catalog view
│   ├── styles/
│   │   └── index.css                # Cummins Red & slate dark mode design tokens
│   ├── App.tsx                      # Root component orchestration
│   └── main.tsx                     # Entry point
├── docs/
│   ├── ARCHITECTURE.md              # Technical architecture & API integration guide
│   └── DEMO_GUIDE.md                # Presentation script & evaluator talking points
├── package.json
├── tsconfig.json
└── vite.config.ts
```
# cummins-frontend
