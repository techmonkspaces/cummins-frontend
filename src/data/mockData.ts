import { Product, PackagingMaterialMaster, PackagingRecord, Plant, UserPersona, PackagingRuleDefinition } from '../types';

export const MOCK_PLANTS: Plant[] = [
  {
    id: 'PLANT-PUNE',
    name: 'Pune Factory',
    shortName: 'Pune Factory',
    code: 'IN-PUN-01',
    location: 'Kothrud, Pune, Maharashtra, India',
    country: 'India',
    configuredMethod: 'INVENTORY',
    primaryErpSystem: 'SAP S/4HANA (PP/MM)',
    description: 'High-volume powertrain production plant with automated SAP S/4HANA material movement tracking (MVT 261/311) and batch packaging inventory reconciliation.',
    activeSkus: ['GA-102', 'BP-201', 'IN-108'],
    managerName: 'Rahul Sharma',
    roleTitle: 'Plant Logistics & Material Accounting Lead',
    usersCount: 24,
    recordsCount: 1248,
    status: 'Active'
  },
  {
    id: 'PLANT-PHALTAN',
    name: 'Phaltan Factory',
    shortName: 'Phaltan Factory',
    code: 'IN-PHL-02',
    location: 'Phaltan Megasite, Satara District, Maharashtra, India',
    country: 'India',
    configuredMethod: 'CALCULATED',
    primaryErpSystem: 'SAP EWM',
    description: 'Advanced automated assembly campus utilizing standardized CAD/PLM Top-Down calculation rules, void-space optimization, and certified BOM definitions.',
    activeSkus: ['GA-102', 'BP-201', 'VL-310', 'TC-550'],
    managerName: 'Amit Kumar',
    roleTitle: 'Senior Packaging & PLM Engineer',
    usersCount: 18,
    recordsCount: 856,
    status: 'Active'
  },
  {
    id: 'PLANT-JAMSHEDPUR',
    name: 'Jamshedpur Factory',
    shortName: 'Jamshedpur Factory',
    code: 'IN-JSR-03',
    location: 'Telco Industrial Estate, Jamshedpur, Jharkhand, India',
    country: 'India',
    configuredMethod: 'USER_INPUT',
    primaryErpSystem: 'SAP S/4HANA (PP/MM)',
    description: 'Heavy industrial transmission and engine packaging line with dedicated operator touchscreen packing station logging.',
    activeSkus: ['GA-102', 'VL-310', 'SP-415'],
    managerName: 'Vikas Singh',
    roleTitle: 'Floor Packing Operations Supervisor',
    usersCount: 12,
    recordsCount: 432,
    status: 'Active'
  }
];

