import { Product, PackagingLineItem } from '../types';
import { MOCK_PACKAGING_INVENTORY } from '../data/mockData';

export interface CalculationResult {
  recommendedMaterials: PackagingLineItem[];
  perUnitTotalWeightKg: number;
  totalBatchWeightKg: number;
  ruleExplanations: string[];
}

/**
 * Packaging Calculation & Recommendation Engine (Top-Down Rule Engine)
 * Determines appropriate packaging material composition based on product physical attributes
 * (weight, dimensions, volume, fragility class).
 * Can be swapped for an external backend ML/Rules API in production.
 */
export class PackagingCalculationEngine {
  
  public calculatePackagingBOM(product: Product, quantity: number = 1): CalculationResult {
    const explanations: string[] = [];
    const items: PackagingLineItem[] = [];

    // 1. Box Selection based on Product Dimensions & Volume (Rule-Engine Matching)
    const { length, width, height } = product.dimensionsCm;
    let selectedBoxId = 'MAT-CB-M';
    let boxReason = '';

    if (length <= 25 && width <= 20 && height <= 15) {
      selectedBoxId = 'MAT-CB-S';
      boxReason = `Selected Small Box (25×20×15 cm) for compact product (${length}×${width}×${height} cm, ${product.volumeCm3} cm³).`;
    } else if (length <= 35 && width <= 25 && height <= 20) {
      selectedBoxId = 'MAT-CB-M';
      boxReason = `Selected Medium Box (35×25×20 cm) for standard product (${length}×${width}×${height} cm, ${product.volumeCm3} cm³).`;
    } else if (length <= 45 && width <= 30 && height <= 25) {
      selectedBoxId = 'MAT-CB-L';
      boxReason = `Selected Large Heavy-Duty Box (45×30×25 cm) for heavy/high-volume component (${length}×${width}×${height} cm, ${product.volumeCm3} cm³).`;
    } else {
      selectedBoxId = 'MAT-CB-XL';
      boxReason = `Selected Extra-Large Bulk Carton (60×40×35 cm) for oversized powertrain assembly (${length}×${width}×${height} cm).`;
    }

    const boxMaster = MOCK_PACKAGING_INVENTORY.find(m => m.id === selectedBoxId) 
      || MOCK_PACKAGING_INVENTORY.find(m => m.id === 'MAT-CB-M') 
      || MOCK_PACKAGING_INVENTORY[0];

    const boxWeightPerUnitKg = boxMaster.weightPerUnitKg;
    
    items.push({
      id: `calc-mat-box-${Date.now()}-1`,
      materialId: boxMaster.id,
      materialName: boxMaster.name,
      category: boxMaster.category,
      dimensions: boxMaster.dimensions || '35 × 25 × 20 cm',
      quantity: quantity * 1, // 1 pc per unit
      unit: 'pcs',
      weight: parseFloat((quantity * boxWeightPerUnitKg).toFixed(3)),
      weightUnit: 'kg',
      weightKg: parseFloat((quantity * boxWeightPerUnitKg).toFixed(3)),
      isSystemGenerated: true,
      notes: `${boxMaster.dimensions} carton (${boxReason})`
    });
    explanations.push(`Box Dimension Matching: ${boxReason} (Tare mass: ${boxWeightPerUnitKg} kg/box).`);

    // 2. Paper Cushioning (Void Fill & Shock Buffer)
    // For GA-102 (8kg) -> 120g (0.12kg) per unit
    const cushionMaster = MOCK_PACKAGING_INVENTORY.find(m => m.id === 'MAT-003') || MOCK_PACKAGING_INVENTORY[2];
    let cushionPerUnitG = 120; // default for ~8kg
    if (product.weightKg >= 10) cushionPerUnitG = 180;
    else if (product.weightKg <= 2) cushionPerUnitG = 60;
    else if (product.weightKg <= 5) cushionPerUnitG = 90;

    const cushionPerUnitKg = cushionPerUnitG / 1000;
    const totalCushionKg = parseFloat((quantity * cushionPerUnitKg).toFixed(3));

    items.push({
      id: `calc-mat-cushion-${Date.now()}-2`,
      materialId: cushionMaster.id,
      materialName: cushionMaster.name,
      category: cushionMaster.category,
      dimensions: cushionMaster.dimensions || 'Void-Fill Cushioning Buffer',
      quantity: totalCushionKg,
      unit: 'kg',
      weight: totalCushionKg,
      weightUnit: 'kg',
      weightKg: totalCushionKg,
      isSystemGenerated: true,
      notes: `Calculated paper void fill at ${cushionPerUnitG}g/unit based on container void volume.`
    });
    explanations.push(`Cushioning Density: Calculated ${cushionPerUnitG}g paper void fill per unit to fill ${Math.round(product.volumeCm3 * 0.35)} cm³ void buffer.`);

    // 3. Thermocol / EPS Shock Absorber
    // For GA-102 (8kg) -> 80g (0.08kg) per unit
    const epsMaster = MOCK_PACKAGING_INVENTORY.find(m => m.id === 'MAT-004') || MOCK_PACKAGING_INVENTORY[3];
    let epsPerUnitG = 80;
    if (product.weightKg >= 10 || product.fragility === 'High') epsPerUnitG = 150;
    else if (product.weightKg <= 3 && product.fragility === 'Low') epsPerUnitG = 40;
    else if (product.fragility === 'Low') epsPerUnitG = 50;

    const epsPerUnitKg = epsPerUnitG / 1000;
    const totalEpsKg = parseFloat((quantity * epsPerUnitKg).toFixed(3));

    items.push({
      id: `calc-mat-eps-${Date.now()}-3`,
      materialId: epsMaster.id,
      materialName: epsMaster.name,
      category: epsMaster.category,
      dimensions: epsMaster.dimensions || 'Contour End-Caps (2x Molded Blocks)',
      quantity: totalEpsKg,
      unit: 'kg',
      weight: totalEpsKg,
      weightUnit: 'kg',
      weightKg: totalEpsKg,
      isSystemGenerated: true,
      notes: `Rigid end-cap shock absorption at ${epsPerUnitG}g/unit to isolate heavy gear mesh.`
    });
    explanations.push(`Rigid Protection: Allocated ${epsPerUnitG}g EPS structural support blocks for ${product.fragility} fragility classification.`);

    // 4. Packaging Tape
    // For GA-102 -> 25g (0.025kg) per unit
    const tapeMaster = MOCK_PACKAGING_INVENTORY.find(m => m.id === 'MAT-007') || MOCK_PACKAGING_INVENTORY[6];
    // Seam length approximation: 2 * (L + W) = 2 * (30 + 20) = 100cm seam -> ~25g BOPP tape
    const seamLengthCm = 2 * (product.dimensionsCm.length + product.dimensionsCm.width);
    const tapePerUnitG = Math.max(15, Math.round(seamLengthCm * 0.25)); // 25g for 100cm
    const tapePerUnitKg = tapePerUnitG / 1000;
    const totalTapeKg = parseFloat((quantity * tapePerUnitKg).toFixed(3));

    items.push({
      id: `calc-mat-tape-${Date.now()}-4`,
      materialId: tapeMaster.id,
      materialName: tapeMaster.name,
      category: tapeMaster.category,
      dimensions: `${seamLengthCm} cm Seam (50 mm Width)`,
      quantity: totalTapeKg,
      unit: 'kg',
      weight: totalTapeKg,
      weightUnit: 'kg',
      weightKg: totalTapeKg,
      isSystemGenerated: true,
      notes: `Triple-H carton seam sealing tape (${seamLengthCm}cm total seam perimeter).`
    });
    explanations.push(`Sealing Requirement: Calculated ${tapePerUnitG}g BOPP pressure adhesive tape based on carton seam perimeter (${seamLengthCm} cm).`);

    // Calculate totals
    const totalBatchWeightKg = parseFloat(items.reduce((sum, item) => sum + item.weightKg, 0).toFixed(3));
    const perUnitTotalWeightKg = quantity > 0 ? parseFloat((totalBatchWeightKg / quantity).toFixed(4)) : 0;

    return {
      recommendedMaterials: items,
      perUnitTotalWeightKg,
      totalBatchWeightKg,
      ruleExplanations: explanations
    };
  }
}

export const calculationEngine = new PackagingCalculationEngine();
