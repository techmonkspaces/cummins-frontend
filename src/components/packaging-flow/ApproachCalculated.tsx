import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  Cpu,
  Layers,
  Search,
  Package,
  ShieldAlert,
  Info
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
  const [notes, setNotes] = useState('Phaltan Factory automated rule engine calculation based on CAD geometry and weight envelope.');

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
          borderRadius: '14px',
          padding: '1.5rem',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
              <Building2 size={13} /> PHALTAN FACTORY • APPROACH B
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Approach B — System Calculated (Smart Rule Engine)
            </h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
              CAD & PLM top-down algorithmic rules determine optimal packaging with zero guess-work.
            </p>
          </div>

          <div 
            style={{
              background: '#FFFFFF',
              color: '#6D28D9',
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
            <Sparkles size={15} color="#7C3AED" /> AUTOMATED CALCULATION
          </div>
        </div>
      </div>

      {/* Product Selector & Specs */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            Select SKU / Product Profile
          </span>
          <span style={{ fontSize: '0.72rem', color: '#7C3AED', background: '#FAF5FF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Master Data Connected
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Target Product SKU & Specification</label>
            <select
              className="form-select font-mono"
              value={selectedProduct.sku}
              onChange={(e) => {
                const p = MOCK_PRODUCTS.find(x => x.sku === e.target.value) || selectedProduct;
                setSelectedProduct(p);
              }}
              style={{ height: '42px', fontWeight: 700, fontSize: '0.9rem' }}
            >
              {MOCK_PRODUCTS.map(p => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name} ({p.weightKg} kg | {p.dimensionsCm.length}×{p.dimensionsCm.width}×{p.dimensionsCm.height} cm | Fragility: {p.fragility})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Product Specs Badges */}
        <div 
          style={{
            marginTop: '1rem',
            padding: '10px 14px',
            background: '#F8FAFC',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Weight: </span>
            <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{selectedProduct.weightKg} kg</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Dimensions: </span>
            <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{selectedProduct.dimensionsCm.length} × {selectedProduct.dimensionsCm.width} × {selectedProduct.dimensionsCm.height} cm</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Fragility: </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', background: '#FFFBEB', padding: '2px 8px', borderRadius: '4px' }}>
              {selectedProduct.fragility}
            </span>
          </div>
        </div>
      </div>

      {/* Available Packaging Materials Strip */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Available Packaging Materials:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['Cardboard Box', 'Cushioning', 'Thermocol / EPS', 'Packaging Tape', 'Bubble Wrap'].map((mat) => (
            <span key={mat} style={{ fontSize: '0.75rem', background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
              {mat}
            </span>
          ))}
        </div>
      </div>

      {/* System Generated Packaging Table */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', background: '#FAF5FF', borderBottom: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#7C3AED" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
              System Generated Packaging BOM
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED', background: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
            Computed in 12ms
          </span>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1.25rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Material</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Per-Unit Qty</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', textAlign: 'right' }}>Standard Mass</th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.map((item) => {
                const perUnitWeightGrams = productQuantity > 0 ? (item.weightKg / productQuantity) * 1000 : 0;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                      {item.materialName}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#64748B' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>
                      {item.unit === 'pcs' ? '1 pc' : `${(item.quantity / productQuantity).toFixed(2)} ${item.unit}`}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-mono)' }}>
                      {perUnitWeightGrams.toFixed(0)} g / unit
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#FAF5FF', borderTop: '2px solid #DDD6FE' }}>
                <td colSpan={3} style={{ padding: '12px 14px', fontWeight: 800, color: '#6D28D9' }}>
                  Total Recommended Packaging Mass (Per Unit)
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#7C3AED', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>
                  {perUnitGrams.toFixed(0)} g / unit
                </td>
              </tr>
            </tfoot>
          </table>

          {/* WHY THIS PACKAGING? / Rules Applied Section */}
          <div 
            style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                WHY THIS PACKAGING? (Rules Applied)
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {ruleExplanations.map((rule, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#334155' }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary">
            Back
          </button>
          
          <button 
            onClick={handleConfirm}
            className="btn btn-primary btn-lg"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            <span>Confirm & View Packaging Summary</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
