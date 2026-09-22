import React from 'react';
import { 
  Database, 
  Calculator, 
  Edit3, 
  ArrowRight, 
  Check, 
  Scale
} from 'lucide-react';
import { Product, RecordingMethod } from '../../types';

interface MethodSelectorProps {
  product: Product;
  selectedMethod: RecordingMethod | null;
  onSelectMethod: (method: RecordingMethod) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  product,
  selectedMethod,
  onSelectMethod,
  onContinue,
  onBack,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Product Summary Context Bar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#FEF2F2', color: '#DA291C', padding: '10px', borderRadius: '8px', border: '1px solid #FECACA' }}>
              <Scale size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="font-mono font-bold text-xs" style={{ background: '#DA291C', color: '#fff', padding: '2px 7px', borderRadius: '4px' }}>
                  {product.sku}
                </span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>
                  {product.name}
                </h2>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px' }}>
                Mass: <strong style={{ color: '#0F172A' }}>{product.weightKg} kg</strong> | Dimensions: <strong style={{ color: '#0F172A' }}>{product.dimensionsCm.length}×{product.dimensionsCm.width}×{product.dimensionsCm.height} cm</strong> | Fragility: <strong style={{ color: '#0F172A' }}>{product.fragility}</strong>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            Change Product
          </button>
        </div>
      </div>

      {/* Step Heading */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DA291C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Step 2 of 4: Recording Methodology
        </span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
          Choose Packaging Recording Method
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.35rem' }}>
          Select the data collection model best suited to your operational visibility and workflow
        </p>
      </div>

      {/* The 3 Cards */}
      <div className="grid-cols-3">
        {/* Approach A: Inventory / Consumption */}
        <div 
          className={`method-card ${selectedMethod === 'INVENTORY' ? 'selected-inventory' : ''}`}
          onClick={() => onSelectMethod('INVENTORY')}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD' }}>
                <Database size={24} />
              </div>
              <span className="badge badge-inventory">Approach A</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              Inventory / Consumption Based
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.45 }}>
              Use when the business tracks warehouse inventory material stock deduction over a period against total units packed/sold.
            </p>

            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Batch Allocation Model:
              </div>
              <div className="font-mono text-xs" style={{ color: '#334155', lineHeight: 1.6 }}>
                <div>• 1,000 Gear Assemblies packed</div>
                <div>• 500 kg Cardboard consumed</div>
                <div>• 80 kg Cushioning consumed</div>
                <div>• 20 kg Tape consumed</div>
                <div style={{ color: '#0284C7', fontWeight: 700, marginTop: '4px', borderTop: '1px dashed #CBD5E1', paddingTop: '4px' }}>
                  → 500kg ÷ 1000 = <strong>0.50 kg/unit</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Best for monthly/weekly runs
            </span>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: selectedMethod === 'INVENTORY' ? '#0284C7' : '#F1F5F9', border: selectedMethod === 'INVENTORY' ? 'none' : '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {selectedMethod === 'INVENTORY' && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
        </div>

        {/* Approach B: System Calculated / Top-Down */}
        <div 
          className={`method-card ${selectedMethod === 'CALCULATED' ? 'selected-calculated' : ''}`}
          onClick={() => onSelectMethod('CALCULATED')}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#FAF5FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>
                <Calculator size={24} />
              </div>
              <span className="badge badge-calculated">Approach B</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              System Calculated (Top-Down)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.45 }}>
              Use when product geometry and catalog are known, and operator requires automated rule-engine packaging bill-of-materials proposal.
            </p>

            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Rule Engine Estimation:
              </div>
              <div className="font-mono text-xs" style={{ color: '#334155', lineHeight: 1.6 }}>
                <div>• Cardboard Box: 1 pc (~450g)</div>
                <div>• Paper Cushioning: 120 g</div>
                <div>• Thermocol/EPS: 80 g</div>
                <div>• Packaging Tape: 25 g</div>
                <div style={{ color: '#7C3AED', fontWeight: 700, marginTop: '4px', borderTop: '1px dashed #CBD5E1', paddingTop: '4px' }}>
                  → Live rule-engine recommendation
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Editable before confirmation
            </span>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: selectedMethod === 'CALCULATED' ? '#7C3AED' : '#F1F5F9', border: selectedMethod === 'CALCULATED' ? 'none' : '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {selectedMethod === 'CALCULATED' && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
        </div>

        {/* Approach C: User Input / Actual Packaging */}
        <div 
          className={`method-card ${selectedMethod === 'USER_INPUT' ? 'selected-user-input' : ''}`}
          onClick={() => onSelectMethod('USER_INPUT')}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                <Edit3 size={24} />
              </div>
              <span className="badge badge-user-input">Approach C</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
              User Input / Actual Packaging
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.45 }}>
              Use when floor packers manually record real materials consumed at the packing station with custom unit entries.
            </p>

            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Floor Operator Log:
              </div>
              <div className="font-mono text-xs" style={{ color: '#334155', lineHeight: 1.6 }}>
                <div>• Cardboard Box: 1 pc</div>
                <div>• Cushioning: 100 g</div>
                <div>• Thermocol/EPS: 60 g</div>
                <div>• Packaging Tape: 20 g</div>
                <div style={{ color: '#059669', fontWeight: 700, marginTop: '4px', borderTop: '1px dashed #CBD5E1', paddingTop: '4px' }}>
                  → Dynamic manual material picker
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Real-time floor logging
            </span>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: selectedMethod === 'USER_INPUT' ? '#059669' : '#F1F5F9', border: selectedMethod === 'USER_INPUT' ? 'none' : '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {selectedMethod === 'USER_INPUT' && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Product Selection
        </button>

        <button 
          className="btn btn-primary btn-lg" 
          disabled={!selectedMethod}
          onClick={onContinue}
        >
          <span>Continue with Selected Method</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