export const MOCK_PERSONAS: UserPersona[] = [
  // ── Super Admin ───────────────────────────────────────────────────────────
  {
    id: 'PERSONA-ADMIN',
    name: 'Admin User',
    email: 'admin@cummins.com',
    role: 'SUPER_ADMIN',
    roleTitle: 'Super Admin • Global Sustainability Director',
    plantId: 'ALL_PLANTS',
    plantName: 'Global Operations (All Sites)',
    configuredMethod: 'INVENTORY',
    department: 'Corporate Sustainability & Compliance',
    isGlobalAdmin: true,
    permissions: {
      canConfigurePlants: true,
      canManageCatalog: true,
      canApproveRecords: true,
      canDeleteRecords: true,
      canExportPpwr: true,
      canSwitchPlants: true,
    }
  },

  // ── Pune Factory — Approach A (Inventory) ─────────────────────────────────
  {
    id: 'PERSONA-PUNE-MGR',
    name: 'Rahul Sharma',
    email: 'rahul.manager@cummins.com',
    role: 'FACTORY_MANAGER',
    roleTitle: 'Factory Manager • Pune Plant (Approach A)',
    plantId: 'PLANT-PUNE',
    plantName: 'Pune Factory',
    configuredMethod: 'INVENTORY',
    department: 'Plant Logistics & Inventory Accounting',
    isGlobalAdmin: false,
    permissions: {
      canConfigurePlants: false,
      canManageCatalog: false,
      canApproveRecords: true,
      canDeleteRecords: false,
      canExportPpwr: true,
      canSwitchPlants: false,
    }
  },
  {
    id: 'PERSONA-PUNE-OPR',
    name: 'Priya Desai',
    email: 'pune.operator@cummins.com',
    role: 'DATA_ENTRY',
    roleTitle: 'Data Entry Operator • Pune Plant',
    plantId: 'PLANT-PUNE',
    plantName: 'Pune Factory',
    configuredMethod: 'INVENTORY',
    department: 'WMS Inventory Station — Shift A',
    isGlobalAdmin: false,
    permissions: {
      canConfigurePlants: false,
      canManageCatalog: false,
      canApproveRecords: false,
      canDeleteRecords: false,
      canExportPpwr: false,
      canSwitchPlants: false,
    }
  },

  // ── Phaltan Factory — Approach B (Calculated) ─────────────────────────────
  {
    id: 'PERSONA-PHALTAN-MGR',
    name: 'Amit Kumar',
    email: 'amit.manager@cummins.com',
    role: 'FACTORY_MANAGER',
    roleTitle: 'Factory Manager • Phaltan Plant (Approach B)',
    plantId: 'PLANT-PHALTAN',
    plantName: 'Phaltan Factory',
    configuredMethod: 'CALCULATED',
    department: 'Packaging Engineering & PLM Standards',
    isGlobalAdmin: false,
    permissions: {
      canConfigurePlants: false,
      canManageCatalog: false,
      canApproveRecords: true,
      canDeleteRecords: false,
      canExportPpwr: true,
      canSwitchPlants: false,
    }
  },
  {
    id: 'PERSONA-PHALTAN-OPR',
    name: 'Sneha Patil',
    email: 'phaltan.operator@cummins.com',
    role: 'DATA_ENTRY',
    roleTitle: 'Data Entry Operator • Phaltan Plant',
    plantId: 'PLANT-PHALTAN',
    plantName: 'Phaltan Factory',
    configuredMethod: 'CALCULATED',
    department: 'BOM Packing Station — Shift B',
    isGlobalAdmin: false,
    permissions: {
      canConfigurePlants: false,
      canManageCatalog: false,
      canApproveRecords: false,
      canDeleteRecords: false,
      canExportPpwr: false,
      canSwitchPlants: false,
    }
  },

  // ── Jamshedpur Factory — Approach C (User Input) ──────────────────────────
  {
    id: 'PERSONA-JAMSHEDPUR-MGR',
    name: 'Vikas Singh',
    email: 'vikas.manager@cummins.com',
    role: 'FACTORY_MANAGER',
    roleTitle: 'Factory Manager • Jamshedpur Plant (Approach C)',
    plantId: 'PLANT-JAMSHEDPUR',
    plantName: 'Jamshedpur Factory',
    configuredMethod: 'USER_INPUT',
    department: 'Shop-Floor Packing Operations',
    isGlobalAdmin: false,
    permissions: {
      canConfigurePlants: false,
      canManageCatalog: false,
      canApproveRecords: true,
      canDeleteRecords: false,
      canExportPpwr: true,
      canSwitchPlants: false,
    }
  },
  {
    id: 'PERSONA-JAMSHEDPUR-OPR',
    name: 'Raju Mehta',
    email: 'jamshedpur.operator@cummins.com',
    role: 'DATA_ENTRY',
    roleTitle: 'Data Entry Operator • Jamshedpur Plant',
    plantId: 'PLANT-JAMSHEDPUR',
    plantName: 'Jamshedpur Factory',
    configuredMethod: 'USER_INPUT',
    department: 'Floor Packing Station #4 — Shift C',
    isGlobalAdmin: false,
    permissions: {
      canConfigurePlants: false,
      canManageCatalog: false,
      canApproveRecords: false,
      canDeleteRecords: false,
      canExportPpwr: false,
      canSwitchPlants: false,
    }
  }
];

