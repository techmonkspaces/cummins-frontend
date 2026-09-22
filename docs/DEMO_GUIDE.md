# Evaluator & Stakeholder Demo Guide

This document provides a step-by-step walkthrough script for presenting the **Cummins PPWR Packaging Consumption & Data Capture Platform** to business leaders and technical evaluators.

---

## 🎬 8-Step Demo Presentation Script

### Step 1: High-Level Executive Context (Dashboard)
- **Action**: Open the application at `http://localhost:3000/`.
- **Talking Points**:
  - *"Welcome to the Cummins Packaging Consumption & PPWR Data Capture Platform."*
  - *"Our goal is to accurately capture packaging material mass across our spare-parts and powertrain operations to meet EU PPWR 2024 compliance and export verified datasets into IntegrityNext."*
  - *"Notice the top KPIs: Total Products Processed, Total Packaging Weight, Cardboard vs Plastic mass split, and our three recording methodology distributions."*

---

### Step 2: Product Selection (Catalog)
- **Action**: Click the **'Products'** tab in the navigation bar.
- **Talking Points**:
  - *"Here we see our mock product catalog featuring industrial components like GA-102 Gear Assembly, Brake Assemblies, Valves, and Kits."*
  - *"For our primary evaluation, let's select the **GA-102 Gear Assembly (8.0 kg)** and click **'Record Packaging'**."*

---

### Step 3: Methodology Comparison
- **Action**: Observe the 3 approach cards on the **Method Selector** screen.
- **Talking Points**:
  - *"Our system supports three distinct recording realities based on operational visibility:"*
  - **Approach A (Inventory Based)**: For batch allocation when material stock consumption is reconciled over a week/month.
  - **Approach B (System Calculated)**: For rule-engine automated recommendations based on SKU dimensions and weight.
  - **Approach C (User Input)**: For floor operators recording actual materials at the packing station.

---

### Step 4: Demonstrating Approach A — Inventory / Consumption Based
- **Action**: Select **Approach A** and click **Continue**.
- **Talking Points**:
  - *"Notice our batch scenario: **1,000 Gear Assemblies packed**."*
  - *"Inventory records show **500 kg Cardboard Box**, **80 kg Cushioning**, and **20 kg Tape** consumed."*
  - *"The live mathematical engine immediately computes: $500\text{ kg} \div 1,000 = \mathbf{0.500\text{ kg/unit}}$ Cardboard, totaling $\mathbf{0.600\text{ kg/unit}}$ across all packaging."*

---

### Step 5: Demonstrating Approach B — System Calculated (Top-Down)
- **Action**: Navigate to **Approach B** for Gear Assembly.
- **Talking Points**:
  - *"Here the Cummins Rule Engine analyzes the 8.0 kg mass and $30 \times 20 \times 15\text{ cm}$ profile."*
  - *"It proposes: 1 Cardboard Box (450g), 120g Paper Cushioning, 80g EPS structural support, and 25g Seam Tape."*
  - *"The operator can modify quantities or add extra protective items (e.g. Foam Sheets) before proceeding."*

---

### Step 6: Demonstrating Approach C — User Input / Floor Operator Log
- **Action**: Navigate to **Approach C**.
- **Talking Points**:
  - *"Floor operators pick materials dynamically from the packaging inventory master."*
  - *"They can enter in native units (`pcs`, `grams`, `kg`), and the system normalizes everything into standardized kilograms in real time."*

---

### Step 7: Unified Common Packaging Summary
- **Action**: Click **'Proceed to Packaging Summary Review'**.
- **Talking Points**:
  - *"Crucially, all three methods arrive at the **exact same standardized review screen**."*
  - *"We see the full Bill of Materials, weight share %, and instant EU PPWR compliance fractions (Paper vs Plastic, Recyclability score, CO₂e estimate)."*
  - *"Click **'Confirm & Commit Record'** to save."*

---

### Step 8: Audit Ledger & IntegrityNext JSON Export
- **Action**: Open **Packaging Records** and click **'IntegrityNext Export (JSON)'**.
- **Talking Points**:
  - *"All confirmed records are stored in the compliance audit ledger with complete method provenance."*
  - *"Clicking 'IntegrityNext Export (JSON)' produces the exact structured compliance payload required for downstream supplier compliance workflows."*
