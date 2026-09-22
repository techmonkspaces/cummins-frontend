# Technical Architecture & API Integration Guide

## 1. System Design Principles

The application is structured with strict separation between UI rendering and business/data service layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Presentation Layer                 │
│   (Dashboard, ProductList, Method Flows, Summary, Ledger)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌──────────────────────┐ ┌────────────────┐ ┌──────────────────────┐
│  productService.ts   │ │ calculation    │ │  inventoryService.ts │
│  (Product Master)    │ │ Engine.ts      │ │  (Packaging Master)  │
└──────────┬───────────┘ └───────┬────────┘ └──────────┬───────────┘
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   recordsService.ts   │
                     │  (Ledger & Analytics) │
                     └───────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       ┌──────────────────┐            ┌──────────────────┐
       │ LocalStorage     │            │ IntegrityNext    │
       │ (Demo Store)     │            │ JSON PPWR Export │
       └──────────────────┘            └──────────────────┘
```

---

## 2. API Boundaries & Future Backend Integration

All external interactions are encapsulated into service modules, making backend swap-in effortless:

### 1. `productService.ts`
- **Current Demo Implementation**: In-memory retrieval from `mockData.ts`.
- **Production Integration**: Replace with REST/GraphQL endpoint pointing to Cummins SAP PLM or Oracle Product Master API.
- **Contract**:
  - `getProducts(): Promise<Product[]>`
  - `getProductBySku(sku: string): Promise<Product | undefined>`
  - `searchProducts(query: string, category?: string): Promise<Product[]>`

### 2. `inventoryService.ts`
- **Current Demo Implementation**: Mock packaging inventory master.
- **Production Integration**: Replace with Warehouse Management System (WMS) / ERP inventory feed.
- **Contract**:
  - `getMaterials(): Promise<PackagingMaterialMaster[]>`
  - `getMaterialById(id: string): Promise<PackagingMaterialMaster | undefined>`
  - `getMaterialsByCategory(cat: MaterialCategory): Promise<PackagingMaterialMaster[]>`

### 3. `calculationEngine.ts`
- **Current Demo Implementation**: Client-side top-down algorithmic rules based on outer product dimensions ($L \times W \times H$), mass payload, void space, and fragility index.
- **Production Integration**: Connect to Cummins Enterprise Packaging Recommendation Service or ML Box Optimization API.

### 4. `recordsService.ts`
- **Current Demo Implementation**: Local persistence via browser `localStorage` with initial mock seed dataset.
- **Production Integration**: Post confirmed records to PPWR compliance data lake and downstream **IntegrityNext Compliance API**.
- **Contract**:
  - `createRecord(...)`
  - `calculatePpwrSummary(...)`
  - `exportPpwrJson(...)`
  - `exportCsv(...)`

---

## 3. Downstream IntegrityNext & EU PPWR Compliance Mapping

The platform exports data conforming to the standard schema:

| Local Field | PPWR Directive Mapping | IntegrityNext Schema Field |
| :--- | :--- | :--- |
| `ppwrSummary.paperCardboardKg` | Article 9 / 11 Recyclable Fibre Mass | `materials.fibre_based_packaging_kg` |
| `ppwrSummary.plasticKg` | Article 6 Plastic Packaging Reduction | `materials.polymer_packaging_kg` |
| `ppwrSummary.avgRecyclablePct` | Design for Recycling (DfR) Grade | `recyclability.dfr_recyclable_ratio` |
| `ppwrSummary.estimatedCo2eKg` | Scope 3 Category 1 Embedded Carbon | `lca.carbon_footprint_kg_co2e` |
| `materials[].ppwrMaterialCode` | European Packaging Identification Codes | `compliance.material_code (PAP-20, PS-06, etc.)` |
