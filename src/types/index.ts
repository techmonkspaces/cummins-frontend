export type RecordingMethod = 'INVENTORY' | 'CALCULATED' | 'USER_INPUT';
export type RecordStatus = 'DRAFT' | 'CONFIRMED';
export type MaterialCategory = 'Paper/Cardboard' | 'Paper' | 'Plastic' | 'Wood' | 'Metal' | 'Other';

export interface Product {
  sku: string;
  name: string;
  category: string;
  weightKg: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };
  volumeCm3: number;
  fragility: 'Low' | 'Medium' | 'High' | 'Heavy Duty';
  defaultBatchSize: number;
  imageUrl?: string;
  description: string;
}

export interface PackagingMaterialMaster {
  id: string;
  name: string;
  category: MaterialCategory;
  packagingClass?: 'Primary' | 'Secondary' | 'Tertiary';
  useType?: 'Single-Use' | 'Reusable';
  availableStock: number;
  stockUnit: 'pcs' | 'kg' | 'm' | 'rolls';
  weightPerUnitKg: number; // Conversion weight to kg per stockUnit
  unitName: string;
  dimensions?: string; // e.g. "35 × 25 × 20 cm" or "50 mm × 66 m"
  recycledContentPct: number;
  recyclable: boolean;
  ppwrMaterialCode: string;
  co2PerKg: number;
  description: string;
}

export interface PackagingLineItem {
  id: string; // unique item id in the record
  materialId: string;
  materialName: string;
  category: MaterialCategory;
  packagingClass?: 'Primary' | 'Secondary' | 'Tertiary';
  useType?: 'Single-Use' | 'Reusable';
  dimensions?: string;
  quantity: number;
  unit: string;
  weight: number; // calculated total weight for this line in weightUnit
  weightUnit: 'kg' | 'g';
  weightKg: number; // standardized in kg for aggregations
  isSystemGenerated?: boolean;
  notes?: string;
}

export interface PpwrSummaryBreakdown {
  paperCardboardKg: number;
  paperCardboardPct: number;
  plasticKg: number;
  plasticPct: number;
  otherKg: number;
  otherPct: number;
  totalPackagingWeightKg: number;
  perUnitPackagingWeightKg: number;
  avgRecyclablePct: number;
  estimatedCo2eKg: number;
}

export interface Plant {
  id: string; // e.g. "PLANT-PUNE", "PLANT-PHALTAN", "PLANT-JAMSHEDPUR"
  name: string;
  shortName: string;
  code: string; // e.g. "IN-PUN-01"
  location: string;
  country: string;
  configuredMethod: RecordingMethod;
  primaryErpSystem: 'SAP S/4HANA (PP/MM)' | 'SAP EWM' | 'Oracle WMS';
  description: string;
  activeSkus: string[];
  managerName: string;
  roleTitle: string;
  usersCount?: number;
  recordsCount?: number;
  status?: 'Active' | 'Under Maintenance';
}

export type UserRoleType = 'SUPER_ADMIN' | 'FACTORY_MANAGER' | 'DATA_ENTRY';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  roleTitle: string;
  plantId: string;
  plantName: string;
  configuredMethod: RecordingMethod;
  isGlobalAdmin?: boolean;
  department?: string;
  permissions: {
    canConfigurePlants: boolean;
    canManageCatalog: boolean;
    canApproveRecords: boolean;
    canDeleteRecords: boolean;
    canExportPpwr: boolean;
    canSwitchPlants: boolean;
  };
}

export interface PackagingRuleDefinition {
  id: string;
  category: 'FACTORY' | 'PRODUCT_CLASS' | 'MATERIAL' | 'SKU_OVERRIDE';
  name: string;
  target: string;
  condition: string;
  action: string;
  priority: number;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
}

export interface PackagingRecord {
  id: string; // e.g., "PR-1001"
  productId: string;
  productName: string;
  productSku: string;
  productQuantity: number;
  method: RecordingMethod;
  plantId?: string;
  plantName?: string;
  materials: PackagingLineItem[];
  totalPackagingWeightKg: number;
  perUnitPackagingWeightKg: number;
  status: RecordStatus;
  period?: string; // e.g. "2026-W38 (Sep 15 - Sep 21)" for Inventory method
  batchId?: string;
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  operatorId?: string;
  ppwrSummary: PpwrSummaryBreakdown;
}

export interface InventoryMethodInput {
  period: string;
  productQuantity: number;
  consumedMaterials: {
    materialId: string;
    consumedQuantity: number;
    unit: string;
  }[];
}

export interface CalculationRuleOutput {
  suggestedBox: {
    materialId: string;
    name: string;
    quantity: number;
    unit: string;
    weightKg: number;
  };
  suggestedCushioning: {
    materialId: string;
    name: string;
    quantity: number;
    unit: string;
    weightKg: number;
  };
  suggestedThermocol: {
    materialId: string;
    name: string;
    quantity: number;
    unit: string;
    weightKg: number;
  };
  suggestedTape: {
    materialId: string;
    name: string;
    quantity: number;
    unit: string;
    weightKg: number;
  };
  extraProtections: Array<{
    materialId: string;
    name: string;
    quantity: number;
    unit: string;
    weightKg: number;
  }>;
  ruleExplanation: string[];
}

export interface DashboardKPIs {
  totalProductsPacked: number;
  totalPackagingWeightKg: number;
  cardboardConsumptionKg: number;
  plasticConsumptionKg: number;
  paperConsumptionKg: number;
  otherConsumptionKg: number;
  methodBreakdown: {
    inventory: number;
    calculated: number;
    userInput: number;
  };
  recordsRequiringReview: number;
  totalRecordsCount: number;
  complianceReadinessPct: number;
}

