# Cummins Packaging Tracking & PPWR Compliance Platform
## Complete Project Understanding, Architecture & Workflow Documentation

---

## 📌 1. Executive Summary & Project Purpose

### Background:
**Cummins Inc.** operates numerous manufacturing plants, assembly facilities, and distribution hubs across the globe (e.g., Pune Engine Plant, Phaltan Megasite, Jamshedpur Heavy Duty Plant, Columbus CMEP, Daventry UK, etc.). In these plants, thousands of heavy powertrain components and spare parts (such as Gear Assemblies, Fuel Injectors, Cylinder Heads, Turbochargers, Control Valves, and Service Kits) are packaged and dispatched daily.

### The Problem:
- Strict global sustainability and regulatory requirements (like **EU PPWR 2024 - Packaging and Packaging Waste Regulation**, CSRD, and Scope 3 Category 1 emissions) mandate precise reporting of every gram of packaging material (cardboard, plastic films, EPS thermocol, wood, metal strapping, adhesive tapes) used.
- Different factories have vastly different operational setups: some are high-speed automated lines, some are advanced automated assembly hubs with CAD/PLM models, and some are manual packing stations for heavy/custom industrial tools.
- A "one-size-fits-all" data capture system fails because floor workers cannot manually weigh tape and plastic on high-speed lines, while automated rule systems cannot predict custom non-standard packaging for one-off heavy repair parts.

### The Solution (This Platform):
A multi-plant **Packaging Consumption & PPWR Compliance Data Capture Tool** that:
1. Ingests finished product/spare-part inventory and packaging material masters.
2. Supports **3 distinct factory-level packaging capture approaches** tailored to each plant's operational reality.
3. Standardizes and computes material mass breakdown (Cardboard %, Plastic %, Recyclability %, CO₂e footprint).
4. Generates an auditable compliance ledger ready for direct export into ESG platforms like **IntegrityNext**.

---

## 🔄 2. Core Data Flow & Inflows

```
  ┌─────────────────────────────────┐        ┌──────────────────────────────────┐
  │  Finished Spare Parts Inventory │        │  Packaging Materials Master      │
  │  • Part SKU & Name              │        │  • Material ID & Category        │
  │  • Net Dimensions (L × W × H)   │        │  • Unit Weight & Stock Unit      │
  │  • Net Part Weight (Kg)         │        │  • Recycled Content % & CO₂/Kg   │
  │  • Fragility / Handling Profile │        │  • PPWR Codes (PAP-20, PS-06)    │
  └────────────────┬────────────────┘        └────────────────┬─────────────────┘
                   │                                          │
                   └───────────────────┬──────────────────────┘
                                       │
                                       ▼
             ┌──────────────────────────────────────────────────┐
             │       Factory Configuration & Plant Mapping      │
             │       • Factory A (Pune)       ➔ Approach A     │
             │       • Factory B (Phaltan)    ➔ Approach B     │
             │       • Factory C (Jamshedpur) ➔ Approach C     │
             └─────────────────────────┬────────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
   ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
   │   APPROACH A    │        │   APPROACH B    │        │   APPROACH C    │
   │  Zero-Input     │        │  Auto-Calculate │        │  Operator Input │
   │  Inventory      │        │  Rule-Engine    │        │  Manual/Station │
   │  Consumption    │        │  Recommendation │        │  Logging        │
   └────────┬────────┘        └────────┬────────┘        └────────┬────────┘
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       │
                                       ▼
             ┌──────────────────────────────────────────────────┐
             │         Unified Common Packaging Summary         │
             │ • Total Packaging Mass (Kg) & Per-Unit Mass (Kg) │
             │ • Material Shares (Paper % vs Plastic % vs Other)│
             │ • Recyclability Rating & Estimated CO₂e Footprint│
             └─────────────────────────┬────────────────────────┘
                                       │
                                       ▼
             ┌──────────────────────────────────────────────────┐
             │    Audit Ledger & IntegrityNext JSON / CSV Export │
             └──────────────────────────────────────────────────┘
```

---

## 🏭 3. Deep-Dive: The 3 Factory Packaging Approaches

