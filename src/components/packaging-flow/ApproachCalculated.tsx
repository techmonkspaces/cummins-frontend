import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster } from '../../types';
import { calculationEngine } from '../../services/calculationEngine';
import { MOCK_PRODUCTS } from '../../data/mockData';

interface ApproachCalculatedProps {
  product: Product;
  availableMaterials: PackagingMaterialMaster[];
  onComplete: (data: {
    productQuantity: number;
    materials: PackagingLineItem[];
    notes?: string;
  }) => void;
  onBack: () => void;
}

export const ApproachCalculated: React.FC<ApproachCalculatedProps> = ({
  product: initialProduct,
  availableMaterials,
  onComplete,
  onBack,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct);
  const [productQuantity, setProductQuantity] = useState<number>(100);
  const [calculatedItems, setCalculatedItems] = useState<PackagingLineItem[]>([]);
  const [ruleExplanations, setRuleExplanations] = useState<string[]>([]);
  const [notes, setNotes] = useState('Top-down algorithmic rule engine calculation.');

  const runCalculation = (prod: Product, qty: number) => {
    const res = calculationEngine.calculatePackagingBOM(prod, qty);
    setCalculatedItems(res.recommendedMaterials);
    setRuleExplanations(res.ruleExplanations);
  };

  useEffect(() => {
    runCalculation(selectedProduct, productQuantity);
  }, [selectedProduct, productQuantity]);

  const totalBatchWeightKg = calculatedItems.reduce((sum, item) => sum + (item.weightKg || 0), 0);
  const perUnitWeightKg = productQuantity > 0 ? totalBatchWeightKg / productQuantity : 0;
  const perUnitGrams = perUnitWeightKg * 1000;

  const handleConfirm = () => {
    onComplete({
      productQuantity,
      materials: calculatedItems,
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
          borderLeft: '4px solid #7C3AED',
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#7C3AED', background: '#FAF5FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
              {selectedProduct.sku}
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {selectedProduct.name}
            </h2>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px' }}>
            Automated BOM calculation based on CAD dimensions, mass envelope, and fragility rating.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              background: '#FAF5FF', 
              color: '#7C3AED', 
              border: '1px solid #DDD6FE', 
              padding: '3px 8px', 
              borderRadius: '6px', 
              fontSize: '0.72rem', 
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            data-tooltip="Rule engine computes recommended packaging BOM in real-time"
          >
            <Sparkles size={12} color="#7C3AED" />
            Auto Computed
          </span>
        </div>
      </div>

      {/* Target Product Selection Card */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.25rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Target Product SKU & Profile
            </label>
            <select
              className="form-select font-mono"
              value={selectedProduct.sku}
              onChange={(e) => {
                const p = MOCK_PRODUCTS.find(x => x.sku === e.target.value) || selectedProduct;
                setSelectedProduct(p);
              }}
              style={{ height: '38px', fontWeight: 700, fontSize: '0.84rem' }}
            >
              {MOCK_PRODUCTS.map(p => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name} ({p.weightKg} kg | {p.dimensionsCm.length}×{p.dimensionsCm.width}×{p.dimensionsCm.height} cm | {p.fragility})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Batch Quantity (Units)
            </label>
            <input
              type="number"
              min="1"
              value={productQuantity}
              onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Computed Materials Table Card */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '0.85rem 1.25rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={15} color="#7C3AED" />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Rule-Determined Packaging BOM
            </h3>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
            Batch: {productQuantity.toLocaleString()} Units
          </span>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Material</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Unit Allocation</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', textAlign: 'right' }}>Per-Unit Mass</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', textAlign: 'right' }}>Batch Mass</th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.map((item) => {
                const perUnitWeightGrams = productQuantity > 0 ? (item.weightKg / productQuantity) * 1000 : 0;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>
                      {item.materialName}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#64748B' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#334155', fontSize: '0.8rem' }}>
                      {item.unit === 'pcs' ? '1 pc' : `${(item.quantity / productQuantity).toFixed(2)} ${item.unit}`}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                      {perUnitWeightGrams.toFixed(0)} g
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                      {item.weightKg.toFixed(2)} kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#FAF5FF', borderTop: '2px solid #DDD6FE' }}>
                <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 800, color: '#6D28D9', fontSize: '0.84rem' }}>
                  Total Batch Packaging Mass
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#7C3AED', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
                  {perUnitGrams.toFixed(0)} g / unit
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#6D28D9', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
                  {totalBatchWeightKg.toFixed(2)} kg
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Minimal Formula Strip */}
          <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '8px 12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} color="#7C3AED" />
              <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                {ruleExplanations[0] || 'Top-down algorithm matched CAD envelope.'}
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7C3AED' }}>
              ✓ Auto Verified
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          
          <button 
            onClick={handleConfirm}
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
