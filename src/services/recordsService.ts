import { 
  PackagingRecord, 
  PackagingLineItem, 
  PpwrSummaryBreakdown, 
  RecordingMethod, 
  RecordStatus, 
  DashboardKPIs,
  Product 
} from '../types';
import { INITIAL_PACKAGING_RECORDS, MOCK_PACKAGING_INVENTORY } from '../data/mockData';

const STORAGE_KEY = 'cummins_ppwr_packaging_records_v1';

class RecordsService {
  private records: PackagingRecord[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.records = JSON.parse(stored);
      } else {
        this.records = [...INITIAL_PACKAGING_RECORDS];
        this.saveToStorage();
      }
    } catch {
      this.records = [...INITIAL_PACKAGING_RECORDS];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
    } catch (e) {
      console.error('Failed to persist records to localStorage', e);
    }
  }

  public getRecords(): PackagingRecord[] {
    return [...this.records];
  }

  public getRecordById(id: string): PackagingRecord | undefined {
    return this.records.find(r => r.id === id);
  }

  public calculatePpwrSummary(
    materials: PackagingLineItem[], 
    productQuantity: number
  ): PpwrSummaryBreakdown {
    let paperCardboardKg = 0;
    let plasticKg = 0;
    let otherKg = 0;
    let totalKg = 0;
    let totalRecycledWeight = 0;
    let totalCo2e = 0;

    materials.forEach(item => {
      const itemWeight = item.weightKg || 0;
      totalKg += itemWeight;

      const master = MOCK_PACKAGING_INVENTORY.find(m => m.id === item.materialId);
      const recycledPct = master?.recycledContentPct ?? 50;
      const co2Factor = master?.co2PerKg ?? 1.5;

      totalRecycledWeight += itemWeight * (recycledPct / 100);
      totalCo2e += itemWeight * co2Factor;

      if (item.category === 'Paper/Cardboard' || item.category === 'Paper') {
        paperCardboardKg += itemWeight;
      } else if (item.category === 'Plastic') {
        plasticKg += itemWeight;
      } else {
        otherKg += itemWeight;
      }
    });

    const safeTotal = totalKg > 0 ? totalKg : 1;
    const paperCardboardPct = totalKg > 0 ? (paperCardboardKg / safeTotal) * 100 : 0;
    const plasticPct = totalKg > 0 ? (plasticKg / safeTotal) * 100 : 0;
    const otherPct = totalKg > 0 ? (otherKg / safeTotal) * 100 : 0;
    const avgRecyclablePct = totalKg > 0 ? (totalRecycledWeight / safeTotal) * 100 : 0;
    const perUnitPackagingWeightKg = productQuantity > 0 ? totalKg / productQuantity : 0;

    return {
      paperCardboardKg: parseFloat(paperCardboardKg.toFixed(3)),
      paperCardboardPct: parseFloat(paperCardboardPct.toFixed(1)),
      plasticKg: parseFloat(plasticKg.toFixed(3)),
      plasticPct: parseFloat(plasticPct.toFixed(1)),
      otherKg: parseFloat(otherKg.toFixed(3)),
      otherPct: parseFloat(otherPct.toFixed(1)),
      totalPackagingWeightKg: parseFloat(totalKg.toFixed(3)),
      perUnitPackagingWeightKg: parseFloat(perUnitPackagingWeightKg.toFixed(4)),
      avgRecyclablePct: parseFloat(avgRecyclablePct.toFixed(1)),
      estimatedCo2eKg: parseFloat(totalCo2e.toFixed(2))
    };
  }

  public createRecord(params: {
    product: Product;
    productQuantity: number;
    method: RecordingMethod;
    materials: PackagingLineItem[];
    status: RecordStatus;
    period?: string;
    notes?: string;
  }): PackagingRecord {
    const nextNum = 1001 + this.records.length;
    const id = `PR-${nextNum}`;
    const today = new Date().toISOString().split('T')[0];

    const ppwrSummary = this.calculatePpwrSummary(params.materials, params.productQuantity);

    const newRecord: PackagingRecord = {
      id,
      productId: params.product.sku,
      productName: params.product.name,
      productSku: params.product.sku,
      productQuantity: params.productQuantity,
      method: params.method,
      materials: params.materials,
      totalPackagingWeightKg: ppwrSummary.totalPackagingWeightKg,
      perUnitPackagingWeightKg: ppwrSummary.perUnitPackagingWeightKg,
      status: params.status,
      period: params.period,
      notes: params.notes,
      createdAt: today,
      confirmedAt: params.status === 'CONFIRMED' ? today : undefined,
      operatorId: 'OP-7749 (Line A)',
      ppwrSummary
    };

    this.records = [newRecord, ...this.records];
    this.saveToStorage();
    return newRecord;
  }

  public updateRecordStatus(id: string, status: RecordStatus): PackagingRecord | undefined {
    const record = this.records.find(r => r.id === id);
    if (record) {
      record.status = status;
      if (status === 'CONFIRMED') {
        record.confirmedAt = new Date().toISOString().split('T')[0];
      }
      this.saveToStorage();
    }
    return record;
  }

  public deleteRecord(id: string): boolean {
    const prevLen = this.records.length;
    this.records = this.records.filter(r => r.id !== id);
    if (this.records.length !== prevLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public resetToMockData(): void {
    this.records = [...INITIAL_PACKAGING_RECORDS];
    this.saveToStorage();
  }

  public getDashboardKPIs(): DashboardKPIs {
    let totalProductsPacked = 0;
    let totalPackagingWeightKg = 0;
    let cardboardConsumptionKg = 0;
    let plasticConsumptionKg = 0;
    let paperConsumptionKg = 0;
    let otherConsumptionKg = 0;
    let recordsRequiringReview = 0;

    const methodBreakdown = {
      inventory: 0,
      calculated: 0,
      userInput: 0
    };

    this.records.forEach(r => {
      totalProductsPacked += r.productQuantity;
      totalPackagingWeightKg += r.totalPackagingWeightKg;
      
      if (r.status === 'DRAFT') {
        recordsRequiringReview++;
      }

      if (r.method === 'INVENTORY') methodBreakdown.inventory++;
      else if (r.method === 'CALCULATED') methodBreakdown.calculated++;
      else if (r.method === 'USER_INPUT') methodBreakdown.userInput++;

      r.materials.forEach(item => {
        if (item.category === 'Paper/Cardboard') {
          cardboardConsumptionKg += item.weightKg;
        } else if (item.category === 'Paper') {
          paperConsumptionKg += item.weightKg;
        } else if (item.category === 'Plastic') {
          plasticConsumptionKg += item.weightKg;
        } else {
          otherConsumptionKg += item.weightKg;
        }
      });
    });

    const confirmedCount = this.records.filter(r => r.status === 'CONFIRMED').length;
    const complianceReadinessPct = this.records.length > 0 
      ? Math.round((confirmedCount / this.records.length) * 100) 
      : 100;

    return {
      totalProductsPacked,
      totalPackagingWeightKg: parseFloat(totalPackagingWeightKg.toFixed(2)),
      cardboardConsumptionKg: parseFloat(cardboardConsumptionKg.toFixed(2)),
      plasticConsumptionKg: parseFloat(plasticConsumptionKg.toFixed(2)),
      paperConsumptionKg: parseFloat(paperConsumptionKg.toFixed(2)),
      otherConsumptionKg: parseFloat(otherConsumptionKg.toFixed(2)),
      methodBreakdown,
      recordsRequiringReview,
      totalRecordsCount: this.records.length,
      complianceReadinessPct
    };
  }

  public exportPpwrJson(records?: PackagingRecord[]): string {
    const list = records || this.records;
    const payload = {
      exportMetadata: {
        system: "Cummins PPWR Data Capture Engine",
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        standard: "EU Packaging and Packaging Waste Regulation (PPWR) 2024/0000",
        targetPlatform: "IntegrityNext Enterprise Compliance Hub",
        organizationUnit: "Cummins Industrial Powertrain & Filtration"
      },
      records: list.map(r => ({
        recordId: r.id,
        status: r.status,
        method: r.method,
        createdAt: r.createdAt,
        confirmedAt: r.confirmedAt,
        product: {
          sku: r.productSku,
          name: r.productName,
          quantityPacked: r.productQuantity
        },
        packagingSummary: {
          totalWeightKg: r.totalPackagingWeightKg,
          perUnitWeightKg: r.perUnitPackagingWeightKg,
          materialFractions: {
            paperCardboardKg: r.ppwrSummary.paperCardboardKg,
            plasticKg: r.ppwrSummary.plasticKg,
            otherKg: r.ppwrSummary.otherKg
          },
          recycledContentPct: r.ppwrSummary.avgRecyclablePct,
          carbonFootprintEstimateKgCo2e: r.ppwrSummary.estimatedCo2eKg
        },
        billOfMaterials: r.materials.map(m => ({
          materialId: m.materialId,
          name: m.materialName,
          category: m.category,
          quantity: m.quantity,
          unit: m.unit,
          calculatedWeightKg: m.weightKg
        }))
      }))
    };
    return JSON.stringify(payload, null, 2);
  }

  public exportCsv(records?: PackagingRecord[]): string {
    const list = records || this.records;
    const headers = [
      'Record ID',
      'Status',
      'Method',
      'Product SKU',
      'Product Name',
      'Qty Packed',
      'Total Packaging Wt (kg)',
      'Per Unit Wt (kg)',
      'Paper/Cardboard (kg)',
      'Plastic (kg)',
      'Recycled Content %',
      'Est CO2e (kg)',
      'Date Created'
    ];

    const rows = list.map(r => [
      r.id,
      r.status,
      r.method,
      `"${r.productSku}"`,
      `"${r.productName}"`,
      r.productQuantity,
      r.totalPackagingWeightKg,
      r.perUnitPackagingWeightKg,
      r.ppwrSummary.paperCardboardKg,
      r.ppwrSummary.plasticKg,
      r.ppwrSummary.avgRecyclablePct,
      r.ppwrSummary.estimatedCo2eKg,
      r.createdAt
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

export const recordsService = new RecordsService();
