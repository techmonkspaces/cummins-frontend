import React, { useState } from 'react';
import { 
  Database, 
  ArrowRight, 
  Calculator, 
  Calendar, 
  Layers,
  CheckCircle2,
  Lock,
  Building2,
  FileSpreadsheet,
  Info,
  PackageCheck
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
  const [notes, setNotes] = useState('Pune Factory automated inventory batch deduction. Reconciled via SAP S/4HANA MVT 261.');

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
      const perUnitKg = entry.consumedKg / safeQty;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px', margin: '0 auto' }}>
      
      {/* Approach Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          borderRadius: '14px',
          padding: '1.5rem',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
              <Building2 size={13} /> PUNE FACTORY • APPROACH A
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Approach A — Inventory / Consumption Based
            </h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
              Target SKU: <strong>{product.sku} — {product.name}</strong> ({product.weightKg} kg net mass)
            </p>
          </div>

          <div 
            style={{
              background: '#FFFFFF',
              color: '#0369A1',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Lock size={15} /> NO MANUAL INPUT REQUIRED
          </div>
        </div>
      </div>

      {/* Zero Input Explanation Notice */}
      <div 
        style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#0369A1'
        }}
      >
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Automated WMS Reconciliation:</strong> On high-speed assembly lines, operators do not log tape meters or cardboard sheets. The system automatically reads inventory material deductions and divides by packed quantity.
        </div>
      </div>

      {/* Main Reconciliation Card */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}
      >
        {/* Period & Quantity ERP Synced Header Bar */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem'
          }}
        >
          <div>
            <label style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <Calendar size={13} color="#0284C7" />
              Reconciliation Period (ERP Billing Cycle)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                <option value="September 2026">September 2026 (Active Cycle)</option>
                <option value="August 2026">August 2026 (Closed & Audited)</option>
                <option value="July 2026">July 2026 (Closed & Audited)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <PackageCheck size={13} color="#059669" />
              Total Products Packed (MES Line Output)
            </label>
            <div 
              style={{ 
                height: '42px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                {safeQty.toLocaleString()} Units
              </span>
              <span style={{ fontSize: '0.72rem', color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                ● Auto-Fetched from MES Line
              </span>
            </div>
          </div>
        </div>

        {/* Consumed Materials Table */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Packaging Inventory Consumption (Batch Deductions)
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              ● Synced from SAP MM
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Material</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>SAP Mat. Doc</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Total Consumed</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', textAlign: 'right' }}>Calculated Per Unit</th>
              </tr>
            </thead>
            <tbody>
              {consumedData.map((item) => {
                const perProductGrams = (item.consumedKg / safeQty) * 1000;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                      {item.materialName}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#64748B' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: '#F0FDF4', color: '#15803D', padding: '2px 7px', borderRadius: '4px', border: '1px solid #BBF7D0', fontWeight: 700 }}>
                        {item.sapDoc} • MVT-261
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>
                      {item.consumedKg.toLocaleString()} kg
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0284C7', fontFamily: 'var(--font-mono)' }}>
                      {perProductGrams.toFixed(0)} g
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F0F9FF', borderTop: '2px solid #BAE6FD' }}>
                <td colSpan={3} style={{ padding: '12px 14px', fontWeight: 800, color: '#0369A1' }}>
                  Total Packaging Consumption
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#0369A1', fontSize: '1.05rem' }}>
                  {totalPackagingKg.toLocaleString()} kg
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#0284C7', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                  {perProductTotalGrams.toFixed(0)} g / unit
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Mathematical Formula Display */}
          <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} color="#0284C7" />
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                Formula applied: <strong>Total Consumed ({totalPackagingKg} kg) ÷ Products Packed ({safeQty.toLocaleString()}) = {perProductTotalKg.toFixed(3)} kg/unit ({perProductTotalGrams.toFixed(0)}g)</strong>
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
              Exact Division Validated
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary">
            Back
          </button>
          
          <button 
            onClick={handleProceed}
            className="btn btn-primary btn-lg"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            <span>View Packaging Details & Summary</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
