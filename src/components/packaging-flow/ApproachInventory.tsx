import React, { useState } from 'react';
import {
  Database,
  Calculator,
  Calendar,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster, CUMMINS_DESTINATION_COUNTRIES, RecordStatus } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockData';

export interface BatchSkuRecordPayload {
  product: Product;
  productQuantity: number;
  materials: PackagingLineItem[];
  destinationCountry: string;
  period: string;
  notes: string;
  status: RecordStatus;
}

interface ApproachInventoryProps {
  product?: Product;
  availableMaterials: PackagingMaterialMaster[];
  onCommitBatch?: (records: BatchSkuRecordPayload[]) => void;
  onComplete?: (data: {
    productQuantity: number;
    period: string;
    materials: PackagingLineItem[];
    destinationCountry?: string;
    notes?: string;
  }) => void;
  onBack: () => void;
}

// Factory Multi-SKU Production Volume for the Reconciliation Period (matching client Excel model)
interface SkuProductionRow {
  sku: string;
  name: string;
  units: number;
  unitWeightKg: number;
  totalProductWeightKg: number;
}

const FACTORY_SKU_PRODUCTION: SkuProductionRow[] = [
  { sku: 'GA-102', name: 'Gear Assembly', units: 1000, unitWeightKg: 8.0, totalProductWeightKg: 8000 },
  { sku: 'BP-201', name: 'Brake Assembly Pack', units: 500, unitWeightKg: 5.5, totalProductWeightKg: 2750 },
  { sku: 'TR-305', name: 'Turbo Rotor Pack', units: 300, unitWeightKg: 12.0, totalProductWeightKg: 3600 },
  { sku: 'IN-108', name: 'Fuel Injector Pack', units: 1200, unitWeightKg: 1.4, totalProductWeightKg: 1680 },
];

