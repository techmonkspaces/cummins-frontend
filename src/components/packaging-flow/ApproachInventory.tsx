import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Calculator, 
  Calendar, 
  Layers
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

interface InventoryConsumedEntry {
  id: string;
  materialId: string;
  consumedQuantity: number;
  unit: string;
}

export const ApproachInventory: React.FC<ApproachInventoryProps> = ({
  product,
  availableMaterials,
  onComplete,
  onBack,
}) => {
  const [period, setPeriod] = useState('2026-W38 (Sep 15 - Sep 21)');
  const [productQuantity, setProductQuantity] = useState<number>(1000);
  const [notes, setNotes] = useState('Production Line 4 packaging inventory reconciliation. Consumption drawn from SAP batch issue logs.');

  // Pre-fill with the spec example for Gear Assembly (500kg Cardboard, 80kg Cushioning, 20kg Tape)
  const [consumedList, setConsumedList] = useState<InventoryConsumedEntry[]>([
    {
      id: 'inv-1',
      materialId: 'MAT-001', // Cardboard Box
      consumedQuantity: 500,
      unit: 'kg'
    },
    {
      id: 'inv-2',
      materialId: 'MAT-003', // Cushioning
      consumedQuantity: 80,
      unit: 'kg'
    },
    {
      id: 'inv-3',
      materialId: 'MAT-007', // Packaging Tape
      consumedQuantity: 20,
      unit: 'kg'
    }
  ]);

  const handleAddMaterial = () => {
    const usedIds = new Set(consumedList.map(c => c.materialId));
    const nextMat = availableMaterials.find(m => !usedIds.has(m.id)) || availableMaterials[0];
    
    setConsumedList([
      ...consumedList,
      {
        id: `inv-${Date.now()}`,
        materialId: nextMat.id,
        consumedQuantity: 10,
        unit: 'kg'
      }
    ]);
  };

  const handleRemoveMaterial = (id: string) => {
    if (consumedList.length <= 1) return;
    setConsumedList(consumedList.filter(c => c.id !== id));
  };

  const handleMaterialChange = (id: string, materialId: string) => {
    setConsumedList(consumedList.map(c => c.id === id ? { ...c, materialId } : c));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setConsumedList(consumedList.map(c => c.id === id ? { ...c, consumedQuantity: Math.max(0, quantity) } : c));
  };

  // Calculations
  const validQuantity = Math.max(1, productQuantity || 1);
  const totalConsumedKg = consumedList.reduce((sum, item) => sum + (Number(item.consumedQuantity) || 0), 0);
  const perProductTotalKg = totalConsumedKg / validQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lineItems: PackagingLineItem[] = consumedList.map((entry) => {
      const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
      const weightKg = Number(entry.consumedQuantity) || 0;
      
      return {
        id: `line-${entry.id}`,
        materialId: master.id,
        materialName: master.name,
        category: master.category,
        quantity: weightKg,
        unit: 'kg',
        weight: weightKg,
        weightUnit: 'kg',
        weightKg: weightKg,
        notes: `Inventory allocation: ${weightKg} kg ÷ ${validQuantity} units = ${(weightKg / validQuantity).toFixed(4)} kg/unit`
      };
    });

    onComplete({
      productQuantity: validQuantity,
      period,
      materials: lineItems,
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Context Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--method-inventory)', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-inventory">
                <Database size={12} /> Approach A
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Inventory / Consumption Based Method
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Batch Packaging Consumption Allocation
            </h2>
          </div>

          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '6px 14px', borderRadius: '8px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700, textTransform: 'uppercase' }}>
              Target SKU
            </div>
            <div className="font-mono font-bold" style={{ color: '#0F172A' }}>
              {product.sku} • {product.name}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cols-12">
        {/* Left Column: Input Form (7 cols) */}
        <div style={{ gridColumn: 'span 7' }} className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#0284C7" />
            1. Select Period & Production Quantity
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                <span>Accounting Period / Batch Window</span>
              </label>
              <select 
                className="form-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="2026-W38 (Sep 15 - Sep 21)">2026-W38 (Sep 15 - Sep 21)</option>
                <option value="2026-W37 (Sep 08 - Sep 14)">2026-W37 (Sep 08 - Sep 14)</option>
                <option value="September 2026 (Monthly Batch)">September 2026 (Monthly Batch)</option>
                <option value="Q3 2026 Reconciliation">Q3 2026 Reconciliation</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                <span>Total Products Packed / Sold</span>
              </label>
              <input 
                type="number"
                min="1"
                step="1"
                className="form-input font-mono"
                value={productQuantity}
                onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="e.g. 1000"
                required
              />
            </div>
          </div>

          {/* Consumed Materials Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#0284C7" />
              2. Consumed Packaging Materials
            </h3>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddMaterial}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
            >
              <Plus size={14} />
              <span>Add Material</span>
            </button>
          </div>

          <div className="table-wrapper" style={{ marginBottom: '1.25rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Packaging Material</th>
                  <th>Category</th>
                  <th style={{ width: '150px' }}>Total Consumed</th>
                  <th style={{ textAlign: 'right', width: '50px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {consumedList.map((item) => {
                  const master = availableMaterials.find(m => m.id === item.materialId) || availableMaterials[0];

                  return (
                    <tr key={item.id}>
                      <td>
                        <select
                          className="form-select"
                          value={item.materialId}
                          onChange={(e) => handleMaterialChange(item.id, e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        >
                          {availableMaterials.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.availableStock.toLocaleString()} {m.stockUnit} avail)
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            className="form-input font-mono"
                            value={item.consumedQuantity}
                            onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', width: '90px' }}
                            required
                          />
                          <span className="font-mono text-xs text-muted">kg</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveMaterial(item.id)}
                          disabled={consumedList.length <= 1}
                          style={{ padding: '0.35rem 0.5rem' }}
                          title="Remove Material"
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
              <span>Accounting / Audit Notes (Optional)</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add batch reconciliation reference..."
            />
          </div>
        </div>

        {/* Right Column: Live Calculation Breakdown (5 cols) */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ background: '#FFFFFF', border: '1px solid #BAE6FD' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: '#F0F9FF', color: '#0284C7' }}>
                <Calculator size={18} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                Per-Product Consumption Formula
              </h3>
            </div>

            <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Mathematical Model:
              </div>
              <div className="font-mono text-xs" style={{ color: '#0284C7', fontWeight: 600 }}>
                Per-Product Material Mass (kg) = Consumed Stock (kg) ÷ Packed Products ({validQuantity.toLocaleString()})
              </div>
            </div>

            {/* Step-by-Step Breakdown for Each Material */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {consumedList.map((entry) => {
                const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
                const consumed = Number(entry.consumedQuantity) || 0;
                const perUnit = validQuantity > 0 ? (consumed / validQuantity) : 0;

                return (
                  <div 
                    key={entry.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.65rem 0.85rem', 
                      background: '#F8FAFC', 
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                        {master.name}
                      </div>
                      <div className="font-mono text-xs text-muted">
                        {consumed.toLocaleString()} kg consumed
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono font-bold text-sm" style={{ color: '#0284C7' }}>
                        {perUnit >= 0.001 ? perUnit.toFixed(3) : perUnit.toFixed(4)} kg
                      </div>
                      <div className="text-xs text-muted font-mono">
                        / product unit
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Aggregate Box */}
            <div style={{ padding: '0.9rem', background: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Batch Consumption
                </div>
                <div className="font-mono font-bold text-lg" style={{ color: '#0F172A' }}>
                  {totalConsumedKg.toLocaleString()} kg
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#0284C7', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Per Unit
                </div>
                <div className="font-mono font-bold text-lg" style={{ color: '#0284C7' }}>
                  {perProductTotalKg.toFixed(3)} kg/u
                </div>
              </div>
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
