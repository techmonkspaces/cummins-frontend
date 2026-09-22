import React, { useState } from 'react';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowRight, 
  UserCheck
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster } from '../../types';

interface ApproachUserInputProps {
  product: Product;
  availableMaterials: PackagingMaterialMaster[];
  onComplete: (data: {
    productQuantity: number;
    materials: PackagingLineItem[];
    notes?: string;
  }) => void;
  onBack: () => void;
}

interface UserInputItemEntry {
  id: string;
  materialId: string;
  quantity: number;
  unit: 'pcs' | 'kg' | 'g';
  notes?: string;
}

export const ApproachUserInput: React.FC<ApproachUserInputProps> = ({
  product,
  availableMaterials,
  onComplete,
  onBack,
}) => {
  const [productQuantity, setProductQuantity] = useState<number>(100);
  const [operatorNotes, setOperatorNotes] = useState('Floor packing station #2 manual entry. Verified with digital scale.');

  const [items, setItems] = useState<UserInputItemEntry[]>([
    {
      id: 'ui-1',
      materialId: 'MAT-001', // Cardboard Box
      quantity: 1,
      unit: 'pcs'
    },
    {
      id: 'ui-2',
      materialId: 'MAT-003', // Cushioning
      quantity: 100,
      unit: 'g'
    },
    {
      id: 'ui-3',
      materialId: 'MAT-004', // Thermocol / EPS
      quantity: 60,
      unit: 'g'
    },
    {
      id: 'ui-4',
      materialId: 'MAT-007', // Packaging Tape
      quantity: 20,
      unit: 'g'
    }
  ]);

  const handleAddItem = () => {
    const usedIds = new Set(items.map(i => i.materialId));
    const nextMat = availableMaterials.find(m => !usedIds.has(m.id)) || availableMaterials[0];

    setItems([
      ...items,
      {
        id: `ui-${Date.now()}`,
        materialId: nextMat.id,
        quantity: 1,
        unit: nextMat.stockUnit === 'pcs' ? 'pcs' : 'kg'
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleMaterialChange = (id: string, materialId: string) => {
    const master = availableMaterials.find(m => m.id === materialId) || availableMaterials[0];
    setItems(items.map(i => {
      if (i.id === id) {
        return {
          ...i,
          materialId,
          unit: master.stockUnit === 'pcs' ? 'pcs' : 'kg'
        };
      }
      return i;
    }));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i));
  };

  const handleUnitChange = (id: string, unit: 'pcs' | 'kg' | 'g') => {
    setItems(items.map(i => i.id === id ? { ...i, unit } : i));
  };

  const calculateStandardizedItems = (): PackagingLineItem[] => {
    const batchQty = Math.max(1, productQuantity);

    return items.map(entry => {
      const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
      
      let perUnitWeightKg = 0;
      if (entry.unit === 'pcs') {
        perUnitWeightKg = (entry.quantity * (master.weightPerUnitKg || 0.45));
      } else if (entry.unit === 'g') {
        perUnitWeightKg = (entry.quantity / 1000);
      } else if (entry.unit === 'kg') {
        perUnitWeightKg = entry.quantity;
      }

      const totalBatchWeightKg = perUnitWeightKg * batchQty;
      const totalBatchQuantity = entry.unit === 'pcs' ? entry.quantity * batchQty : totalBatchWeightKg;

      return {
        id: `user-line-${entry.id}`,
        materialId: master.id,
        materialName: master.name,
        category: master.category,
        quantity: parseFloat(totalBatchQuantity.toFixed(3)),
        unit: entry.unit === 'pcs' ? 'pcs' : 'kg',
        weight: parseFloat(totalBatchWeightKg.toFixed(3)),
        weightUnit: 'kg',
        weightKg: parseFloat(totalBatchWeightKg.toFixed(3)),
        isSystemGenerated: false,
        notes: `Operator entered ${entry.quantity} ${entry.unit}/unit (${(perUnitWeightKg * 1000).toFixed(0)}g/unit)`
      };
    });
  };

  const standardizedItems = calculateStandardizedItems();
  const totalBatchWeightKg = standardizedItems.reduce((sum, item) => sum + item.weightKg, 0);
  const perUnitTotalWeightKg = productQuantity > 0 ? totalBatchWeightKg / productQuantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      productQuantity: Math.max(1, productQuantity),
      materials: standardizedItems,
      notes: operatorNotes
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Context Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--method-user-input)', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-user-input">
                <Edit3 size={12} /> Approach C
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Floor Operator / Actual Packaging Used
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Manual Packaging Material Floor Entry
            </h2>
          </div>

          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 14px', borderRadius: '8px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
              Product Profile
            </div>
            <div className="font-mono font-bold" style={{ color: '#0F172A' }}>
              {product.sku} • {product.name} ({product.weightKg} kg)
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cols-12">
        {/* Left Column: Material Entry Table (8 cols) */}
        <div style={{ gridColumn: 'span 8' }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                Actual Packaging Materials Used (Per Unit)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Record materials used per unit from the packaging catalog
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddItem}
            >
              <Plus size={14} />
              <span>Add Material</span>
            </button>
          </div>

          {/* Batch Volume Input */}
          <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                Packed Batch Quantity
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Total product units packed with this bill-of-materials
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="1"
                step="1"
                className="form-input font-mono"
                value={productQuantity}
                onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '110px', textAlign: 'right' }}
                required
              />
              <span className="text-xs text-muted">units</span>
            </div>
          </div>

          {/* Dynamic Table */}
          <div className="table-wrapper" style={{ marginBottom: '1.25rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Packaging Material</th>
                  <th>Category</th>
                  <th style={{ width: '90px' }}>Qty / Unit</th>
                  <th style={{ width: '100px' }}>Unit</th>
                  <th>Standardized (kg)</th>
                  <th style={{ textAlign: 'right', width: '50px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((entry) => {
                  const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
                  let perUnitKg = 0;
                  if (entry.unit === 'pcs') perUnitKg = entry.quantity * (master.weightPerUnitKg || 0.45);
                  else if (entry.unit === 'g') perUnitKg = entry.quantity / 1000;
                  else if (entry.unit === 'kg') perUnitKg = entry.quantity;

                  return (
                    <tr key={entry.id}>
                      <td>
                        <select
                          className="form-select"
                          value={entry.materialId}
                          onChange={(e) => handleMaterialChange(entry.id, e.target.value)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                        >
                          {availableMaterials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {master.category}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          className="form-input font-mono"
                          value={entry.quantity}
                          onChange={(e) => handleQuantityChange(entry.id, parseFloat(e.target.value) || 0)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                          required
                        />
                      </td>
                      <td>
                        <select
                          className="form-select font-mono"
                          value={entry.unit}
                          onChange={(e) => handleUnitChange(entry.id, e.target.value as 'pcs' | 'kg' | 'g')}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                        >
                          <option value="pcs">pcs</option>
                          <option value="g">grams (g)</option>
                          <option value="kg">kg</option>
                        </select>
                      </td>
                      <td>
                        <span className="font-mono text-xs font-semibold" style={{ color: '#059669' }}>
                          {perUnitKg >= 0.001 ? perUnitKg.toFixed(3) : perUnitKg.toFixed(4)} kg/u
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(entry.id)}
                          disabled={items.length <= 1}
                          style={{ padding: '0.3rem 0.45rem' }}
                          title="Remove Line"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <span>Station Operator Notes</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              placeholder="Floor packing observations..."
            />
          </div>
        </div>

        {/* Right Column: Live Calculation Summary (4 cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ border: '1px solid #A7F3D0', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: '#ECFDF5', color: '#059669' }}>
                <UserCheck size={18} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                Operator Log Summary
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                  Per-Unit Packaging Mass
                </div>
                <div className="font-mono font-bold text-xl" style={{ color: '#059669', marginTop: '2px' }}>
                  {perUnitTotalWeightKg.toFixed(3)} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>kg / unit</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px' }}>
                  ≈ {Math.round(perUnitTotalWeightKg * 1000)} g material per product
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Batch Material Mass
                </div>
                <div className="font-mono font-bold text-xl" style={{ color: '#0F172A', marginTop: '2px' }}>
                  {totalBatchWeightKg.toFixed(2)} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>kg</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px' }}>
                  For batch of {productQuantity.toLocaleString()} units
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                  Materials Logged
                </div>
                <div className="font-mono font-bold text-lg" style={{ color: '#0284C7', marginTop: '2px' }}>
                  {items.length} items recorded
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', background: '#ECFDF5', padding: '8px 10px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
              📱 Compatible with shop-floor barcode scanners and handheld terminal interfaces.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back to Method Selection
        </button>

        <button type="submit" className="btn btn-primary btn-lg">
          <span>Proceed to Packaging Summary Review</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
};