export const ApproachInventory: React.FC<ApproachInventoryProps> = ({
  product: initialProduct,
  availableMaterials,
  onCommitBatch,
  onComplete,
  onBack,
}) => {
  const product = initialProduct || MOCK_PRODUCTS[0];
  const [period, setPeriod] = useState('September 2026');
  const [destinationCountry, setDestinationCountry] = useState<string>('Germany');
  const [notes, setNotes] = useState('Automated inventory batch deduction. Reconciled via SAP S/4HANA MVT 261.');

  // Actual Plant Factory Packaging Consumption for the Period (SAP Goods Issues)
  const factoryPackagingConsumed = [
    { id: 'MAT-001', name: 'Cardboard Box', category: 'Paper/Cardboard', totalUsedKg: 500, color: '#0F172A' },
    { id: 'MAT-003', name: 'Kraft Paper Cushioning', category: 'Paper', totalUsedKg: 80, color: '#475569' },
    { id: 'MAT-007', name: 'Packaging Seam Tape', category: 'Plastic', totalUsedKg: 20, color: '#64748B' },
  ];

  const totalPlantPackagingKg = factoryPackagingConsumed.reduce((sum, item) => sum + item.totalUsedKg, 0);

  // Total Factory Products Net Mass (kg) across all SKUs produced
  const totalPlantProductNetKg = FACTORY_SKU_PRODUCTION.reduce((sum, row) => sum + row.totalProductWeightKg, 0);
  const totalPlantUnits = FACTORY_SKU_PRODUCTION.reduce((sum, row) => sum + row.units, 0);
  const totalRatePerKg = totalPlantPackagingKg / totalPlantProductNetKg;

  const handleCommitAll = (status: RecordStatus = 'CONFIRMED') => {
    const payloads: BatchSkuRecordPayload[] = FACTORY_SKU_PRODUCTION.map((row) => {
      const prodMatch: Product = MOCK_PRODUCTS.find(p => p.sku === row.sku) || {
        ...MOCK_PRODUCTS[0],
        sku: row.sku,
        name: row.name,
        weightKg: row.unitWeightKg,
        defaultBatchSize: row.units
      };

      const lineItems: PackagingLineItem[] = factoryPackagingConsumed.map((mat) => {
        const rate = mat.totalUsedKg / totalPlantProductNetKg;
        const perUnitKg = row.unitWeightKg * rate;
        const totalMatKg = Number((perUnitKg * row.units).toFixed(2));

        return {
          id: `line-${row.sku}-${mat.id}-${Date.now()}`,
          materialId: mat.id,
          materialName: mat.name,
          category: mat.category as any,
          quantity: totalMatKg,
          unit: 'kg',
          weight: totalMatKg,
          weightUnit: 'kg',
          weightKg: totalMatKg,
          isSystemGenerated: true,
          notes: `Inventory Proportional Allocation (${period}) — ${(perUnitKg * 1000).toFixed(1)} g/unit`
        };
      });

      return {
        product: prodMatch,
        productQuantity: row.units,
        materials: lineItems,
        destinationCountry,
        period,
        notes: `Inventory Reconciliation Period ${period}. Reconciled via SAP S/4HANA MVT 261 across ${totalPlantUnits.toLocaleString()} factory units.`,
        status
      };
    });

    if (onCommitBatch) {
      onCommitBatch(payloads);
    } else if (onComplete) {
      // Fallback single SKU
      const first = payloads[0];
      onComplete({
        productQuantity: first.productQuantity,
        period,
        materials: first.materials,
        destinationCountry,
        notes
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>

      {/* Minimalist Top Context Header */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          padding: '1.1rem 1.5rem',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #DA291C',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', background: '#F1F5F9', padding: '2px 7px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              APPROACH A
            </span>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Plant-Wide Packaging Reconciliation (Multi-SKU Mass Allocation)
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#0F172A', fontWeight: 700, background: '#F1F5F9', padding: '2px 7px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              4 Active Plant SKUs
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px' }}>
            Total plant period packaging issues ({totalPlantPackagingKg} kg) allocated proportionally by product net mass across all 4 factory SKUs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
            Period: <strong style={{ color: '#0F172A' }}>{period}</strong>
          </div>
        </div>
      </div>

      {/* Reconciliation Period & Factory Output KPI Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.5rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1fr',
          gap: '1.25rem',
          alignItems: 'center'
        }}
      >
        <div>
          <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
            <Calendar size={12} color="#0F172A" />
            Reconciliation Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              padding: '0 8px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#0F172A',
              cursor: 'pointer'
            }}
          >
            <option value="September 2026">September 2026 (Active Cycle)</option>
            <option value="Q3 2026">Q3 2026 (Quarterly Close)</option>
            <option value="August 2026">August 2026 (Audited)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
            <Globe2 size={12} color="#0F172A" />
            Country Sold To
          </label>
          <select
            value={destinationCountry}
            onChange={(e) => setDestinationCountry(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              padding: '0 8px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#0F172A',
              cursor: 'pointer'
            }}
          >
            {CUMMINS_DESTINATION_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
            Total Plant Products Output
          </span>
          <div
            style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}
            data-tooltip="Auto-fetched from MES Line Output across all plant assembly stations"
          >
            {totalPlantUnits.toLocaleString()} Units
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
            4 Factory Active SKUs
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
            Total Product Net Mass
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
            {totalPlantProductNetKg.toLocaleString()} kg
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
            Σ (Units × Unit Weight)
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
            Total Packaging Deducted
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DA291C' }}>
            {totalPlantPackagingKg.toLocaleString()} kg
          </div>
          <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>
            {totalRatePerKg.toFixed(4)} kg pkg / kg product
          </div>
        </div>
      </div>

      {/* Section 1: Factory Level Total Packaging Deductions (ERP MVT-261) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={15} color="#0F172A" />
            <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              1. Total Plant Packaging Materials Consumed in Period (SAP S/4HANA Movement Type 261)
            </h3>
          </div>
        </div>

        <div style={{ padding: '0.75rem 1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Packaging Material</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total Quantity Used (kg)</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', textAlign: 'right' }}>Quantity used per kg of product sold</th>
              </tr>
            </thead>
            <tbody>
              {factoryPackagingConsumed.map((item) => {
                const rate = item.totalUsedKg / totalPlantProductNetKg;
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                      {item.name} <span style={{ fontSize: '0.7rem', color: '#64748B' }}>({item.id})</span>
                    </td>
                    <td style={{ padding: '9px 12px', fontSize: '0.76rem', color: '#64748B' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.84rem' }}>
                      {item.totalUsedKg.toLocaleString()} kg
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
                      {rate.toFixed(6)} kg/kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F8FAFC', borderTop: '2px solid #E2E8F0' }}>
                <td colSpan={2} style={{ padding: '9px 12px', fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>
                  Total Plant Packaging Batch
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '0.9rem' }}>
                  {totalPlantPackagingKg.toLocaleString()} kg
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  {totalRatePerKg.toFixed(6)} kg/kg
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Section 2: Proportional Packaging Allocation per SKU */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calculator size={15} color="#0F172A" />
            <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              2. SKU-Level Packaging Mass Allocation (All 4 Active Factory SKUs)
            </h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#0F172A', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #E2E8F0' }}>
            Mass-Proportional Ledger
          </span>
        </div>

        <div style={{ padding: '1rem 1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '940px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>SKU Code</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Product Name</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Units Produced</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Unit Net Weight</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total Net Mass</th>
                {factoryPackagingConsumed.map(mat => (
                  <th key={mat.id} style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                    {mat.name} (g/u)
                  </th>
                ))}
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Allocated Rate</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#DA291C', textTransform: 'uppercase', textAlign: 'right' }}>Total SKU Pkg Mass</th>
              </tr>
            </thead>
            <tbody>
              {FACTORY_SKU_PRODUCTION.map((row) => {
                let rowTotalPkgGrams = 0;

                const materialAllocations = factoryPackagingConsumed.map(mat => {
                  const rate = mat.totalUsedKg / totalPlantProductNetKg;
                  const perUnitGrams = row.unitWeightKg * rate * 1000;
                  rowTotalPkgGrams += perUnitGrams;
                  return { id: mat.id, perUnitGrams, color: mat.color };
                });

                const skuTotalPkgKg = (rowTotalPkgGrams * row.units) / 1000;

                return (
                  <tr
                    key={row.sku}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.8rem', color: '#0F172A' }}>
                      {row.sku}
                    </td>
                    <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                      {row.units.toLocaleString()}
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', color: '#64748B', fontSize: '0.82rem' }}>
                      {row.unitWeightKg.toFixed(1)} kg
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>
                      {row.totalProductWeightKg.toLocaleString()} kg
                    </td>
                    {materialAllocations.map(m => (
                      <td key={m.id} style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 700, color: '#475569', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        {m.perUnitGrams.toFixed(1)} g
                      </td>
                    ))}
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#475569', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
                      {rowTotalPkgGrams.toFixed(1)} g/unit
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#DA291C', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
                      {skuTotalPkgKg.toFixed(2)} kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F8FAFC', borderTop: '2px solid #CBD5E1' }}>
                <td colSpan={2} style={{ padding: '9px 10px', fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>
                  Total Factory Sum (All 4 SKUs)
                </td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '0.86rem' }}>
                  {totalPlantUnits.toLocaleString()}
                </td>
                <td></td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '0.86rem' }}>
                  {totalPlantProductNetKg.toLocaleString()} kg
                </td>
                {factoryPackagingConsumed.map(mat => (
                  <td key={mat.id} style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>
                    {mat.totalUsedKg} kg
                  </td>
                ))}
                <td></td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#DA291C', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                  {totalPlantPackagingKg.toFixed(2)} kg
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Reconciliation Formula Footer */}
          <div style={{ marginTop: '0.85rem', background: '#F8FAFC', borderRadius: '6px', padding: '8px 12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calculator size={13} color="#0F172A" />
            <span style={{ fontSize: '0.74rem', color: '#475569' }}>
              Reconciliation Formula: <strong>Allocated Material per Unit (g) = Unit Net Weight (kg) × (Period Material Consumption ÷ Total Plant Product Net Mass) × 1000</strong>
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm">
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => handleCommitAll('DRAFT')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <span>Save Draft (4 SKUs)</span>
            </button>

            <button
              onClick={() => handleCommitAll('CONFIRMED')}
              className="btn btn-primary"
              style={{ padding: '8px 22px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <CheckCircle2 size={16} />
              <span>Commit All 4 Reconciled SKU Records to Ledger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
