import React, { useState } from 'react';
import { 
  Search, 
  Database, 
  CheckCircle2, 
  Plus, 
  X 
} from 'lucide-react';
import { PackagingMaterialMaster, MaterialCategory, Plant } from '../../types';

interface PackagingInventoryViewProps {
  materials: PackagingMaterialMaster[];
  activePlant?: Plant;
  onAddNewMaterial?: (material: PackagingMaterialMaster) => void;
}

export const PackagingInventoryView: React.FC<PackagingInventoryViewProps> = ({
  materials,
  activePlant,
  onAddNewMaterial,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Material form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<MaterialCategory>('Paper/Cardboard');
  const [newStock, setNewStock] = useState(1000);
  const [newUnit, setNewUnit] = useState<'pcs' | 'kg' | 'rolls' | 'm'>('pcs');
  const [newWeightPerUnit, setNewWeightPerUnit] = useState(0.45);
  const [newDimensions, setNewDimensions] = useState('35 × 25 × 20 cm');
  const [newRecycledPct, setNewRecycledPct] = useState(80);
  const [newRecyclable, setNewRecyclable] = useState(true);
  const [newPpwrCode, setNewPpwrCode] = useState('PAP-20');
  const [newCo2, setNewCo2] = useState(0.85);
  const [newDesc, setNewDesc] = useState('');

  const categories = ['All', 'Paper/Cardboard', 'Paper', 'Plastic', 'Wood', 'Other'];

  const filteredMaterials = materials.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.ppwrMaterialCode.toLowerCase().includes(q);
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const totalStockKg = materials.reduce((sum, m) => {
    return sum + (m.stockUnit === 'pcs' ? m.availableStock * m.weightPerUnitKg : m.availableStock);
  }, 0);

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newName) return;

    const mat: PackagingMaterialMaster = {
      id: newId.toUpperCase().trim(),
      name: newName.trim(),
      category: newCat,
      availableStock: Number(newStock) || 100,
      stockUnit: newUnit,
      weightPerUnitKg: Number(newWeightPerUnit) || 1.0,
      unitName: newUnit,
      dimensions: newDimensions.trim() || undefined,
      recycledContentPct: Number(newRecycledPct) || 50,
      recyclable: newRecyclable,
      ppwrMaterialCode: newPpwrCode.toUpperCase().trim() || 'PAP-20',
      co2PerKg: Number(newCo2) || 1.2,
      description: newDesc || `Standard ${newCat} packaging commodity.`
    };

    if (onAddNewMaterial) {
      onAddNewMaterial(mat);
    }

    setIsAddModalOpen(false);
    setNewId('');
    setNewName('');
    setNewDimensions('35 × 25 × 20 cm');
    setNewDesc('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-inventory">
                <Database size={12} /> {activePlant && activePlant.id !== 'ALL_PLANTS' ? `${activePlant.name} WMS Stock` : 'Packaging Master Data'}
              </span>
              <span className="text-xs text-muted">
                {activePlant && activePlant.id !== 'ALL_PLANTS' ? `${activePlant.code} • ${activePlant.primaryErpSystem}` : `${materials.length} standard packaging commodities`}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              {activePlant && activePlant.id !== 'ALL_PLANTS' ? `${activePlant.name} Packaging Inventory` : 'Packaging Material Inventory & Spec Master'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#F8FAFC', padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Available Total Mass</div>
                <div className="font-mono font-bold text-base" style={{ color: '#0284C7' }}>
                  {Math.round(totalStockKg).toLocaleString()} kg
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Commodity Master</div>
                <div className="font-mono font-bold text-base" style={{ color: '#059669' }}>
                  Active Catalog
                </div>
              </div>
            </div>

            {onAddNewMaterial && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={15} />
                <span>Add Material</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search material, code, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="glass-card">
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Material ID</th>
                <th>Material Name & Description</th>
                <th>Category</th>
                <th>Standard Code</th>
                <th>Dimensions / Specs</th>
                <th>Available Inventory</th>
                <th>Standard Unit Mass</th>
                <th>Recycled Content</th>
                <th>Recyclable</th>
                <th>CO₂e Factor</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((mat) => (
                <tr key={mat.id}>
                  <td>
                    <span className="font-mono font-bold text-xs" style={{ color: '#0F172A' }}>
                      {mat.id}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{mat.name}</div>
                      <div className="text-xs text-muted" style={{ maxWidth: '300px' }}>
                        {mat.description}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {mat.category}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-semibold text-xs" style={{ color: '#0284C7', background: '#F0F9FF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #BAE6FD' }}>
                      {mat.ppwrMaterialCode}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs" style={{ color: '#334155', background: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                      {mat.dimensions || 'Standard / Roll'}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-bold" style={{ color: '#0F172A' }}>
                      {mat.availableStock.toLocaleString()} {mat.stockUnit}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-secondary">
                      {mat.stockUnit === 'pcs' ? `${mat.weightPerUnitKg} kg/pc` : '1.0 kg/kg'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: '40px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${mat.recycledContentPct}%`, height: '100%', background: '#059669' }} />
                      </div>
                      <span className="font-mono text-xs" style={{ color: '#059669', fontWeight: 600 }}>{mat.recycledContentPct}%</span>
                    </div>
                  </td>
                  <td>
                    {mat.recyclable ? (
                      <span style={{ color: '#059669', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                        <CheckCircle2 size={13} /> Yes
                      </span>
                    ) : (
                      <span style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 500 }}>
                        Non-Recyclable
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="font-mono text-xs" style={{ color: '#64748B' }}>
                      {mat.co2PerKg} kg/kg
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-inventory" style={{ fontSize: '0.7rem' }}>Inventory Master</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  Add Packaging Material Master
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Material ID</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. MAT-010"
                      value={newId}
                      onChange={(e) => setNewId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Material Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Wooden Crate / Skid"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value as MaterialCategory)}
                    >
                      <option value="Paper/Cardboard">Paper/Cardboard</option>
                      <option value="Paper">Paper</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Wood">Wood</option>
                      <option value="Metal">Metal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Material Code</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. FOR-50, PAP-20"
                      value={newPpwrCode}
                      onChange={(e) => setNewPpwrCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Dimensions / Specs</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. 35 × 25 × 20 cm or 50mm × 66m"
                      value={newDimensions}
                      onChange={(e) => setNewDimensions(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Available Stock</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input font-mono"
                      value={newStock}
                      onChange={(e) => setNewStock(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Stock Unit</label>
                    <select
                      className="form-select font-mono"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value as 'pcs' | 'kg' | 'rolls' | 'm')}
                    >
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="rolls">rolls</option>
                      <option value="m">meters</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Unit Mass (kg/unit)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.001"
                      className="form-input font-mono"
                      value={newWeightPerUnit}
                      onChange={(e) => setNewWeightPerUnit(parseFloat(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Recycled Content %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input font-mono"
                      value={newRecycledPct}
                      onChange={(e) => setNewRecycledPct(parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">CO₂e Factor (kg/kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      className="form-input font-mono"
                      value={newCo2}
                      onChange={(e) => setNewCo2(parseFloat(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Description / Specifications</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Material specs, FEFCO style, gauge thickness..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={15} />
                  <span>Save to Packaging Master</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
