import React, { useState } from 'react';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Building2,
  Package,
  Layers,
  Scale,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { Product, PackagingLineItem, PackagingMaterialMaster } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockData';

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

// Function to resolve natural and compatible measurement units for each industrial material
const getCompatibleUnitsForMaterial = (materialId: string, masterList: PackagingMaterialMaster[]): UnitOption[] => {
  const master = masterList.find(m => m.id === materialId);
  if (!master) {
    return [{ value: 'pcs', label: 'pcs (Pieces)', defaultQty: 1 }];
  }

  switch (master.id) {
    case 'MAT-001': // Cardboard Box
      return [
        { value: 'pcs', label: 'pcs (Cartons/Boxes)', defaultQty: 1, badgeHint: '450g / box' },
        { value: 'kg', label: 'kg (Carton Mass)', defaultQty: 0.45 },
        { value: 'g', label: 'g (Grams)', defaultQty: 450 }
      ];
    case 'MAT-002': // Corrugated Cardboard Sheets
      return [
        { value: 'pcs', label: 'pcs (Corrugated Sheets)', defaultQty: 2, badgeHint: '1.0 kg/unit' },
        { value: 'kg', label: 'kg (Sheet Weight)', defaultQty: 0.5 },
        { value: 'g', label: 'g (Grams)', defaultQty: 500 }
      ];
    case 'MAT-003': // Kraft Paper Cushioning
      return [
        { value: 'g', label: 'g (Grams)', defaultQty: 100, badgeHint: 'Void fill mass' },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.1 }
      ];
    case 'MAT-004': // Thermocol / EPS End-Caps
      return [
        { value: 'pcs', label: 'pcs (Corner Blocks)', defaultQty: 2, badgeHint: '80g / block' },
        { value: 'g', label: 'g (Grams)', defaultQty: 60 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.06 }
      ];
    case 'MAT-005': // LDPE Bubble Wrap
      return [
        { value: 'm', label: 'm (Meters Length)', defaultQty: 2, badgeHint: '50g / meter' },
        { value: 'm²', label: 'm² (Square Area)', defaultQty: 1 },
        { value: 'rolls', label: 'rolls (Roll Fraction)', defaultQty: 0.05 },
        { value: 'g', label: 'g (Grams Scale)', defaultQty: 100 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.1 }
      ];
    case 'MAT-006': // VCI Anti-Rust Poly Bag
      return [
        { value: 'pcs', label: 'pcs (Bags/Liners)', defaultQty: 1, badgeHint: '30g / bag' },
        { value: 'g', label: 'g (Grams)', defaultQty: 30 }
      ];
    case 'MAT-007': // Packaging Seam Tape
      return [
        { value: 'm', label: 'm (Meters Seam Length)', defaultQty: 3, badgeHint: '7g / meter' },
        { value: 'g', label: 'g (Grams Tape)', defaultQty: 20 },
        { value: 'rolls', label: 'rolls (Roll Fraction)', defaultQty: 0.05 }
      ];
    case 'MAT-008': // EPE Foam Sheet
      return [
        { value: 'pcs', label: 'pcs (Foam Sheets)', defaultQty: 1, badgeHint: '60g / sheet' },
        { value: 'm²', label: 'm² (Square Area)', defaultQty: 0.5 },
        { value: 'g', label: 'g (Grams)', defaultQty: 60 }
      ];
    case 'MAT-009': // Pallet Stretch Film
      return [
        { value: 'm', label: 'm (Meters Wrap)', defaultQty: 10, badgeHint: '20g / meter' },
        { value: 'rolls', label: 'rolls (Roll Fraction)', defaultQty: 0.1 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.2 },
        { value: 'g', label: 'g (Grams)', defaultQty: 200 }
      ];
    default:
      if (master.stockUnit === 'm') {
        return [
          { value: 'm', label: 'm (Meters)', defaultQty: 2 },
          { value: 'g', label: 'g (Grams)', defaultQty: 50 },
          { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.05 }
        ];
      }
      return [
        { value: master.stockUnit || 'pcs', label: `${master.stockUnit} (${master.unitName})`, defaultQty: 1 },
        { value: 'g', label: 'g (Grams)', defaultQty: 100 },
        { value: 'kg', label: 'kg (Kilograms)', defaultQty: 0.1 }
      ];
  }
};