export const MOCK_USERS_LIST = [
  {
    id: 'USR-001',
    name: 'Admin User',
    email: 'admin@cummins.com',
    role: 'Super Admin',
    factory: 'All Factories (Global Scope)',
    department: 'Corporate Sustainability',
    status: 'Active',
    lastLogin: 'Today, 09:45 AM'
  },
  // Pune Factory
  {
    id: 'USR-002',
    name: 'Rahul Sharma',
    email: 'rahul.manager@cummins.com',
    role: 'Factory Manager',
    factory: 'Pune Factory',
    department: 'Plant Logistics & Inventory',
    status: 'Active',
    lastLogin: 'Today, 10:15 AM'
  },
  {
    id: 'USR-005',
    name: 'Priya Desai',
    email: 'pune.operator@cummins.com',
    role: 'Data Entry Operator',
    factory: 'Pune Factory',
    department: 'WMS Inventory Station — Shift A',
    status: 'Active',
    lastLogin: 'Today, 07:30 AM'
  },
  // Phaltan Factory
  {
    id: 'USR-003',
    name: 'Amit Kumar',
    email: 'amit.manager@cummins.com',
    role: 'Factory Manager',
    factory: 'Phaltan Factory',
    department: 'Packaging Engineering',
    status: 'Active',
    lastLogin: 'Yesterday, 04:30 PM'
  },
  {
    id: 'USR-006',
    name: 'Sneha Patil',
    email: 'phaltan.operator@cummins.com',
    role: 'Data Entry Operator',
    factory: 'Phaltan Factory',
    department: 'BOM Packing Station — Shift B',
    status: 'Active',
    lastLogin: 'Today, 06:50 AM'
  },
  // Jamshedpur Factory
  {
    id: 'USR-004',
    name: 'Vikas Singh',
    email: 'vikas.manager@cummins.com',
    role: 'Factory Manager',
    factory: 'Jamshedpur Factory',
    department: 'Shop-Floor Packing Operations',
    status: 'Active',
    lastLogin: 'Today, 08:20 AM'
  },
  {
    id: 'USR-007',
    name: 'Raju Mehta',
    email: 'jamshedpur.operator@cummins.com',
    role: 'Data Entry Operator',
    factory: 'Jamshedpur Factory',
    department: 'Floor Packing Station #4 — Shift C',
    status: 'Active',
    lastLogin: 'Today, 08:45 AM'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    sku: 'GA-102',
    name: 'Gear Assembly',
    category: 'Powertrain Components',
    weightKg: 8.0,
    dimensionsCm: { length: 30, width: 20, height: 15 },
    volumeCm3: 9000,
    fragility: 'Medium',
    defaultBatchSize: 1000,
    description: 'Precision-machined planetary gear assembly for heavy-duty industrial transmissions. Requires rigid outer boxing, impact-absorbing cushioning, and moisture-resistant wrapping.'
  },
  {
    sku: 'BP-201',
    name: 'Brake Assembly',
    category: 'Chassis & Braking',
    weightKg: 5.5,
    dimensionsCm: { length: 25, width: 18, height: 12 },
    volumeCm3: 5400,
    fragility: 'Low',
    defaultBatchSize: 500,
    description: 'Heavy vehicle pneumatic disc brake caliper and rotor assembly. Requires anti-corrosion barrier and durable corrugated support.'
  },
  {
    sku: 'VL-310',
    name: 'Industrial Valve',
    category: 'Fluid Handling & Controls',
    weightKg: 12.0,
    dimensionsCm: { length: 35, width: 25, height: 20 },
    volumeCm3: 17500,
    fragility: 'High',
    defaultBatchSize: 250,
    description: 'High-pressure cast stainless valve with calibrated actuator mechanism. Heavy-duty cushioning and custom EPS end-caps required.'
  },
  {
    sku: 'SP-415',
    name: 'Spare Part Kit',
    category: 'Maintenance & Service Kits',
    weightKg: 3.0,
    dimensionsCm: { length: 20, width: 15, height: 10 },
    volumeCm3: 3000,
    fragility: 'Low',
    defaultBatchSize: 800,
    description: 'Comprehensive 500-hour preventative maintenance kit including gaskets, O-rings, hardware, and filters.'
  },
  {
    sku: 'TC-550',
    name: 'Turbocharger Cartridge',
    category: 'Air & Exhaust Systems',
    weightKg: 6.8,
    dimensionsCm: { length: 28, width: 22, height: 18 },
    volumeCm3: 11088,
    fragility: 'High',
    defaultBatchSize: 400,
    description: 'High-speed balanced turbocharger CHRA rotating assembly. Requires zero-play contour foam and sealed vapor barrier.'
  },
  {
    sku: 'IN-108',
    name: 'Heavy Duty Fuel Injector',
    category: 'Fuel Systems',
    weightKg: 1.4,
    dimensionsCm: { length: 15, width: 10, height: 8 },
    volumeCm3: 1200,
    fragility: 'Medium',
    defaultBatchSize: 1200,
    description: 'Common rail electronic fuel injector with micron-tolerance nozzle tips. Multi-unit compartment packing.'
  }
];

