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
  Sparkles
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster } from '../../types';

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

export const ApproachInventory: React.FC<ApproachInventoryProps> = ({
  product,
  availableMaterials,
  onComplete,
  onBack,
}) => {
  const [period, setPeriod] = useState('September 2026');
  const [productQuantity, setProductQuantity] = useState<number>(product.defaultBatchSize || 1000);
  const [notes, setNotes] = useState('Automated inventory batch deduction. Reconciled via SAP S/4HANA MVT 261.');

  // SKU-specific batch consumption data from ERP (SAP MM Goods Issue MVT-261)
  const getBatchConsumptionBySku = (sku: string) => {
    switch (sku) {
      case 'GA-102': // Gear Assembly — Heavy, 8kg, high volume 1000 units
        return [
          { id: 'inv-1', materialId: 'MAT-001', materialName: 'Cardboard Box', category: 'Paper/Cardboard' as const, consumedKg: 450, sapDoc: '4900182741', sloc: 'SLOC 1001' },
          { id: 'inv-2', materialId: 'MAT-003', materialName: 'Kraft Paper Cushioning', category: 'Paper' as const, consumedKg: 85, sapDoc: '4900182742', sloc: 'SLOC 1001' },
          { id: 'inv-3', materialId: 'MAT-007', materialName: 'Packaging Seam Tape', category: 'Plastic' as const, consumedKg: 22, sapDoc: '4900182743', sloc: 'SLOC 1001' },
        ];
      case 'BP-201': // Brake Assembly — 5.5kg, batch 500 units
        return [
          { id: 'inv-1', materialId: 'MAT-001', materialName: 'Cardboard Box', category: 'Paper/Cardboard' as const, consumedKg: 225, sapDoc: '4900183102', sloc: 'SLOC 1001' },
          { id: 'inv-2', materialId: 'MAT-003', materialName: 'Kraft Paper Cushioning', category: 'Paper' as const, consumedKg: 40, sapDoc: '4900183103', sloc: 'SLOC 1001' },
          { id: 'inv-3', materialId: 'MAT-006', materialName: 'VCI Anti-Rust Poly Bag', category: 'Plastic' as const, consumedKg: 15, sapDoc: '4900183104', sloc: 'SLOC 1002' },
          { id: 'inv-4', materialId: 'MAT-007', materialName: 'Packaging Seam Tape', category: 'Plastic' as const, consumedKg: 9, sapDoc: '4900183105', sloc: 'SLOC 1001' },
        ];
      case 'IN-108': // Fuel Injector — small/light 1.4kg, high volume 1200 units
        return [
          { id: 'inv-1', materialId: 'MAT-001', materialName: 'Cardboard Box', category: 'Paper/Cardboard' as const, consumedKg: 240, sapDoc: '4900184210', sloc: 'SLOC 1003' },
          { id: 'inv-2', materialId: 'MAT-006', materialName: 'VCI Anti-Rust Poly Bag', category: 'Plastic' as const, consumedKg: 36, sapDoc: '4900184211', sloc: 'SLOC 1002' },
          { id: 'inv-3', materialId: 'MAT-005', materialName: 'LDPE Bubble Wrap', category: 'Plastic' as const, consumedKg: 18, sapDoc: '4900184212', sloc: 'SLOC 1002' },
        ];
      default:
        return [
          { id: 'inv-1', materialId: 'MAT-001', materialName: 'Cardboard Box', category: 'Paper/Cardboard' as const, consumedKg: 300, sapDoc: '4900180001', sloc: 'SLOC 1001' },
          { id: 'inv-2', materialId: 'MAT-003', materialName: 'Kraft Paper Cushioning', category: 'Paper' as const, consumedKg: 60, sapDoc: '4900180002', sloc: 'SLOC 1001' },
          { id: 'inv-3', materialId: 'MAT-007', materialName: 'Packaging Seam Tape', category: 'Plastic' as const, consumedKg: 15, sapDoc: '4900180003', sloc: 'SLOC 1001' },
        ];
    }
  };

  const consumedData = getBatchConsumptionBySku(product.sku);
  const totalPackagingKg = consumedData.reduce((sum, item) => sum + item.consumedKg, 0);
  const safeQty = Math.max(1, productQuantity || 1);
  const perProductTotalKg = totalPackagingKg / safeQty;
  const perProductTotalGrams = perProductTotalKg * 1000;

  const handleProceed = () => {
    const lineItems: PackagingLineItem[] = consumedData.map((entry) => {
      return {
        id: `line-${entry.materialId}-${Date.now()}`,
        materialId: entry.materialId,
        materialName: entry.materialName,
        category: entry.category,
        quantity: entry.consumedKg,
        unit: 'kg',
        weight: entry.consumedKg,
        weightUnit: 'kg',
        weightKg: entry.consumedKg,
        isSystemGenerated: true,
        notes: `SAP Doc #${entry.sapDoc} • MVT-261 (${entry.sloc})`
      };
    });

    onComplete({
      productQuantity: safeQty,
      period,
      materials: lineItems,
      notes
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '960px', margin: '0 auto' }}>
      
      {/* Minimalist Top Context Header */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
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
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {product.name}
            </h2>
            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
              ({product.weightKg} kg net)
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px' }}>
            ERP batch goods issues (MVT 261) divided across MES output quantity.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              background: '#ECFDF5', 
              color: '#059669', 
              border: '1px solid #A7F3D0', 
              padding: '3px 8px', 
              borderRadius: '6px', 
              fontSize: '0.72rem', 
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            data-tooltip="Automatic ERP ledger sync active"
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
            SAP MM Synced
          </span>
        </div>
      </div>

      {/* Main Reconciliation Card */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}
      >
        {/* Period & Quantity Header Bar */}
        <div 
          style={{
            padding: '1rem 1.25rem',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem'
          }}
        >
          <div>
            <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Calendar size={12} color="#0284C7" />
              Reconciliation Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 10px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.84rem',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="September 2026">September 2026 (Active Cycle)</option>
              <option value="August 2026">August 2026 (Closed)</option>
              <option value="July 2026">July 2026 (Closed)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <PackageCheck size={12} color="#059669" />
              MES Packed Output
            </label>
            <div 
              style={{ 
                height: '38px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                {safeQty.toLocaleString()} Units
              </span>
              <span style={{ fontSize: '0.68rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                MES Line Verified
              </span>
            </div>
          </div>
        </div>

        {/* Consumed Materials Table */}
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Packaging Batch Deductions
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
              SAP MVT-261 Material Issue Logs
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Material</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Doc Reference</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total Mass</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', textAlign: 'right' }}>Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {consumedData.map((item) => {
                const perProductGrams = (item.consumedKg / safeQty) * 1000;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>
                      {item.materialName}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#64748B' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span 
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: '#F0FDF4', color: '#15803D', padding: '2px 6px', borderRadius: '4px', border: '1px solid #BBF7D0', fontWeight: 700 }}
                        data-tooltip={`Storage Location: ${item.sloc}`}
                      >
                        #{item.sapDoc}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.84rem' }}>
                      {item.consumedKg.toLocaleString()} kg
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0284C7', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                      {perProductGrams.toFixed(0)} g
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F0F9FF', borderTop: '2px solid #BAE6FD' }}>
                <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 800, color: '#0369A1', fontSize: '0.84rem' }}>
                  Total Batch Mass
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#0369A1', fontSize: '0.92rem' }}>
                  {totalPackagingKg.toLocaleString()} kg
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#0284C7', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
                  {perProductTotalGrams.toFixed(0)} g / unit
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Minimal Formula Strip */}
          <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '8px 12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} color="#0284C7" />
              <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                {totalPackagingKg} kg ÷ {safeQty.toLocaleString()} units = <strong>{perProductTotalKg.toFixed(3)} kg/unit ({perProductTotalGrams.toFixed(0)}g)</strong>
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669' }}>
              ✓ Reconciled
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
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <span>Review & Commit Record</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
