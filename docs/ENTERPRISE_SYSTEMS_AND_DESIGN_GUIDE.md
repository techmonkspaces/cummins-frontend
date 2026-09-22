# Enterprise Systems, Data Flow & Production Architecture Guide
## Industrial Packaging Consumption & PPWR Compliance Data Capture

> **Target Audience**: Solution Architects, Tech Leads, and Engineering Evaluators  
> **Context**: Spare-Parts, Heavy Industrial Tooling & Manufacturing Operations (e.g., Cummins, Caterpillar, ABB)

---

## 📑 Table of Contents
1. [Core Problem & Why Three Recording Approaches Exist](#1-core-problem--why-three-recording-approaches-exist)
2. [Existing Systems Landscape: Where Master Data Actually Lives](#2-existing-systems-landscape-where-master-data-actually-lives)
3. [End-to-End Production Data Architecture](#3-end-to-end-production-data-architecture)
4. [Downstream Compliance & ESG Sharing (IntegrityNext / EU PPWR)](#4-downstream-compliance--esg-sharing-integritynext--eu-ppwr)
5. [Critical Discovery Questions to Ask Stakeholders & Plant Managers](#5-critical-discovery-questions-to-ask-stakeholders--plant-managers)
6. [Recommended Production Tech Stack & Data Models](#6-recommended-production-tech-stack--data-models)

---

## 1. Core Problem & Why Three Recording Approaches Exist

In an ideal world, every piece of packaging would be modeled perfectly in a CAD database. In a real industrial plant with **hundreds of thousands of spare-part SKUs**, shipping from local depots, central hubs, and remanufacturing lines, operational visibility varies wildly.

```
                    OPERATIONAL REALITY IN INDUSTRIAL PLANTS
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                                                                             │
 │  1. High-Volume Repeat Items           2. Bulk Material Deductions         │
 │     (e.g., Fuel Injectors, Filters)       (e.g., Pallet wraps, Strapping)   │
 │     ► System Calculated (Approach B)      ► Inventory Batch (Approach A)    │
 │       Automated Rule Engine                 Monthly Stock / Batch Qty       │
 │                                                                             │
 │                               3. Custom / Heavy Tooling                     │
 │                                  (e.g., 12kg Valves, Export Crates)         │
 │                                  ► Floor Operator Input (Approach C)        │
 │                                    Manual Station Weighing & Barcodes       │
 └─────────────────────────────────────────────────────────────────────────────┘
```

### Why One Approach Never Works Alone:
1. **Approach A (Inventory / Consumption Based)**:
   - **Why needed**: It is impossible for floor workers to measure every 50cm piece of adhesive tape or individual sheets of crumpled kraft paper on high-speed packing lines. 
   - **How it works**: Warehouses track total packaging issues (e.g., 50 rolls of tape, 500 kg of corrugated cardboard deducted from SAP MM) over a week or batch run, dividing by the total packed quantity ($500\text{ kg} \div 1,000\text{ units} = 0.50\text{ kg/unit}$).
2. **Approach B (System Calculated / Top-Down Rules)**:
   - **Why needed**: For cataloged products where dimensions ($L \times W \times H$) and net payload weights are fixed. The rule engine calculates the box size, void volume, cushion density, and seam tape requirements automatically.
   - **Operator capability**: Operators can review and fine-tune recommendations before committing.
3. **Approach C (User Input / Floor Operator Log)**:
   - **Why needed**: For replacement kits, emergency shipments, heavy custom parts, or re-boxed returns where standard box rules fail and operators physically choose custom foam inserts, VCI rust bags, or wooden dunnage on the bench.

---

## 2. Existing Systems Landscape: Where Master Data Actually Lives

In a production deployment, this frontend does not use isolated mock data; it connects to enterprise systems via an API gateway:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             ENTERPRISE MASTER DATA MAP                           │
├───────────────────┬──────────────────────────────────┬───────────────────────────┤
│ System            │ Typical Enterprise Platforms      │ What Data Lives There     │
├───────────────────┼──────────────────────────────────┼───────────────────────────┤
│ **ERP / PLM**     │ SAP S/4HANA, Siemens Teamcenter, │ • Product SKUs & Weights  │
│                   │ PTC Windchill, Oracle Fusion     │ • Dimensions & CAD models │
│                   │                                  │ • Fragility / Hazard Code │
├───────────────────┼──────────────────────────────────┼───────────────────────────┤
│ **WMS / EWM**     │ SAP Extended Warehouse (EWM),    │ • Packaging stock levels  │
│                   │ Manhattan Active, Blue Yonder    │ • Standard Carton Codes   │
│                   │                                  │ • Tare weights & bin info │
├───────────────────┼──────────────────────────────────┼───────────────────────────┤
│ **MES / Floor**   │ Rockwell FactoryTalk, Apriso,    │ • Packing line stations   │
│                   │ Zebra Barcode Scanners, Toledo   │ • Batch work-orders       │
│                   │ Digital Bench Scales             │ • Gross/Net scale weights │
└───────────────────┴──────────────────────────────────┴───────────────────────────┘
```

### Typical SAP Data Tables Referenced:
- `MARA` / `MARC`: Material Master general data (Net weight, dimensions, material group).
- `MAST` / `STPO`: Bill of Materials (BOM) linking secondary packaging materials to parent assemblies.
- `MARD`: Storage location stock levels for packaging materials.
- `AFPO` / `AFKO`: Production & Packing orders for batch reconciliation.

---

## 3. End-to-End Production Data Architecture

```
                    PRODUCTION INTEGRATION ARCHITECTURE
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │   SAP S/4HANA   │       │   WMS (EWM)     │       │ Shop Floor MES  │
 │ (Product Master)│       │ (Packaging Stk) │       │ (Bench Scales)  │
 └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
          │ (Kafka/CDC)             │ (REST Sync)             │ (MQTT/Socket)
          ▼                         ▼                         ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                Enterprise API Gateway & Backend Service             │
 │                                                                     │
 │   ┌──────────────────────┐  ┌───────────────────┐  ┌────────────┐   │
 │   │ Master Data Ingestion│  │ Packaging Rules   │  │ SI Unit    │   │
 │   │ & Normalization Sync │  │ Algorithm Engine  │  │ Conversion │   │
 │   └──────────────────────┘  └───────────────────┘  └────────────┘   │
 └──────────────────────────────────┬──────────────────────────────────┘
                                    │ (REST / JSON API)
                                    ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                   Packaging Capture Frontend App                    │
 │                                                                     │
 │   [Dashboard] ──► [3 Method Workflows] ──► [Common Review BOM]     │
 └──────────────────────────────────┬──────────────────────────────────┘
                                    │ (Confirmed Record Event)
                                    ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                 PPWR Compliance Ledger & Data Lake                  │
 │                                                                     │
 │   ┌─────────────────────────────────────────────────────────────┐   │
 │   │ Standardized Bill of Materials:                             │   │
 │   │ • Mass (kg) by PPWR Category (PAP-20, PS-06, LDPE-04)       │   │
 │   │ • Recycled Content Fraction %                               │   │
 │   │ • Calculated CO₂e Embedded Footprint                        │   │
 │   └──────────────────────────────┬──────────────────────────────┘   │
 └──────────────────────────────────┼──────────────────────────────────┘
                                    │
                                    ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                   Downstream ESG & Compliance Ingestion             │
 │   • IntegrityNext API (Supplier Environmental Compliance)           │
 │   • SAP Sustainability Control Tower                                │
 │   • EU PPWR Article 9 / 11 Regulatory Reporting Portal             │
 └─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Downstream Compliance & ESG Sharing (IntegrityNext / EU PPWR)

The European Union **Packaging and Packaging Waste Regulation (PPWR)** mandates that industrial manufacturers report packaging weight, material categories, and recyclability by target years (2026, 2030, 2035).

### What Downstream Platforms Expect:
1. **Material Classification**: Standardized codes (e.g., `PAP-20` Corrugated Cardboard, `PAP-22` Paper cushion, `PS-06` EPS foam, `LDPE-04` Bubble wrap).
2. **Weight Ratios**: Total packaging tare weight relative to product mass (monitoring void-space and over-packaging rules under PPWR Article 9).
3. **Recycled Content Ratios**: Certified post-consumer recycled plastic percentages.
4. **Traceability / Provenance**: Audit trail recording which method was used to establish the weight (Inventory allocation vs CAD rule vs floor scale).

---

## 5. Critical Discovery Questions to Ask Stakeholders & Plant Managers

Before designing the backend and finalizing integration architecture, these are the **key questions** you should bring to technical and business discovery meetings:

### A. Master Data & Systems Questions:
1. *"In your current SAP / ERP setup, is packaging tracked as part of the sales BOM or treated as indirect shop-floor consumable inventory (MRO)?"*
2. *"Do packaging materials (cartons, tapes, bubble rolls) already have standardized material master numbers (`MAT-XXXX`) with certified tare weights and supplier recyclability data?"*
3. *"How often are product dimension and net weight records updated when engineering releases new revisions in PLM (Teamcenter/Windchill)?"*

### B. Shop-Floor UX & Operational Reality:
4. *"What hardware do packing operators use on the line? (Handheld Zebra Android barcode scanners, stationary desktop terminals, or ruggedized tablets?)"*
5. *"Can operators use a digital scale connected via USB/Bluetooth to auto-populate tare weight, or does it need to rely on barcode lookups?"*
6. *"How do you currently handle mixed-product shipments (where 5 different SKUs share a single consolidated master carton)?"*

### C. Compliance & Accuracy Tolerances:
7. *"What is the acceptable variance tolerance between calculated BOM packaging mass vs physical gross shipment weight?"*
8. *"What is the approval workflow for Draft records? Does a Shift Supervisor or Quality Manager need to sign off before committing to the PPWR ledger?"*
9. *"Which specific downstream ESG / supply-chain compliance tool will receive this data (IntegrityNext, Sphera, EcoVadis, or internal SAP ESG data lake)?"*

---

## 6. Recommended Production Tech Stack & Data Models

### Frontend:
- **Framework**: React / Next.js (TypeScript)
- **UI System**: Modular Design System tokens (clean corporate light mode, responsive for handheld and warehouse touchscreens).
- **State Management**: React Query (TanStack Query) for resilient API caching and offline form sync if floor WiFi drops.

### Backend & Ingestion API:
- **Runtime**: Node.js (NestJS / Fastify) or Java (Spring Boot) / Python (FastAPI).
- **Data Store**: 
  - **PostgreSQL**: Relational integrity for Product Master, Packaging Master, and Audit Records, utilizing `JSONB` for dynamic line-item attributes.
  - **Redis**: High-speed caching for fast SKU and material master autocomplete lookups on packing stations.
- **Message Broker**: **Apache Kafka** or **RabbitMQ** for streaming packing completion events from shop-floor MES stations to the central PPWR ledger.