export const MOCK_PACKAGING_INVENTORY: PackagingMaterialMaster[] = [
  {
    id: 'MAT-001',
    name: 'Cardboard Box',
    category: 'Paper/Cardboard',
    availableStock: 2500,
    stockUnit: 'pcs',
    weightPerUnitKg: 0.45,
    unitName: 'pcs',
    dimensions: '35 × 25 × 20 cm',
    recycledContentPct: 85,
    recyclable: true,
    ppwrMaterialCode: 'PAP-20',
    co2PerKg: 0.82,
    description: 'Double-wall corrugated shipping carton (FEFCO 0201 standard).'
  },
  {
    id: 'MAT-002',
    name: 'Corrugated Cardboard Sheets',
    category: 'Paper/Cardboard',
    availableStock: 1200,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    dimensions: '30 × 20 cm sheets (5-ply)',
    recycledContentPct: 90,
    recyclable: true,
    ppwrMaterialCode: 'PAP-21',
    co2PerKg: 0.78,
    description: 'Fluted heavy corrugated divider sheets and edge corner protectors.'
  },
  {
    id: 'MAT-003',
    name: 'Kraft Paper Cushioning',
    category: 'Paper',
    availableStock: 800,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    dimensions: '70 gsm crumpled kraft paper',
    recycledContentPct: 100,
    recyclable: true,
    ppwrMaterialCode: 'PAP-22',
    co2PerKg: 0.65,
    description: '100% recycled kraft paper void fill and protective crumpled cushioning.'
  },
  {
    id: 'MAT-004',
    name: 'Thermocol / EPS End-Caps',
    category: 'Plastic',
    availableStock: 450,
    stockUnit: 'pcs',
    weightPerUnitKg: 0.08,
    unitName: 'pcs',
    dimensions: '15 × 10 × 8 cm end-caps',
    recycledContentPct: 20,
    recyclable: true,
    ppwrMaterialCode: 'PS-06',
    co2PerKg: 2.85,
    description: 'Expanded Polystyrene (EPS) custom-molded shock absorption corner blocks.'
  },
  {
    id: 'MAT-005',
    name: 'LDPE Bubble Wrap',
    category: 'Plastic',
    availableStock: 600,
    stockUnit: 'm',
    weightPerUnitKg: 0.05,
    unitName: 'm',
    dimensions: '1000 mm × 50 m roll',
    recycledContentPct: 30,
    recyclable: true,
    ppwrMaterialCode: 'LDPE-04',
    co2PerKg: 2.10,
    description: 'Barrier-sealed LDPE air bubble cushioning roll for surface protection.'
  },
  {
    id: 'MAT-006',
    name: 'VCI Anti-Rust Poly Bag',
    category: 'Plastic',
    availableStock: 3000,
    stockUnit: 'pcs',
    weightPerUnitKg: 0.03,
    unitName: 'pcs',
    dimensions: '40 × 30 cm (50 micron)',
    recycledContentPct: 40,
    recyclable: true,
    ppwrMaterialCode: 'HDPE-02',
    co2PerKg: 1.95,
    description: 'Moisture/dust barrier liners and VCI rust-inhibiting heavy poly bags.'
  },
  {
    id: 'MAT-007',
    name: 'Packaging Seam Tape',
    category: 'Plastic',
    availableStock: 950,
    stockUnit: 'rolls',
    weightPerUnitKg: 0.15,
    unitName: 'rolls',
    dimensions: '50 mm × 66 m roll',
    recycledContentPct: 0,
    recyclable: false,
    ppwrMaterialCode: 'BOPP-05',
    co2PerKg: 3.20,
    description: 'Heavy duty pressure-sensitive polypropylene carton sealing tape (50mm).'
  },
  {
    id: 'MAT-008',
    name: 'EPE Foam Sheet',
    category: 'Plastic',
    availableStock: 500,
    stockUnit: 'pcs',
    weightPerUnitKg: 0.06,
    unitName: 'pcs',
    dimensions: '100 × 100 cm (2mm thickness)',
    recycledContentPct: 15,
    recyclable: true,
    ppwrMaterialCode: 'EPE-04',
    co2PerKg: 2.60,
    description: 'Cross-linked non-abrasive polyethylene foam sheeting for delicate coatings.'
  },
  {
    id: 'MAT-009',
    name: 'Pallet Stretch Film',
    category: 'Plastic',
    availableStock: 350,
    stockUnit: 'rolls',
    weightPerUnitKg: 1.8,
    unitName: 'rolls',
    dimensions: '500 mm × 300 m (23 micron)',
    recycledContentPct: 35,
    recyclable: true,
    ppwrMaterialCode: 'LLDPE-04',
    co2PerKg: 2.05,
    description: 'Pallet containment machine stretch wrap (23 micron).'
  }
];

