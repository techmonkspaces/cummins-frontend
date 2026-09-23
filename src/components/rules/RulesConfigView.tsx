import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Building2, 
  Package, 
  Tag, 
  Cpu, 
  ArrowRight,
  ShieldAlert,
  Info,
  Play,
  RotateCcw
} from 'lucide-react';
import { MOCK_RULES, MOCK_PRODUCTS, MOCK_PACKAGING_INVENTORY } from '../../data/mockData';
import { calculationEngine } from '../../services/calculationEngine';
import { Product } from '../../types';

export const RulesConfigView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'FACTORY' | 'PRODUCT_CLASS' | 'MATERIAL' | 'SKU_OVERRIDE'>('ALL');
  
  // Rule Simulator State
  const [simProduct, setSimProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [simWeightKg, setSimWeightKg] = useState<number>(MOCK_PRODUCTS[0].weightKg);
  const [simFragility, setSimFragility] = useState<'Low' | 'Medium' | 'High' | 'Heavy Duty'>(MOCK_PRODUCTS[0].fragility);
  const [simQuantity, setSimQuantity] = useState<number>(1);

  // Dynamic Rule Execution on Simulator
  const tempSimProduct: Product = {
    ...simProduct,
    weightKg: simWeightKg,
    fragility: simFragility
  };

  const simulationResult = calculationEngine.calculatePackagingBOM(tempSimProduct, simQuantity);

  const filteredRules = selectedCategory === 'ALL' 
    ? MOCK_RULES 
    : MOCK_RULES.filter(r => r.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ background: '#FAF5FF', color: '#7C3AED', padding: '5px', borderRadius: '6px' }}>
              <Sliders size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
              4-Tier Packaging Rule Engine Configuration
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Hierarchical decision engine that maps factory standards, part physics, material limits, and SKU exceptions without manual per-part BOM maintenance.
          </p>
        </div>

        <div style={{ background: '#F8FAFC', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#64748B' }}>
          <strong>Engine Engine Status:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>● Live & Active</span>
        </div>
      </div>

      {/* 4-Tier Hierarchy Architecture Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '14px',
          padding: '1.5rem',
          color: '#FFFFFF',
          border: '1px solid #334155',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <Sparkles size={18} color="#FBBF24" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
            Why This 4-Tier Architecture Scales Globally
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
          {/* Tier 1 */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ background: '#0284C7', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>TIER 1</span>
              <Building2 size={15} color="#38BDF8" />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>Factory Rules</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
              Plant-wide clearance buffers (+5cm), line conveyor constraints, pallet size templates.
            </div>
          </div>

          {/* Tier 2 */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ background: '#7C3AED', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>TIER 2</span>
              <Package size={15} color="#C084FC" />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>Product Class Rules</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
              Weight &gt; 5kg triggers EPS thermocol structural corners. Fragility defines cushioning mass.
            </div>
          </div>

          {/* Tier 3 */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>TIER 3</span>
              <Layers size={15} color="#34D399" />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>Material Master Limits</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
              Carton max payload capacity, tape roll seam perimeter calculation, recyclability thresholds.
            </div>
          </div>

          {/* Tier 4 */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ background: '#DA291C', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>TIER 4</span>
              <Tag size={15} color="#F87171" />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>SKU Overrides</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
              Exceptions for special precision assemblies (e.g. GA-102 export anti-rust barriers).
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator and Rules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Active Rules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              Configured Enterprise Rules
            </h3>
            
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              {(['ALL', 'FACTORY', 'PRODUCT_CLASS', 'MATERIAL', 'SKU_OVERRIDE'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: selectedCategory === cat ? '#FFFFFF' : 'transparent',
                    color: selectedCategory === cat ? '#0F172A' : '#64748B',
                    boxShadow: selectedCategory === cat ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {cat === 'ALL' ? 'All Rules' : cat === 'PRODUCT_CLASS' ? 'Class' : cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredRules.map((rule) => {
              const badgeColor = 
                rule.category === 'FACTORY' ? '#0284C7' :
                rule.category === 'PRODUCT_CLASS' ? '#7C3AED' :
                rule.category === 'MATERIAL' ? '#059669' : '#DA291C';

              const badgeBg = 
                rule.category === 'FACTORY' ? '#F0F9FF' :
                rule.category === 'PRODUCT_CLASS' ? '#FAF5FF' :
                rule.category === 'MATERIAL' ? '#ECFDF5' : '#FEE2E2';

              return (
                <div 
                  key={rule.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.15rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: badgeColor, background: badgeBg, padding: '2px 7px', borderRadius: '4px', border: `1px solid ${badgeColor}30` }}>
                        {rule.category.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                        {rule.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                      Priority #{rule.priority}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '8px' }}>
                    {rule.description}
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>Condition:</strong> <span style={{ color: '#64748B' }}>{rule.condition}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#059669' }}>Applied Action:</strong> <span style={{ color: '#334155' }}>{rule.action}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Rule Engine Simulator */}
        <div 
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            padding: '1.5rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#7C3AED" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                Live Rule Simulator
              </h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#7C3AED', background: '#FAF5FF', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              Approach B Engine
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Product Selector */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Target Product SKU</label>
              <select
                className="form-select"
                value={simProduct.sku}
                onChange={(e) => {
                  const p = MOCK_PRODUCTS.find(x => x.sku === e.target.value) || MOCK_PRODUCTS[0];
                  setSimProduct(p);
                  setSimWeightKg(p.weightKg);
                  setSimFragility(p.fragility);
                }}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                {MOCK_PRODUCTS.map(p => (
                  <option key={p.sku} value={p.sku}>{p.sku} — {p.name} ({p.weightKg} kg)</option>
                ))}
              </select>
            </div>

            {/* Parameter Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Adjust Weight: <strong>{simWeightKg} kg</strong></label>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={simWeightKg}
                  onChange={(e) => setSimWeightKg(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#7C3AED' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Fragility Level</label>
                <select
                  className="form-select"
                  value={simFragility}
                  onChange={(e) => setSimFragility(e.target.value as any)}
                  style={{ height: '36px', fontSize: '0.82rem' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Heavy Duty">Heavy Duty</option>
                </select>
              </div>
            </div>
          </div>

          {/* Engine Output Box */}
          <div style={{ background: '#FAF5FF', padding: '1rem', borderRadius: '10px', border: '1px solid #DDD6FE' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: '8px' }}>
              Generated Packaging Recipe (BOM)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {simulationResult.recommendedMaterials.map((mat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#0F172A' }}>
                  <span>{mat.materialName}</span>
                  <strong>{mat.quantity} {mat.unit} ({mat.weightKg} kg)</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #DDD6FE', marginTop: '10px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: '#7C3AED' }}>
              <span>Total Calculated Mass:</span>
              <span>{(simulationResult.perUnitTotalWeightKg * 1000).toFixed(0)} g / unit</span>
            </div>
          </div>

          {/* Why this Packaging? Rule Triggers */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Rules Applied by Engine:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {simulationResult.ruleExplanations.map((exp, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.75rem', color: '#059669' }}>
                  <CheckCircle2 size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