Every Cummins factory has a pre-decided default approach configured in the system based on its ERP/MES capabilities and packaging line setup:

| Approach | Name | User Input Required? | Operational Reality / Plant Type | How It Works |
| :--- | :--- | :--- | :--- | :--- |
| **Approach A** | **Inventory / Consumption Based** | ❌ **No User Input** | High-volume automated engine lines (e.g., Pune Kothrud Plant, Daventry UK) | Reads batch/weekly stock deductions from SAP MM and total packed parts; automatically divides total packaging mass by batch quantity. |
| **Approach B** | **System-Calculated (Rule Engine)** | ❌ **Minimal / Review Only** | Advanced assembly campuses with PLM/CAD models (e.g., Phaltan Megasite, Columbus CMEP) | System auto-calculates the optimal packaging recipe (box size, cushioning thickness, thermocol density, tape length) using product physical rules. |
| **Approach C** | **Floor Operator Manual Log** | ✅ **Direct User Input** | Heavy industrial, custom crates & repair tooling lines (e.g., Jamshedpur Heavy Duty) | Operator physically picks items from packaging inventory, enters quantities/weights at touchscreens or via barcode scan. |

---

### Detailed Breakdown of Each Approach:

### 🅰️ Approach A: Inventory / Batch Consumption (Zero User Input)
* **Philosophy**: *"Do not burden operators on high-speed lines to measure meters of tape or individual cardboard sheets."*
* **Input from Systems**:
  - Period / Batch ID (e.g., Week 38 Production).
  - Total Finished Units Packed (e.g., 1,000 Gear Assemblies).
  - Packaging Material Deductions from WMS/SAP MM (e.g., 500 kg Corrugated Cardboard, 80 kg Paper Cushioning, 20 kg Packaging Tape).
* **System Logic**:
  $$\text{Per-Unit Cardboard Mass} = \frac{500\text{ kg}}{1,000\text{ units}} = 0.500\text{ kg/unit}$$
  $$\text{Total Packaging per Unit} = \frac{500 + 80 + 20}{1,000} = 0.600\text{ kg/unit}$$
* **UI Experience**: The screen directly displays the inventory deduction summary, calculated per-unit weights, and material distribution without asking the user for any manual inputs.

---

### 🅱️ Approach B: System Calculated / Rule-Based Engine (Automated Recommendation)
* **Philosophy**: *"Use product CAD/PLM master attributes ($L \times W \times H$, weight, fragility) to auto-compute the mathematically optimal packaging."*
* **Input from Systems**:
  - Selected Product SKU (e.g., `GA-102 Gear Assembly`, 8.0 kg, $30 \times 20 \times 15\text{ cm}$, Medium Fragility).
* **Rule Engine Logic**:
  1. **Box Selection**: Finds the smallest available master carton accommodating part dimensions + safety buffer ($+5\text{ cm}$ clearance).
  2. **Cushioning Calculation**: Calculates void space volume:
     $$\text{Void Volume} = \text{Box Volume} - \text{Product Volume}$$
     Assigns paper/bubble cushioning mass based on fragility index.
  3. **Heavy-Duty / Structural Support**: If part weight $> 5.0\text{ kg}$, automatically adds EPS Thermocol corner blocks or wooden dunnage.
  4. **Seam Tape**: Computes perimeter box seam length ($\approx 2 \times (L + W)$) to estimate tape mass.
* **UI Experience**: Displays rule execution breakdown with visual confidence badges, explanation notes, and a 1-click proceed button (with option to fine-tune if needed).

---

### 🅲️ Approach C: Floor Operator Log (Manual Input & Barcode Pick)
* **Philosophy**: *"Provide flexibility for custom parts, oversized engine blocks, or repair kits where no fixed CAD rule exists."*
* **Input from User**:
  - Operator selects materials from the live master catalog (Cartons, VCI Anti-Rust Bags, Heavy Dunnage, Foam Sheets).
  - Enters quantities in native packaging units (`pcs`, `grams`, `kg`, `meters`).
* **System Logic**:
  - Auto-normalizes mixed units into standardized SI Kilograms ($\text{g} \to \text{kg}$, $\text{pcs} \times \text{weightPerUnit} \to \text{kg}$).
  - Live updates real-time weight shares and compliance indicators as lines are added or removed.
