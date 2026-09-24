import { PackagingMaterialMaster, MaterialCategory } from '../types';
import { MOCK_PACKAGING_INVENTORY } from '../data/mockData';

const INVENTORY_STORAGE_KEY = 'cummins_ppwr_inventory_stock_v2';

export interface StockDeductionResult {
  materialId: string;
  materialName: string;
  unit: string;
  previousStock: number;
  deductedQty: number;
  remainingStock: number;
}

/**
 * Packaging Inventory Service
 * Manages material inventory, standard dimension master data, and live stock deductions.
 */
class InventoryService {
  private materials: PackagingMaterialMaster[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (stored) {
        const loaded: PackagingMaterialMaster[] = JSON.parse(stored);
        // Ensure any new catalog items from MOCK_PACKAGING_INVENTORY exist
        const merged = [...loaded];
        MOCK_PACKAGING_INVENTORY.forEach(m => {
          if (!merged.some(item => item.id === m.id)) {
            merged.push(m);
          }
        });
        this.materials = merged;
      } else {
        this.materials = [...MOCK_PACKAGING_INVENTORY];
        this.save();
      }
    } catch {
      this.materials = [...MOCK_PACKAGING_INVENTORY];
    }
  }

  private save() {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(this.materials));
    } catch (e) {
      console.error('Failed to save inventory to storage', e);
    }
  }

  public getMaterials(): PackagingMaterialMaster[] {
    return [...this.materials];
  }

  public getMaterialById(id: string): PackagingMaterialMaster | undefined {
    return this.materials.find(m => m.id === id);
  }

  public addMaterial(material: PackagingMaterialMaster): PackagingMaterialMaster {
    this.materials = [material, ...this.materials];
    this.save();
    return material;
  }

  public deductStock(items: { materialId: string; quantity: number }[]): StockDeductionResult[] {
    const results: StockDeductionResult[] = [];

    items.forEach(item => {
      const target = this.materials.find(m => m.id === item.materialId);
      if (target) {
        const prevStock = target.availableStock;
        const deducted = Number(item.quantity) || 0;
        const remaining = Math.max(0, parseFloat((prevStock - deducted).toFixed(2)));
        target.availableStock = remaining;

        results.push({
          materialId: target.id,
          materialName: target.name,
          unit: target.stockUnit,
          previousStock: prevStock,
          deductedQty: deducted,
          remainingStock: remaining
        });
      }
    });

    this.save();
    return results;
  }

  public resetInventory(): void {
    this.materials = [...MOCK_PACKAGING_INVENTORY];
    this.save();
  }

  public getCategories(): MaterialCategory[] {
    return ['Paper/Cardboard', 'Paper', 'Plastic', 'Wood', 'Metal', 'Other'];
  }
}

export const inventoryService = new InventoryService();
