import { Product, PackagingMaterialMaster, PackagingRecord } from '../types';

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
    weightPerUnitKg: 0.45, // 450g per average box
    unitName: 'pcs',
    recycledContentPct: 85,
    recyclable: true,
    ppwrMaterialCode: 'PAP-20',
    co2PerKg: 0.82,
    description: 'Double-wall corrugated shipping carton (FEFCO 0201 standard).'
  },
  {
    id: 'MAT-002',
    name: 'Corrugated Cardboard',
    category: 'Paper/Cardboard',
    availableStock: 800,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 90,
    recyclable: true,
    ppwrMaterialCode: 'PAP-21',
    co2PerKg: 0.78,
    description: 'Fluted heavy corrugated divider sheets and edge corner protectors.'
  },
  {
    id: 'MAT-003',
    name: 'Cushioning',
    category: 'Paper',
    availableStock: 350,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 100,
    recyclable: true,
    ppwrMaterialCode: 'PAP-22',
    co2PerKg: 0.65,
    description: '100% recycled kraft paper void fill and protective crumpled cushioning.'
  },
  {
    id: 'MAT-004',
    name: 'Thermocol / EPS',
    category: 'Plastic',
    availableStock: 180,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 20,
    recyclable: true,
    ppwrMaterialCode: 'PS-06',
    co2PerKg: 2.85,
    description: 'Expanded Polystyrene (EPS) custom-molded shock absorption blocks.'
  },
  {
    id: 'MAT-005',
    name: 'Bubble Wrap',
    category: 'Plastic',
    availableStock: 120,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 30,
    recyclable: true,
    ppwrMaterialCode: 'LDPE-04',
    co2PerKg: 2.10,
    description: 'Barrier-sealed LDPE air bubble cushioning roll for surface protection.'
  },
  {
    id: 'MAT-006',
    name: 'Plastic Bag',
    category: 'Plastic',
    availableStock: 500,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 40,
    recyclable: true,
    ppwrMaterialCode: 'HDPE-02',
    co2PerKg: 1.95,
    description: 'Moisture/dust barrier liners and VCI rust-inhibiting heavy poly bags.'
  },
  {
    id: 'MAT-007',
    name: 'Packaging Tape',
    category: 'Plastic',
    availableStock: 90,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 0,
    recyclable: false,
    ppwrMaterialCode: 'BOPP-05',
    co2PerKg: 3.20,
    description: 'Heavy duty pressure-sensitive polypropylene carton sealing tape (50mm).'
  },
  {
    id: 'MAT-008',
    name: 'Foam Sheet',
    category: 'Plastic',
    availableStock: 100,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 15,
    recyclable: true,
    ppwrMaterialCode: 'EPE-04',
    co2PerKg: 2.60,
    description: 'Cross-linked non-abrasive polyethylene foam sheeting for delicate coatings.'
  },
  {
    id: 'MAT-009',
    name: 'Stretch Film',
    category: 'Plastic',
    availableStock: 150,
    stockUnit: 'kg',
    weightPerUnitKg: 1.0,
    unitName: 'kg',
    recycledContentPct: 35,
    recyclable: true,
    ppwrMaterialCode: 'LLDPE-04',
    co2PerKg: 2.05,
    description: 'Pallet containment machine stretch wrap (23 micron).'
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
    period: '2026-W37 (Sep 08 - Sep 14)',
    status: 'CONFIRMED',
    createdAt: '2026-09-14',
    confirmedAt: '2026-09-15',
    notes: 'Weekly assembly line packaging inventory reconciliation. Consumption derived from stock deduction records.',
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
        materialName: 'Cushioning',
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
        materialName: 'Packaging Tape',
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
      totalPackagingWeightKg: 600,
      perUnitPackagingWeightKg: 0.600,
      avgRecyclablePct: 96.7,
      estimatedCo2eKg: 526.0
    }
  },
  {
    id: 'PR-1002',
    productId: 'BP-201',
    productName: 'Brake Assembly',
    productSku: 'BP-201',
    productQuantity: 100,
    method: 'CALCULATED',
    status: 'CONFIRMED',
    createdAt: '2026-09-18',
    confirmedAt: '2026-09-18',
    notes: 'Calculated via Top-Down rule engine based on 5.5 kg payload and 5,400 cm³ volume profile.',
    totalPackagingWeightKg: 49.5,
    perUnitPackagingWeightKg: 0.495,
    materials: [
      {
        id: 'MAT-REC-4',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 100,
        unit: 'pcs',
        weight: 38,
        weightUnit: 'kg',
        weightKg: 38
      },
      {
        id: 'MAT-REC-5',
        materialId: 'MAT-003',
        materialName: 'Cushioning',
        category: 'Paper',
        quantity: 6,
        unit: 'kg',
        weight: 6,
        weightUnit: 'kg',
        weightKg: 6
      },
      {
        id: 'MAT-REC-6',
        materialId: 'MAT-004',
        materialName: 'Thermocol / EPS',
        category: 'Plastic',
        quantity: 3.5,
        unit: 'kg',
        weight: 3.5,
        weightUnit: 'kg',
        weightKg: 3.5
      },
      {
        id: 'MAT-REC-7',
        materialId: 'MAT-007',
        materialName: 'Packaging Tape',
        category: 'Plastic',
        quantity: 2.0,
        unit: 'kg',
        weight: 2.0,
        weightUnit: 'kg',
        weightKg: 2.0
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 44.0,
      paperCardboardPct: 88.89,
      plasticKg: 5.5,
      plasticPct: 11.11,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 49.5,
      perUnitPackagingWeightKg: 0.495,
      avgRecyclablePct: 91.2,
      estimatedCo2eKg: 48.2
    }
  },
  {
    id: 'PR-1003',
    productId: 'VL-310',
    productName: 'Industrial Valve',
    productSku: 'VL-310',
    productQuantity: 50,
    method: 'USER_INPUT',
    status: 'DRAFT',
    createdAt: '2026-09-21',
    notes: 'Floor operator entry awaiting shift supervisor review. Reinforced corner packaging used for export shipment.',
    totalPackagingWeightKg: 38.5,
    perUnitPackagingWeightKg: 0.770,
    materials: [
      {
        id: 'MAT-REC-8',
        materialId: 'MAT-001',
        materialName: 'Cardboard Box',
        category: 'Paper/Cardboard',
        quantity: 50,
        unit: 'pcs',
        weight: 25,
        weightUnit: 'kg',
        weightKg: 25
      },
      {
        id: 'MAT-REC-9',
        materialId: 'MAT-004',
        materialName: 'Thermocol / EPS',
        category: 'Plastic',
        quantity: 7.5,
        unit: 'kg',
        weight: 7.5,
        weightUnit: 'kg',
        weightKg: 7.5
      },
      {
        id: 'MAT-REC-10',
        materialId: 'MAT-008',
        materialName: 'Foam Sheet',
        category: 'Plastic',
        quantity: 4.0,
        unit: 'kg',
        weight: 4.0,
        weightUnit: 'kg',
        weightKg: 4.0
      },
      {
        id: 'MAT-REC-11',
        materialId: 'MAT-007',
        materialName: 'Packaging Tape',
        category: 'Plastic',
        quantity: 2.0,
        unit: 'kg',
        weight: 2.0,
        weightUnit: 'kg',
        weightKg: 2.0
      }
    ],
    ppwrSummary: {
      paperCardboardKg: 25.0,
      paperCardboardPct: 64.94,
      plasticKg: 13.5,
      plasticPct: 35.06,
      otherKg: 0,
      otherPct: 0,
      totalPackagingWeightKg: 38.5,
      perUnitPackagingWeightKg: 0.770,
      avgRecyclablePct: 83.5,
      estimatedCo2eKg: 51.6
    }
  }
];
