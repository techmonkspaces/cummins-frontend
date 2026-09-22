import { PackagingMaterialMaster, MaterialCategory } from '../types';
import { MOCK_PACKAGING_INVENTORY } from '../data/mockData';

/**
 * Packaging Inventory Service (API Boundary)
 * Provides access to Packaging Inventory Master. In production, interfaces with Warehouse / ERP API.
 */
class InventoryService {
  private materials: PackagingMaterialMaster[] = [...MOCK_PACKAGING_INVENTORY];

  async getMaterials(): Promise<PackagingMaterialMaster[]> {
    return [...this.materials];
  }

  async getMaterialById(id: string): Promise<PackagingMaterialMaster | undefined> {
    return this.materials.find(m => m.id === id);
  }

  async addMaterial(material: PackagingMaterialMaster): Promise<PackagingMaterialMaster> {
    this.materials = [material, ...this.materials];
    return material;
  }

  async getMaterialsByCategory(category: MaterialCategory): Promise<PackagingMaterialMaster[]> {
    return this.materials.filter(m => m.category === category);
  }

  getCategories(): MaterialCategory[] {
    return ['Paper/Cardboard', 'Paper', 'Plastic', 'Wood', 'Metal', 'Other'];
  }
}

export const inventoryService = new InventoryService();