* **UI Experience**: Fast search, category filters, quick quantity increment buttons, and live weight tally cards.

---

## 📊 4. Unified Common Review & Compliance Reporting

Regardless of which approach created the record (A, B, or C), the data flows into a **Single Standardized Packaging Summary**:

1. **Mass Breakdown**:
   - Total Packaging Mass per unit and total batch mass.
   - Percentage share of Fibre/Paper vs Polymers/Plastic vs Metals/Wood.
2. **PPWR Compliance Metrics**:
   - **Recyclability Score (%)**: Design for Recycling (DfR) grade.
   - **Embedded Carbon ($\text{kg CO}_2\text{e}$)**: Scope 3 Category 1 footprint calculation.
   - **EU PPWR Material Classification Codes**: PAP-20, LDPE-04, PS-06, etc.
3. **Audit Ledger & Downstream Export**:
   - Records saved with plant name, operator, method provenance, and timestamps.
   - **IntegrityNext JSON Export**: Ready payload for enterprise ESG compliance reporting.
   - **CSV Export**: For plant logistics and finance reconciliation.

---

## 💻 5. Current Frontend Architecture & Built Features

The current prototype is fully functional with rich mock services:

```
src/
├── types/index.ts            # Type contracts (Product, Plant, Material, PackagingRecord, Persona)
├── data/mockData.ts          # Mock datasets for 5 Global Cummins Plants, 10 SKUs, 12 Packaging Materials
├── services/
│   ├── productService.ts     # Product catalog & SKU search
│   ├── inventoryService.ts   # Packaging master stock & materials
│   ├── plantService.ts       # Multi-plant management & configured method assignments
│   ├── calculationEngine.ts  # Algorithmic rule engine for Approach B
│   ├── recordsService.ts     # Ledger storage (localStorage) & PPWR aggregations
│   └── authService.ts        # Persona switching (Super Admin, Plant Manager, Floor Operator)
└── components/
    ├── layout/               # Header, Cummins Logo, Persona Switcher, Step-by-Step Demo Bar
    ├── dashboard/            # Executive KPI tiles, material distribution charts, method breakdown
    ├── plants/               # Plant overview list showing configured approaches per factory
    ├── products/             # Spare parts catalog with filters and "Record Packaging" triggers
    ├── packaging-flow/       # Method Selector, Approach A, Approach B, Approach C & Summary
    ├── inventory/            # Packaging materials warehouse stock view
    ├── records/              # Audit Ledger, Record Details Modal, IntegrityNext JSON Export
    └── auth/                 # Login & persona selection screen
```

---

## 🎯 6. Key Talking Points for Client Demonstration

When demonstrating this prototype to Cummins stakeholders and leadership:
1. **Show Multi-Plant Breadth**: Open the **Plants** tab to show that Cummins Pune, Phaltan, Jamshedpur, Columbus, and Daventry have different setups already mapped.
2. **Demonstrate Approach A (Zero-Input)**: Show how a plant manager can see batch inventory consumption reconciled effortlessly without bothering shop-floor operators.
3. **Demonstrate Approach B (Smart Rules)**: Show how engineering parameters auto-generate the complete packaging Bill of Materials (BOM) in 1 second.
4. **Demonstrate Approach C (Floor Flexibility)**: Show how a packing operator can log custom packaging for heavy engine components.
5. **Show Unified Audit & ESG Compliance**: Show the **Records Ledger** and open the **IntegrityNext JSON Export** modal to prove that all data formats align directly with European PPWR standards.

---

## 🚀 7. Roadmap & Next UI/UX Refinements

Based on client review and your upcoming instructions, we can enhance:
1. **Visual Polish**: Elevate typography, micro-interactions, badge designs, and enterprise layout aesthetics.
2. **Flow Simplification**: Ensure transitions between catalog $\to$ approach $\to$ summary $\to$ ledger are instant and intuitive.
3. **Custom Business Rules**: Expand calculation engine rules and batch parameters tailored to specific Cummins packaging guidelines.
