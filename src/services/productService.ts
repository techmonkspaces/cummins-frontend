import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

/**
 * Product Service (API Boundary)
 * Provides product catalog access. In production, this interfaces with Cummins Product Master API.
 */
class ProductService {
  private products: Product[] = [...MOCK_PRODUCTS];

  async getProducts(): Promise<Product[]> {
    // Simulating API async behavior
    return [...this.products];
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return this.products.find(p => p.sku.toLowerCase() === sku.toLowerCase());
  }

  async addProduct(product: Product): Promise<Product> {
    this.products = [product, ...this.products];
    return product;
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    return this.products.filter(p => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesCategory = !category || category === 'All' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }

  getCategories(): string[] {
    const set = new Set(this.products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }
}

export const productService = new ProductService();