// Default product BOM packaging templates
const getDefaultMaterialsForProduct = (sku: string): UserInputItemEntry[] => {
  switch (sku) {
    case 'GA-102': // Fuel Generator Assembly (Heavy 42kg)
      return [
        { id: 'ui-1', materialId: 'MAT-002', quantity: 2, unit: 'pcs' }, // Corrugated Sheets
        { id: 'ui-2', materialId: 'MAT-009', quantity: 15, unit: 'm' },  // Stretch Film
        { id: 'ui-3', materialId: 'MAT-006', quantity: 1, unit: 'pcs' }, // VCI Poly Bag
        { id: 'ui-4', materialId: 'MAT-007', quantity: 5, unit: 'm' }   // Packaging Tape
      ];
    case 'BP-201': // Brake Assembly (5.5kg)
      return [
        { id: 'ui-1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' }, // Cardboard Box
        { id: 'ui-2', materialId: 'MAT-003', quantity: 100, unit: 'g' }, // Kraft Cushioning
        { id: 'ui-3', materialId: 'MAT-004', quantity: 60, unit: 'g' },  // Thermocol / EPS
        { id: 'ui-4', materialId: 'MAT-007', quantity: 20, unit: 'g' }  // Packaging Tape
      ];
    case 'VL-310': // Exhaust Control Valve (2.8kg)
      return [
        { id: 'ui-1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' }, // Cardboard Box
        { id: 'ui-2', materialId: 'MAT-005', quantity: 2, unit: 'm' },   // LDPE Bubble Wrap (meters)
        { id: 'ui-3', materialId: 'MAT-006', quantity: 1, unit: 'pcs' }, // VCI Bag
        { id: 'ui-4', materialId: 'MAT-007', quantity: 3, unit: 'm' }   // Tape (meters)
      ];
    case 'SP-415': // Piston Sub-Assembly (1.2kg)
      return [
        { id: 'ui-1', materialId: 'MAT-006', quantity: 1, unit: 'pcs' }, // VCI Bag
        { id: 'ui-2', materialId: 'MAT-005', quantity: 1, unit: 'm' },   // Bubble Wrap
        { id: 'ui-3', materialId: 'MAT-001', quantity: 1, unit: 'pcs' }  // Box
      ];
    case 'TC-550': // Turbocharger Core (8.4kg)
      return [
        { id: 'ui-1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' }, // Cardboard Box
        { id: 'ui-2', materialId: 'MAT-008', quantity: 2, unit: 'pcs' }, // EPE Foam Sheet
        { id: 'ui-3', materialId: 'MAT-007', quantity: 4, unit: 'm' },   // Tape
        { id: 'ui-4', materialId: 'MAT-009', quantity: 8, unit: 'm' }    // Stretch Film
      ];
    case 'IN-108': // Electronic Fuel Injector (0.45kg)
      return [
        { id: 'ui-1', materialId: 'MAT-006', quantity: 1, unit: 'pcs' }, // Anti-Static VCI Bag
        { id: 'ui-2', materialId: 'MAT-005', quantity: 0.5, unit: 'm' }, // Bubble Wrap
        { id: 'ui-3', materialId: 'MAT-001', quantity: 1, unit: 'pcs' }  // Small Box
      ];
    default:
      return [
        { id: 'ui-1', materialId: 'MAT-001', quantity: 1, unit: 'pcs' },
        { id: 'ui-2', materialId: 'MAT-003', quantity: 80, unit: 'g' },
        { id: 'ui-3', materialId: 'MAT-007', quantity: 2, unit: 'm' }
      ];
  }
};

