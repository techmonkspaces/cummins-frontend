import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { Product } from '../../types';

interface ProductSearchComboboxProps {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (product: Product) => void;
  accentColor?: string;
}

export const ProductSearchCombobox: React.FC<ProductSearchComboboxProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  accentColor = '#0284C7'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.sku.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term))
    );
  });

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Box */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '40px',
          padding: '0 12px',
          background: '#FFFFFF',
          border: isOpen ? `1.5px solid ${accentColor}` : '1px solid #CBD5E1',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: isOpen ? `0 0 0 3px ${accentColor}15` : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
          <span 
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.78rem', 
              fontWeight: 800, 
              color: accentColor, 
              background: `${accentColor}12`, 
              padding: '2px 6px', 
              borderRadius: '4px',
              border: `1px solid ${accentColor}30`,
              flexShrink: 0
            }}
          >
            {selectedProduct.sku}
          </span>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedProduct.name}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748B', whiteSpace: 'nowrap', flexShrink: 0 }}>
            ({selectedProduct.weightKg} kg{selectedProduct.dimensionsCm ? ` • ${selectedProduct.dimensionsCm.length}×${selectedProduct.dimensionsCm.width}×${selectedProduct.dimensionsCm.height} cm` : ''})
          </span>
        </div>

        <ChevronDown 
          size={16} 
          color="#64748B" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.15s ease',
            flexShrink: 0,
            marginLeft: '8px'
          }} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            minWidth: '380px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Search Input Bar */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC' }}>
            <Search size={15} color="#64748B" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by SKU or Product Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.82rem',
                color: '#0F172A',
                fontWeight: 600
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: '#94A3B8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Product Items List */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '4px' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                No matching products found
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isSelected = p.sku === selectedProduct.sku;
                return (
                  <div
                    key={p.sku}
                    onClick={() => handleSelect(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isSelected ? `${accentColor}10` : 'transparent',
                      transition: 'background 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '0.78rem', 
                          fontWeight: 800, 
                          color: isSelected ? accentColor : '#475569', 
                          background: isSelected ? `${accentColor}20` : '#F1F5F9', 
                          padding: '2px 6px', 
                          borderRadius: '4px' 
                        }}
                      >
                        {p.sku}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {p.weightKg} kg net mass {p.dimensionsCm ? `• ${p.dimensionsCm.length}×${p.dimensionsCm.width}×${p.dimensionsCm.height} cm` : ''} {p.fragility ? `• ${p.fragility} Fragility` : ''}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check size={16} color={accentColor} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
