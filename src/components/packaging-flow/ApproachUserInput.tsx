import React, { useState } from 'react';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Package, 
  Scale, 
  CheckCircle2, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { ProductSearchCombobox } from './ProductSearchCombobox';

interface ApproachUserInputProps {
  product: Product;
  availableMaterials: PackagingMaterialMaster[];
  onComplete: (data: {
    product?: Product;
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
  unit: string;
}

interface UnitOption {
  value: string;
  label: string;
  defaultQty: number;
  badgeHint?: string;
}

const getCompatibleUnitsForMaterial = (materialId: string, masterList: PackagingMaterialMaster[]): UnitOption[] => {
  const master = masterList.find(m => m.id === materialId);
  if (!master) {
    return [{ value: 'pcs', label: 'pcs (Pieces)', defaultQty: 1 }];
  }

  switch (master.id) {
    case 'MAT-CB-S':
    case 'MAT-CB-M':
    case 'MAT-CB-L':
    case 'MAT-CB-XL':
    case 'MAT-001':
      return [
        { value: 'pcs', label: 'pcs (Cartons)', defaultQty: 1, badgeHint: `${master.dimensions || 'Carton'} (${master.weightPerUnitKg} kg)` },
        { value: 'kg', label: 'kg (Carton Mass)', defaultQty: master.weightPerUnitKg },
        { value: 'g', label: 'g (Grams)', defaultQty: Math.round(master.weightPerUnitKg * 1000) }
      ];
    case 'MAT-002':
      return [
        { value: 'pcs', label: 'pcs (Sheets)', defaultQty: 2, badgeHint: '1.0 kg/unit' },
        { value: 'kg', label: 'kg (Weight)', defaultQty: 0.5 },
        { value: 'g', label: 'g (Grams)', defaultQty: 500 }
      ];
    case 'MAT-003':
      return [
        { value: 'g', label: 'g (Grams)', defaultQty: 100, badgeHint: 'Void fill mass' },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.1 }
      ];
    case 'MAT-004':
      return [
        { value: 'pcs', label: 'pcs (Blocks)', defaultQty: 2, badgeHint: '80g / block' },
        { value: 'g', label: 'g (Grams)', defaultQty: 60 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.06 }
      ];
    case 'MAT-005':
      return [
        { value: 'm', label: 'm (Meters)', defaultQty: 2, badgeHint: '50g / meter' },
        { value: 'm²', label: 'm² (Area)', defaultQty: 1 },
        { value: 'rolls', label: 'rolls (Fraction)', defaultQty: 0.05 },
        { value: 'g', label: 'g (Grams)', defaultQty: 100 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.1 }
      ];
    case 'MAT-006':
      return [
        { value: 'pcs', label: 'pcs (Bags)', defaultQty: 1, badgeHint: '30g / bag' },
        { value: 'g', label: 'g (Grams)', defaultQty: 30 }
      ];
    case 'MAT-007':
      return [
        { value: 'm', label: 'm (Meters)', defaultQty: 3, badgeHint: '7g / meter' },
        { value: 'g', label: 'g (Grams)', defaultQty: 20 },
        { value: 'rolls', label: 'rolls (Fraction)', defaultQty: 0.05 }
      ];
    case 'MAT-008':
      return [
        { value: 'pcs', label: 'pcs (Sheets)', defaultQty: 1, badgeHint: '60g / sheet' },
        { value: 'm²', label: 'm² (Area)', defaultQty: 0.5 },
        { value: 'g', label: 'g (Grams)', defaultQty: 60 }
      ];
    case 'MAT-009':
      return [
        { value: 'm', label: 'm (Meters)', defaultQty: 10, badgeHint: '20g / meter' },
        { value: 'rolls', label: 'rolls (Fraction)', defaultQty: 0.1 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.2 },
        { value: 'g', label: 'g (Grams)', defaultQty: 200 }
      ];
    default:
      return [
        { value: 'pcs', label: 'pcs (Units)', defaultQty: 1 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.1 },
        { value: 'g', label: 'g (Grams)', defaultQty: 100 }
      ];
  }
};

const getDefaultMaterialsForProduct = (sku: string): UserInputItemEntry[] => {
  switch (sku) {
    case 'TR-305':
      return [
        { id: '1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' },
        { id: '2', materialId: 'MAT-004', quantity: 2, unit: 'pcs' },
        { id: '3', materialId: 'MAT-005', quantity: 3, unit: 'm' },
        { id: '4', materialId: 'MAT-007', quantity: 4, unit: 'm' },
      ];
    case 'GA-102':
      return [
        { id: '1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' },
        { id: '2', materialId: 'MAT-003', quantity: 85, unit: 'g' },
        { id: '3', materialId: 'MAT-007', quantity: 3, unit: 'm' },
      ];
    case 'BP-201':
      return [
        { id: '1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' },
        { id: '2', materialId: 'MAT-006', quantity: 1, unit: 'pcs' },
        { id: '3', materialId: 'MAT-003', quantity: 40, unit: 'g' },
        { id: '4', materialId: 'MAT-007', quantity: 2, unit: 'm' },
      ];
    default:
      return [
        { id: '1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' },
        { id: '2', materialId: 'MAT-007', quantity: 2, unit: 'm' },
      ];
  }
};

export const ApproachUserInput: React.FC<ApproachUserInputProps> = ({
  product: initialProduct,
  availableMaterials,
  onComplete,
  onBack,
}) => {
  const defaultProd = initialProduct || MOCK_PRODUCTS[0];
  const [selectedProduct, setSelectedProduct] = useState<Product>(defaultProd);
  const [productQuantity, setProductQuantity] = useState<number>(50);
  const [items, setItems] = useState<UserInputItemEntry[]>(
    getDefaultMaterialsForProduct(defaultProd.sku)
  );
  const [operatorNotes, setOperatorNotes] = useState<string>('Floor packing bench log.');

  // Sync with initialProduct when it changes
  React.useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setItems(getDefaultMaterialsForProduct(initialProduct.sku));
    }
  }, [initialProduct]);

  const [newMaterialId, setNewMaterialId] = useState<string>(availableMaterials[0]?.id || 'MAT-001');
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newUnit, setNewUnit] = useState<string>('pcs');

  const handleMaterialSelect = (matId: string) => {
    setNewMaterialId(matId);
    const compatibleUnits = getCompatibleUnitsForMaterial(matId, availableMaterials);
    if (compatibleUnits.length > 0) {
      setNewUnit(compatibleUnits[0].value);
      setNewQuantity(compatibleUnits[0].defaultQty);
    }
  };

  const currentAvailableUnits = getCompatibleUnitsForMaterial(newMaterialId, availableMaterials);
  const selectedMaterialMaster = availableMaterials.find(m => m.id === newMaterialId);
  const currentUnitMeta = currentAvailableUnits.find(u => u.value === newUnit);

  const handleAddNewItem = () => {
    if (newQuantity <= 0) return;
    const newItem: UserInputItemEntry = {
      id: `ui-${Date.now()}`,
      materialId: newMaterialId,
      quantity: newQuantity,
      unit: newUnit
    };
    setItems([...items, newItem]);
    
    if (currentAvailableUnits.length > 0) {
      setNewQuantity(currentAvailableUnits[0].defaultQty);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleItemQuantityChange = (id: string, qty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: Math.max(0.01, qty) } : item));
  };

  const handleItemUnitChange = (id: string, unit: string) => {
    setItems(items.map(item => item.id === id ? { ...item, unit } : item));
  };

  const calculateStandardKg = (entry: UserInputItemEntry): number => {
    const master = availableMaterials.find(m => m.id === entry.materialId);
    if (!master) return 0;

    const unit = entry.unit.toLowerCase();
    const qty = Number(entry.quantity) || 0;

    if (unit === 'g') {
      return qty / 1000;
    } else if (unit === 'kg') {
      return qty;
    } else if (unit === 'pcs') {
      return qty * (master.weightPerUnitKg || 0.45);
    } else if (unit === 'm') {
      if (master.id === 'MAT-005') return qty * 0.05;
      if (master.id === 'MAT-007') return qty * 0.007;
      if (master.id === 'MAT-009') return qty * 0.02;
      return qty * (master.weightPerUnitKg || 0.05);
    } else if (unit === 'm²') {
      if (master.id === 'MAT-008') return qty * 0.06;
      if (master.id === 'MAT-005') return qty * 0.05;
      return qty * 0.05;
    } else if (unit === 'rolls') {
      return qty * (master.weightPerUnitKg || 0.15);
    }
    return qty * (master.weightPerUnitKg || 0.1);
  };

  const totalPerUnitKg = items.reduce((sum, item) => sum + calculateStandardKg(item), 0);
  const totalPerUnitGrams = totalPerUnitKg * 1000;

  const handleSubmit = () => {
    const lineItems: PackagingLineItem[] = items.map((entry) => {
      const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
      const singleItemKg = calculateStandardKg(entry);
      const totalWeightKg = singleItemKg * productQuantity;

      return {
        id: `line-${entry.id}-${Date.now()}`,
        materialId: entry.materialId,
        materialName: master.name,
        category: master.category,
        quantity: entry.quantity * productQuantity,
        unit: entry.unit,
        weight: totalWeightKg,
        weightUnit: 'kg',
        weightKg: totalWeightKg,
        isSystemGenerated: false,
        notes: `Logged: ${entry.quantity} ${entry.unit}/unit`
      };
    });

    onComplete({
      product: selectedProduct,
      productQuantity,
      materials: lineItems,
      notes: operatorNotes
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Minimalist Top Context Header */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #059669',
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 7px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
              {selectedProduct.sku}
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {selectedProduct.name}
            </h2>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px' }}>
            Dynamic unit logger for manual packing benches with auto-conversion to standard SI kg.
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
            data-tooltip="Standardized SI mass computed automatically per unit"
          >
            <Scale size={12} color="#059669" />
            Active Bench Logger
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
            <ProductSearchCombobox
              products={MOCK_PRODUCTS}
              selectedProduct={selectedProduct}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                setItems(getDefaultMaterialsForProduct(p.sku));
              }}
              accentColor="#059669"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Packed Batch Quantity
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

      {/* Add Material Input Strip */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.25rem',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr auto', gap: '0.65rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Add Material</label>
            <select
              className="form-select"
              value={newMaterialId}
              onChange={(e) => handleMaterialSelect(e.target.value)}
              style={{ height: '36px', fontSize: '0.82rem', fontWeight: 600 }}
            >
              {availableMaterials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Quantity</label>
            <input
              type="number"
              className="form-input font-mono"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Math.max(0.01, parseFloat(e.target.value) || 0))}
              step={newUnit === 'kg' || newUnit === 'rolls' ? '0.1' : '1'}
              style={{ height: '36px', fontWeight: 700, fontSize: '0.84rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Unit</label>
            <select
              className="form-select font-mono"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              style={{ height: '36px', fontSize: '0.82rem', fontWeight: 700, borderColor: '#10B981' }}
            >
              {currentAvailableUnits.map(u => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddNewItem}
            className="btn btn-primary btn-sm"
            style={{ height: '36px', whiteSpace: 'nowrap', padding: '0 14px', fontWeight: 700, fontSize: '0.8rem' }}
          >
            <Plus size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Selected Materials Table Card */}
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
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Logged Packaging Items ({items.length})
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
            ● SI Unit Normalization Active
          </span>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Material</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Logged Qty & Unit</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', textAlign: 'right' }}>Normalized Mass</th>
                <th style={{ padding: '9px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => {
                const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
                const weightKg = calculateStandardKg(entry);
                const weightGrams = weightKg * 1000;

                return (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>{master.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{master.category} • {master.ppwrMaterialCode}</div>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="number"
                          value={entry.quantity}
                          onChange={(e) => handleItemQuantityChange(entry.id, parseFloat(e.target.value) || 0)}
                          style={{
                            width: '64px',
                            height: '28px',
                            padding: '2px 6px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem'
                          }}
                          step={entry.unit === 'kg' || entry.unit === 'rolls' ? '0.1' : '1'}
                        />
                        <select
                          value={entry.unit}
                          onChange={(e) => handleItemUnitChange(entry.id, e.target.value)}
                          style={{
                            height: '28px',
                            padding: '2px 4px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.78rem',
                            background: '#F8FAFC'
                          }}
                        >
                          {getCompatibleUnitsForMaterial(entry.materialId, availableMaterials).map(u => (
                            <option key={u.value} value={u.value}>{u.value}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                      {weightGrams.toFixed(0)} g ({weightKg.toFixed(3)} kg)
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveItem(entry.id)}
                        disabled={items.length <= 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: items.length <= 1 ? '#CBD5E1' : '#EF4444',
                          cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                          padding: '3px'
                        }}
                        title="Remove Line"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#ECFDF5', borderTop: '2px solid #A7F3D0' }}>
                <td colSpan={2} style={{ padding: '10px 12px', fontWeight: 800, color: '#065F46', fontSize: '0.84rem' }}>
                  Total Unit Mass
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '0.94rem', fontFamily: 'var(--font-mono)' }}>
                  {totalPerUnitGrams.toFixed(0)} g / unit ({totalPerUnitKg.toFixed(3)} kg)
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
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