export const ApproachUserInput: React.FC<ApproachUserInputProps> = ({
  product: initialProduct,
  availableMaterials,
  onComplete,
  onBack,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProduct);
  const productQuantity = 1; // Per-unit logging — each record is for 1 unit
  const [operatorNotes, setOperatorNotes] = useState('Jamshedpur Factory floor station entry. Verified with Toledo digital bench scale.');

  // Pre-filled materials configured to match selected product
  const [items, setItems] = useState<UserInputItemEntry[]>(() => getDefaultMaterialsForProduct(initialProduct.sku));

  // Current Input Selection State with Smart Unit Defaults
  const initialMaterialId = availableMaterials[0]?.id || 'MAT-001';
  const initialUnits = getCompatibleUnitsForMaterial(initialMaterialId, availableMaterials);

  const [newMaterialId, setNewMaterialId] = useState<string>(initialMaterialId);
  const [newQuantity, setNewQuantity] = useState<number>(initialUnits[0]?.defaultQty || 1);
  const [newUnit, setNewUnit] = useState<string>(initialUnits[0]?.value || 'pcs');

  // Handle Material Selection Change -> Automatically adapt Unit & recommended Qty!
  const handleMaterialSelect = (materialId: string) => {
    setNewMaterialId(materialId);
    const compatibleUnits = getCompatibleUnitsForMaterial(materialId, availableMaterials);
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
    
    // Reset quantity to default
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

  // Convert all items and units into standardized SI kilograms (Kg)
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
      if (master.id === 'MAT-005') return qty * 0.05; // 50g per meter of bubble wrap
      if (master.id === 'MAT-007') return qty * 0.007; // 7g per meter of sealing tape
      if (master.id === 'MAT-009') return qty * 0.02; // 20g per meter of stretch film
      return qty * (master.weightPerUnitKg || 0.05);
    } else if (unit === 'm²') {
      if (master.id === 'MAT-008') return qty * 0.06; // 60g per m2 of foam sheet
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
        notes: `Operator entered: ${entry.quantity} ${entry.unit}/unit`
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          borderRadius: '14px',
          padding: '1.5rem',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
              <Building2 size={13} /> JAMSHEDPUR FACTORY • APPROACH C
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Approach C — Actual Packaging Used (Floor User Input)
            </h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
              Dynamic unit-aware logger for custom crates, bubble wraps, foam inserts, and bench scale measurements.
            </p>
          </div>

          <div 
            style={{
              background: '#FFFFFF',
              color: '#047857',
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
            <Edit3 size={15} /> OPERATOR INPUT STATION
          </div>
        </div>
      </div>

      {/* Product Selection Card */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem' }}>Target Product</label>
            <select
              className="form-select font-mono"
              value={selectedProduct.sku}
              onChange={(e) => {
                const p = MOCK_PRODUCTS.find(x => x.sku === e.target.value) || selectedProduct;
                setSelectedProduct(p);
                setItems(getDefaultMaterialsForProduct(p.sku));
              }}
              style={{ height: '42px', fontWeight: 700, fontSize: '0.9rem' }}
            >
              {MOCK_PRODUCTS.map(p => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name} ({p.weightKg} kg)
                </option>
              ))}
            </select>
          </div>
      </div>

      {/* Add Material Interactive Input Bar with Smart Dynamic Units */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Packaging Material Used (Add to Bill of Materials)
          </div>
          {currentUnitMeta?.badgeHint && (
            <span style={{ fontSize: '0.72rem', color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
              ⚡ Auto-calibrated: {currentUnitMeta.badgeHint}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.3fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
          
          {/* Material Select */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Material</label>
            <select
              className="form-select"
              value={newMaterialId}
              onChange={(e) => handleMaterialSelect(e.target.value)}
              style={{ height: '40px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              {availableMaterials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Quantity</label>
            <input
              type="number"
              className="form-input font-mono"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Math.max(0.01, parseFloat(e.target.value) || 0))}
              step={newUnit === 'kg' || newUnit === 'rolls' ? '0.1' : '1'}
              style={{ height: '40px', fontWeight: 700 }}
            />
          </div>

          {/* Dynamic Unit Dropdown matching selected material */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Unit</label>
            <select
              className="form-select font-mono"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              style={{ height: '40px', fontSize: '0.85rem', fontWeight: 700, borderColor: '#10B981' }}
            >
              {currentAvailableUnits.map(u => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add CTA */}
          <button
            type="button"
            onClick={handleAddNewItem}
            className="btn btn-primary"
            style={{ height: '40px', whiteSpace: 'nowrap', padding: '0 18px', fontWeight: 700 }}
          >
            <Plus size={16} />
            <span>Add Material</span>
          </button>
        </div>

        {/* Dynamic unit helper text */}
        <div style={{ marginTop: '0.65rem', fontSize: '0.73rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={13} color="#059669" />
          <span>
            Selected: <strong>{selectedMaterialMaster?.name}</strong>. Unit automatically configured to <strong>{currentUnitMeta?.label || newUnit}</strong>.
          </span>
        </div>
      </div>

      {/* Selected Materials List Table */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Selected Packaging Materials ({items.length})
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
            Real-Time Kilogram Conversion
          </span>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '1.25rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Material</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Logged Quantity & Unit</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', textAlign: 'right' }}>Normalized Weight</th>
                <th style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => {
                const master = availableMaterials.find(m => m.id === entry.materialId) || availableMaterials[0];
                const weightKg = calculateStandardKg(entry);
                const weightGrams = weightKg * 1000;

                return (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{master.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{master.category} • {master.ppwrMaterialCode}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          value={entry.quantity}
                          onChange={(e) => handleItemQuantityChange(entry.id, parseFloat(e.target.value) || 0)}
                          style={{
                            width: '76px',
                            height: '32px',
                            padding: '2px 8px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem'
                          }}
                          step={entry.unit === 'kg' || entry.unit === 'rolls' ? '0.1' : '1'}
                        />
                        <select
                          value={entry.unit}
                          onChange={(e) => handleItemUnitChange(entry.id, e.target.value)}
                          style={{
                            height: '32px',
                            padding: '2px 6px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            background: '#F8FAFC'
                          }}
                        >
                          {getCompatibleUnitsForMaterial(entry.materialId, availableMaterials).map(u => (
                            <option key={u.value} value={u.value}>{u.value}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                      {weightGrams.toFixed(0)} g ({weightKg.toFixed(3)} kg)
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveItem(entry.id)}
                        disabled={items.length <= 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: items.length <= 1 ? '#CBD5E1' : '#EF4444',
                          cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                          padding: '4px'
                        }}
                        title="Remove Line"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#ECFDF5', borderTop: '2px solid #A7F3D0' }}>
                <td colSpan={2} style={{ padding: '12px 14px', fontWeight: 800, color: '#065F46' }}>
                  Total Packaging Mass per Product
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>
                  {totalPerUnitGrams.toFixed(0)} g / unit ({totalPerUnitKg.toFixed(3)} kg)
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="btn btn-secondary">
            Back
          </button>
          
          <button 
            onClick={handleSubmit}
            className="btn btn-primary btn-lg"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            <span>Save Packaging Record & View Summary</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