export const MOCK_RULES: PackagingRuleDefinition[] = [
  {
    id: 'RULE-F01',
    category: 'FACTORY',
    name: 'Phaltan Standard Carton Clearance',
    target: 'Phaltan Factory',
    condition: 'Carton dimension assignment for all SKUs',
    action: 'Add +5 cm clearance buffer on L × W × H to select optimal outer box',
    priority: 1,
    status: 'ACTIVE',
    description: 'Ensures minimum 5cm void space envelope surrounding all assembly parts for shock absorption.'
  },
  {
    id: 'RULE-P01',
    category: 'PRODUCT_CLASS',
    name: 'Heavy Duty Structural Protection',
    target: 'Weight > 5.0 kg',
    condition: 'Product net weight exceeds 5.0 kg',
    action: 'Auto-assign 80g EPS Thermocol structural corner blocks or high-density dunnage',
    priority: 2,
    status: 'ACTIVE',
    description: 'Reinforces package corners against impact drop damage for industrial components over 5kg.'
  },
  {
    id: 'RULE-M01',
    category: 'MATERIAL',
    name: 'Fragility-Based Cushioning Density',
    target: 'Fragility >= Medium',
    condition: 'Product fragility rated Medium or High',
    action: 'Calculate void volume and assign 120g recycled kraft paper cushioning',
    priority: 3,
    status: 'ACTIVE',
    description: 'Fills package void space to prevent internal shifting during transit.'
  },
  {
    id: 'RULE-S01',
    category: 'SKU_OVERRIDE',
    name: 'GA-102 Gear Assembly Special Rule',
    target: 'SKU GA-102',
    condition: 'Specific to Gear Assembly shipments',
    action: 'Enforce Double-wall Corrugated Box (450g) + 25g Seam Perimeter Tape',
    priority: 4,
    status: 'ACTIVE',
    description: 'Approved Cummins Packaging Engineering standard for precision gear assemblies.'
  }
];

