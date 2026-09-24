import React, { useState } from 'react';
import {
  Database,
  ArrowRight,
  Calculator,
  Calendar,
  PackageCheck,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Boxes,
  FileSpreadsheet
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockData';

interface ApproachInventoryProps {
  product: Product;
  availableMaterials: PackagingMaterialMaster[];
  onComplete: (data: {
    productQuantity: number;
    period: string;
    materials: PackagingLineItem[];
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
  onComplete,
  onBack,
}) => {
  const product = initialProduct || MOCK_PRODUCTS[0];
  const [period, setPeriod] = useState('September 2026');
  const [notes, setNotes] = useState('Automated inventory batch deduction. Reconciled via SAP S/4HANA MVT 261.');

  // Actual Plant Factory Packaging Consumption for the Period (SAP Goods Issues)
  const factoryPackagingConsumed = [
    { id: 'MAT-001', name: 'Cardboard Box', category: 'Paper/Cardboard', totalUsedKg: 500, color: '#0284C7' },
    { id: 'MAT-003', name: 'Kraft Paper Cushioning', category: 'Paper', totalUsedKg: 80, color: '#059669' },
    { id: 'MAT-007', name: 'Packaging Seam Tape', category: 'Plastic', totalUsedKg: 20, color: '#7C3AED' },
  ];

  const totalPlantPackagingKg = factoryPackagingConsumed.reduce((sum, item) => sum + item.totalUsedKg, 0);

  // Total Factory Products Net Mass (kg) across all SKUs produced
  const totalPlantProductNetKg = FACTORY_SKU_PRODUCTION.reduce((sum, row) => sum + row.totalProductWeightKg, 0);
  const totalPlantUnits = FACTORY_SKU_PRODUCTION.reduce((sum, row) => sum + row.units, 0);
  const totalRatePerKg = totalPlantPackagingKg / totalPlantProductNetKg;

  // Selected Target Product specific allocation
  const currentSkuRow = FACTORY_SKU_PRODUCTION.find(s => s.sku === product.sku) || FACTORY_SKU_PRODUCTION[0];
  const targetProductAllocatedKg = currentSkuRow.totalProductWeightKg * totalRatePerKg;
  const targetPerUnitGrams = (targetProductAllocatedKg / currentSkuRow.units) * 1000;

  const handleProceed = () => {
    const lineItems: PackagingLineItem[] = factoryPackagingConsumed.map((mat) => {
      const rate = mat.totalUsedKg / totalPlantProductNetKg;
      const skuAllocatedKg = Number((currentSkuRow.totalProductWeightKg * rate).toFixed(2));

      return {
        id: `line-${mat.id}-${Date.now()}`,
        materialId: mat.id,
        materialName: mat.name,
        category: mat.category as any,
        quantity: skuAllocatedKg,
        unit: 'kg',
        weight: skuAllocatedKg,
        weightUnit: 'kg',
        weightKg: skuAllocatedKg,
        isSystemGenerated: true,
        notes: `Inventory Proportional Allocation (${period})`
      };
    });

    onComplete({
      productQuantity: currentSkuRow.units,
      period,
      materials: lineItems,
      notes
    });
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
          borderLeft: '4px solid #0284C7',
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#0284C7', background: '#F0F9FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #BAE6FD' }}>
              {product.sku}
            </span>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {product.name}
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              ({product.weightKg} kg unit net mass)
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px' }}>
            Multi-SKU mass-proportional packaging allocation based on period factory goods issues and product net weights.
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
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
          alignItems: 'center'
        }}
      >
        <div>
          <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
            <Calendar size={12} color="#0284C7" />
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
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284C7' }}>
            {totalPlantPackagingKg.toLocaleString()} kg
          </div>
          <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
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
            <Database size={15} color="#0284C7" />
            <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              1. Total Plant Packaging Consumption (Period Batch Goods Issues)
            </h3>
          </div>
          {/* <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            SAP S/4HANA Material Movement 261
          </span> */}
        </div>

        <div style={{ padding: '1rem 1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Packaging Material</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total Quantity Used (kg)</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', textAlign: 'right' }}>Quantity used per kg of product sold</th>
              </tr>
            </thead>
            <tbody>
              {factoryPackagingConsumed.map((item) => {
                const rate = item.totalUsedKg / totalPlantProductNetKg;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '9px 12px', fontSize: '0.76rem', color: '#64748B' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.84rem' }}>
                      {item.totalUsedKg.toLocaleString()} kg
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: item.color, fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                      {rate.toFixed(6)} kg/kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F0F9FF', borderTop: '2px solid #BAE6FD' }}>
                <td colSpan={2} style={{ padding: '9px 12px', fontWeight: 800, color: '#0369A1', fontSize: '0.82rem' }}>
                  Total Plant Packaging Batch
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 900, color: '#0369A1', fontSize: '0.9rem' }}>
                  {totalPlantPackagingKg.toLocaleString()} kg
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 900, color: '#0284C7', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
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
            <Calculator size={15} color="#059669" />
            <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              2. SKU-Level Packaging Mass Allocation (Proportional to Product Net Mass)
            </h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, background: '#ECFDF5', padding: '2px 7px', borderRadius: '4px' }}>
            Mass-Proportional Ledger
          </span>
        </div>

        <div style={{ padding: '1rem 1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>SKU Code</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Product Name</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Units Sold / Produced</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Unit Net Weight</th>
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total Net Mass (kg)</th>
                {factoryPackagingConsumed.map(mat => (
                  <th key={mat.id} style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: mat.color, textTransform: 'uppercase', textAlign: 'right' }}>
                    {mat.name} (kg)
                  </th>
                ))}
                <th style={{ padding: '8px 10px', fontSize: '0.7rem', fontWeight: 700, color: '#DA291C', textTransform: 'uppercase', textAlign: 'right' }}>Allocated Packaging (g/unit)</th>
              </tr>
            </thead>
            <tbody>
              {FACTORY_SKU_PRODUCTION.map((row) => {
                const isCurrent = row.sku === product.sku;
                let rowTotalPkgKg = 0;

                const materialAllocations = factoryPackagingConsumed.map(mat => {
                  const rate = mat.totalUsedKg / totalPlantProductNetKg;
                  const allocKg = row.totalProductWeightKg * rate;
                  rowTotalPkgKg += allocKg;
                  return { id: mat.id, allocKg, color: mat.color };
                });

                const perUnitAllocGrams = (rowTotalPkgKg / row.units) * 1000;

                return (
                  <tr
                    key={row.sku}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: isCurrent ? '#F0F9FF' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.8rem', color: isCurrent ? '#0284C7' : '#0F172A' }}>
                      {row.sku}
                      {isCurrent && (
                        <span style={{ marginLeft: '6px', fontSize: '0.62rem', background: '#0284C7', color: '#FFFFFF', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                          TARGET
                        </span>
                      )}
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
                      <td key={m.id} style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 700, color: m.color, fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        {m.allocKg.toFixed(1)} kg
                      </td>
                    ))}
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#DA291C', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
                      {perUnitAllocGrams.toFixed(0)} g/unit
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F8FAFC', borderTop: '2px solid #CBD5E1' }}>
                <td colSpan={2} style={{ padding: '9px 10px', fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>
                  Total Factory Sum
                </td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '0.86rem' }}>
                  {totalPlantUnits.toLocaleString()}
                </td>
                <td></td>
                <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#0F172A', fontSize: '0.86rem' }}>
                  {totalPlantProductNetKg.toLocaleString()} kg
                </td>
                {factoryPackagingConsumed.map(mat => (
                  <td key={mat.id} style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: mat.color, fontSize: '0.86rem', fontFamily: 'var(--font-mono)' }}>
                    {mat.totalUsedKg.toLocaleString()} kg
                  </td>
                ))}
                <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#DA291C', fontSize: '0.86rem', fontFamily: 'var(--font-mono)' }}>
                  {totalPlantPackagingKg.toLocaleString()} kg Total
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Reconciliation Formula Footer */}
          <div style={{ marginTop: '0.85rem', background: '#F8FAFC', borderRadius: '6px', padding: '8px 12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={13} color="#0284C7" />
              <span style={{ fontSize: '0.74rem', color: '#475569' }}>
                Reconciliation Formula: <strong>Allocated Packaging (kg) = (Units Produced × Unit Weight) × (Packaging Consumed in Period ÷ Total Plant Product Net Mass)</strong>
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
              ✓ 100% Mass Conserved
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm">
            Cancel
          </button>

          <button
            onClick={handleProceed}
            className="btn btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            <span>Review & Commit Allocated Record</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

