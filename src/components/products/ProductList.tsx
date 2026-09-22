import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Layers, 
  ArrowRight, 
  Scale, 
  Maximize2, 
  Filter,
  Plus,
  X
} from 'lucide-react';
import { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  categories: string[];
  onSelectProductForPackaging: (product: Product) => void;
  onAddNewProduct?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  onSelectProductForPackaging,
  onAddNewProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Powertrain Components');
  const [newWeight, setNewWeight] = useState(5.0);
  const [newLength, setNewLength] = useState(25);
  const [newWidth, setNewWidth] = useState(20);
  const [newHeight, setNewHeight] = useState(15);
  const [newFragility, setNewFragility] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newBatchSize, setNewBatchSize] = useState(500);
  const [newDesc, setNewDesc] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFragilityColor = (fragility: string) => {
    switch (fragility) {
      case 'High': return '#DC2626';
      case 'Medium': return '#D97706';
      case 'Heavy Duty': return '#7C3AED';
      default: return '#059669';
    }
  };

  const getFragilityBg = (fragility: string) => {
    switch (fragility) {
      case 'High': return '#FEF2F2';
      case 'Medium': return '#FFFBEB';
      case 'Heavy Duty': return '#FAF5FF';
      default: return '#ECFDF5';
    }
  };

  const getFragilityBorder = (fragility: string) => {
    switch (fragility) {
      case 'High': return '#FECACA';
      case 'Medium': return '#FDE68A';
      case 'Heavy Duty': return '#DDD6FE';
      default: return '#A7F3D0';
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    const prod: Product = {
      sku: newSku.toUpperCase().trim(),
      name: newName.trim(),
      category: newCat,
      weightKg: Number(newWeight) || 1,
      dimensionsCm: {
        length: Number(newLength) || 10,
        width: Number(newWidth) || 10,
        height: Number(newHeight) || 10
      },
      volumeCm3: (Number(newLength) || 10) * (Number(newWidth) || 10) * (Number(newHeight) || 10),
      fragility: newFragility,
      defaultBatchSize: Number(newBatchSize) || 100,
      description: newDesc || `Industrial ${newCat} spare component.`
    };

    if (onAddNewProduct) {
      onAddNewProduct(prod);
    }

    setIsAddModalOpen(false);
    // Reset
    setNewSku('');
    setNewName('');
    setNewDesc('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Controls */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Product Master Catalog
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Select an industrial spare part or assembly to initiate packaging consumption recording
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '440px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search SKU or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>

            {onAddNewProduct && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsAddModalOpen(true)}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            <Filter size={13} /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid-cols-2">
        {filteredProducts.map((product) => {
          const isHighlighted = product.sku === 'GA-102';

          return (
            <div
              key={product.sku}
              className="glass-card glass-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isHighlighted ? '2px solid #DA291C' : '1px solid var(--border-subtle)',
                position: 'relative',
                background: '#FFFFFF'
              }}
            >
              {isHighlighted && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '-10px', 
                    right: '16px', 
                    background: '#DA291C', 
                    color: '#fff', 
                    padding: '2px 10px', 
                    borderRadius: '999px', 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    letterSpacing: '0.5px',
                    boxShadow: 'var(--shadow-glow-red)'
                  }}
                >
                  ⭐ DEMO SCENARIO PRODUCT
                </div>
              )}

              <div>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="font-mono text-sm font-bold" style={{ color: '#DA291C', background: '#FEE2E2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #FECACA' }}>
                        {product.sku}
                      </span>
                      <span className="text-xs text-secondary font-medium">
                        {product.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>
                      {product.name}
                    </h3>
                  </div>

                  <span 
                    className="badge" 
                    style={{ 
                      background: getFragilityBg(product.fragility),
                      color: getFragilityColor(product.fragility),
                      border: `1px solid ${getFragilityBorder(product.fragility)}`
                    }}
                  >
                    Fragility: {product.fragility}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.45 }}>
                  {product.description}
                </p>

                {/* Specs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Scale size={12} /> Product Mass
                    </div>
                    <div className="font-mono font-bold text-sm" style={{ color: '#0F172A' }}>
                      {product.weightKg} kg
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Maximize2 size={12} /> Dimensions
                    </div>
                    <div className="font-mono font-bold text-sm" style={{ color: '#0F172A' }}>
                      {product.dimensionsCm.length}×{product.dimensionsCm.width}×{product.dimensionsCm.height} cm
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Package size={12} /> Volume
                    </div>
                    <div className="font-mono font-bold text-sm" style={{ color: '#0F172A' }}>
                      {product.volumeCm3.toLocaleString()} cm³
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Standard batch: <strong style={{ color: '#0F172A' }}>{product.defaultBatchSize} units</strong>
                </span>
                
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onSelectProductForPackaging(product)}
                >
                  <Layers size={14} />
                  <span>Record Packaging</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Master Catalog</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  Add New Product Master
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">SKU / Part Number</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      placeholder="e.g. EP-801"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Engine Piston Assembly"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                    >
                      <option value="Powertrain Components">Powertrain Components</option>
                      <option value="Chassis & Braking">Chassis & Braking</option>
                      <option value="Fluid Handling & Controls">Fluid Handling & Controls</option>
                      <option value="Maintenance & Service Kits">Maintenance & Service Kits</option>
                      <option value="Air & Exhaust Systems">Air & Exhaust Systems</option>
                      <option value="Fuel Systems">Fuel Systems</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Product Mass (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      className="form-input font-mono"
                      value={newWeight}
                      onChange={(e) => setNewWeight(parseFloat(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                    Dimensions ($L \times W \times H$ in cm)
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginTop: '0.4rem' }}>
                    <input
                      type="number"
                      className="form-input font-mono"
                      placeholder="Length cm"
                      value={newLength}
                      onChange={(e) => setNewLength(parseFloat(e.target.value) || 1)}
                      required
                    />
                    <input
                      type="number"
                      className="form-input font-mono"
                      placeholder="Width cm"
                      value={newWidth}
                      onChange={(e) => setNewWidth(parseFloat(e.target.value) || 1)}
                      required
                    />
                    <input
                      type="number"
                      className="form-input font-mono"
                      placeholder="Height cm"
                      value={newHeight}
                      onChange={(e) => setNewHeight(parseFloat(e.target.value) || 1)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Fragility Classification</label>
                    <select
                      className="form-select"
                      value={newFragility}
                      onChange={(e) => setNewFragility(e.target.value as 'Low' | 'Medium' | 'High')}
                    >
                      <option value="Low">Low (Rugged Metal/Castings)</option>
                      <option value="Medium">Medium (Machined Gears/Surfaces)</option>
                      <option value="High">High (Calibrated/Sensors/Glass)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Standard Batch Size</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input font-mono"
                      value={newBatchSize}
                      onChange={(e) => setNewBatchSize(parseInt(e.target.value) || 100)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Description / Packaging Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Brief industrial component description..."
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
                  <span>Save to Product Master</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