export const INITIAL_PACKAGING_RECORDS: PackagingRecord[] = [
  {
    id: 'PR-1001',
    productId: 'GA-102',
    productName: 'Gear Assembly',
    productSku: 'GA-102',
    productQuantity: 1000,
    method: 'INVENTORY',
    plantId: 'PLANT-PUNE',
    plantName: 'Pune Factory',
    period: 'September 2026',
    status: 'CONFIRMED',
    createdAt: '2026-09-22',
    confirmedAt: '2026-09-22',
    notes: 'Monthly batch packaging inventory reconciliation. Consumption drawn from SAP MM issue logs.',
    totalPackagingWeightKg: 600.0,
    perUnitPackagingWeightKg: 0.600,
    materials: [
      {
        id: 'MAT-REC-1',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 500,
        unit: 'kg',
        weight: 500,
        weightUnit: 'kg',
        weightKg: 500
      },
      {
        id: 'MAT-REC-2',
        materialId: 'MAT-003',
        materialName: 'Kraft Paper Cushioning',
        category: 'Paper',
        quantity: 80,
        unit: 'kg',
        weight: 80,
        weightUnit: 'kg',
        weightKg: 80
      },
      {
        id: 'MAT-REC-3',
        materialId: 'MAT-007',
        materialName: 'Packaging Seam Tape',
        category: 'Plastic',
        quantity: 20,
        unit: 'kg',
        weight: 20,
        weightUnit: 'kg',
        weightKg: 20
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 580,
      paperCardboardPct: 96.67,
      plasticKg: 20,
      plasticPct: 3.33,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 600.0,
      perUnitPackagingWeightKg: 0.600,
      avgRecyclablePct: 96.7,
      estimatedCo2eKg: 492.0
    }
  },
  {
    id: 'PR-1002',
    productId: 'GA-102',
    productName: 'Gear Assembly',
    productSku: 'GA-102',
    productQuantity: 100,
    method: 'CALCULATED',
    plantId: 'PLANT-PHALTAN',
    plantName: 'Phaltan Factory',
    status: 'CONFIRMED',
    createdAt: '2026-09-22',
    confirmedAt: '2026-09-22',
    notes: 'Generated via Cummins Top-Down Rule Engine based on 8.0kg payload and CAD geometry.',
    totalPackagingWeightKg: 67.5,
    perUnitPackagingWeightKg: 0.675,
    materials: [
      {
        id: 'MAT-REC-4',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 100,
        unit: 'pcs',
        weight: 45.0,
        weightUnit: 'kg',
        weightKg: 45.0
      },
      {
        id: 'MAT-REC-5',
        materialId: 'MAT-003',
        materialName: 'Kraft Paper Cushioning',
        category: 'Paper',
        quantity: 12.0,
        unit: 'kg',
        weight: 12.0,
        weightUnit: 'kg',
        weightKg: 12.0
      },
      {
        id: 'MAT-REC-6',
        materialId: 'MAT-004',
        materialName: 'Thermocol / EPS End-Caps',
        category: 'Plastic',
        quantity: 100,
        unit: 'pcs',
        weight: 8.0,
        weightUnit: 'kg',
        weightKg: 8.0
      },
      {
        id: 'MAT-REC-7',
        materialId: 'MAT-007',
        materialName: 'Packaging Seam Tape',
        category: 'Plastic',
        quantity: 2.5,
        unit: 'kg',
        weight: 2.5,
        weightUnit: 'kg',
        weightKg: 2.5
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 57.0,
      paperCardboardPct: 84.44,
      plasticKg: 10.5,
      plasticPct: 15.56,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 67.5,
      perUnitPackagingWeightKg: 0.675,
      avgRecyclablePct: 92.4,
      estimatedCo2eKg: 58.2
    }
  },
  {
    id: 'PR-1003',
    productId: 'GA-102',
    productName: 'Gear Assembly',
    productSku: 'GA-102',
    productQuantity: 1,
    method: 'USER_INPUT',
    plantId: 'PLANT-JAMSHEDPUR',
    plantName: 'Jamshedpur Factory',
    status: 'CONFIRMED',
    createdAt: '2026-09-22',
    confirmedAt: '2026-09-22',
    notes: 'Station #4 floor packing entry. Verified with digital bench scale.',
    totalPackagingWeightKg: 0.180,
    perUnitPackagingWeightKg: 0.180,
    materials: [
      {
        id: 'MAT-REC-8',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 1,
        unit: 'pcs',
        weight: 0.100,
        weightUnit: 'kg',
        weightKg: 0.100
      },
      {
        id: 'MAT-REC-9',
        materialId: 'MAT-003',
        materialName: 'Kraft Paper Cushioning',
        category: 'Paper',
        quantity: 100,
        unit: 'g',
        weight: 0.050,
        weightUnit: 'kg',
        weightKg: 0.050
      },
      {
        id: 'MAT-REC-10',
        materialId: 'MAT-004',
        materialName: 'Thermocol / EPS End-Caps',
        category: 'Plastic',
        quantity: 60,
        unit: 'g',
        weight: 0.020,
        weightUnit: 'kg',
        weightKg: 0.020
      },
      {
        id: 'MAT-REC-11',
        materialId: 'MAT-007',
        materialName: 'Packaging Seam Tape',
        category: 'Plastic',
        quantity: 20,
        unit: 'g',
        weight: 0.010,
        weightUnit: 'kg',
        weightKg: 0.010
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 0.150,
      paperCardboardPct: 83.33,
      plasticKg: 0.030,
      plasticPct: 16.67,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 0.180,
      perUnitPackagingWeightKg: 0.180,
      avgRecyclablePct: 91.5,
      estimatedCo2eKg: 0.16
    }
  },
  {
    id: 'PR-1004',
    productId: 'BP-201',
    productName: 'Brake Assembly',
    productSku: 'BP-201',
    productQuantity: 500,
    method: 'INVENTORY',
    plantId: 'PLANT-PUNE',
    plantName: 'Pune Factory',
    period: 'September 2026',
    status: 'CONFIRMED',
    createdAt: '2026-09-20',
    confirmedAt: '2026-09-20',
    notes: 'Brake caliper line batch issue reconciliation.',
    totalPackagingWeightKg: 240.0,
    perUnitPackagingWeightKg: 0.480,
    materials: [
      {
        id: 'MAT-REC-12',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 200,
        unit: 'kg',
        weight: 200,
        weightUnit: 'kg',
        weightKg: 200
      },
      {
        id: 'MAT-REC-13',
        materialId: 'MAT-006',
        materialName: 'VCI Anti-Rust Poly Bag',
        category: 'Plastic',
        quantity: 40,
        unit: 'kg',
        weight: 40,
        weightUnit: 'kg',
        weightKg: 40
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 200,
      paperCardboardPct: 83.33,
      plasticKg: 40,
      plasticPct: 16.67,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 240.0,
      perUnitPackagingWeightKg: 0.480,
      avgRecyclablePct: 95.0,
      estimatedCo2eKg: 215.0
    }
  },
  {
    id: 'PR-1005',
    productId: 'VL-310',
    productName: 'Industrial Valve',
    productSku: 'VL-310',
    productQuantity: 50,
    method: 'CALCULATED',
    plantId: 'PLANT-PHALTAN',
    plantName: 'Phaltan Factory',
    status: 'CONFIRMED',
    createdAt: '2026-09-21',
    confirmedAt: '2026-09-21',
    notes: '12kg heavy valve automated calculation with reinforced EPS corner caps.',
    totalPackagingWeightKg: 46.0,
    perUnitPackagingWeightKg: 0.920,
    materials: [
      {
        id: 'MAT-REC-14',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 50,
        unit: 'pcs',
        weight: 32.5,
        weightUnit: 'kg',
        weightKg: 32.5
      },
      {
        id: 'MAT-REC-15',
        materialId: 'MAT-004',
        materialName: 'Thermocol / EPS End-Caps',
        category: 'Plastic',
        quantity: 100,
        unit: 'pcs',
        weight: 13.5,
        weightUnit: 'kg',
        weightKg: 13.5
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 32.5,
      paperCardboardPct: 70.65,
      plasticKg: 13.5,
      plasticPct: 29.35,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 46.0,
      perUnitPackagingWeightKg: 0.920,
      avgRecyclablePct: 88.0,
      estimatedCo2eKg: 44.2
    }
  }
];
