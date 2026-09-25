import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Layers } from 'lucide-react';
import { PackagingMaterialMaster } from '../../types';

interface MaterialSearchComboboxProps {
  materials: PackagingMaterialMaster[];
  selectedMaterialId: string;
  onSelectMaterial: (material: PackagingMaterialMaster) => void;
  accentColor?: string;
}

export const MaterialSearchCombobox: React.FC<MaterialSearchComboboxProps> = ({
  materials,
  selectedMaterialId,
  onSelectMaterial,
  accentColor = '#059669'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0];

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

  const filteredMaterials = materials.filter(m => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      m.id.toLowerCase().includes(term) ||
      m.name.toLowerCase().includes(term) ||
      (m.category && m.category.toLowerCase().includes(term)) ||
      (m.ppwrMaterialCode && m.ppwrMaterialCode.toLowerCase().includes(term))
    );
  });

  const handleSelect = (material: PackagingMaterialMaster) => {
    onSelectMaterial(material);
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
          height: '36px',
          padding: '0 10px',
          background: '#FFFFFF',
          border: isOpen ? `1.5px solid ${accentColor}` : '1px solid #CBD5E1',
          borderRadius: '6px',
          cursor: 'pointer',
          boxShadow: isOpen ? `0 0 0 3px ${accentColor}15` : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
          <span 
            style={{ 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              color: '#0F172A', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {selectedMaterial ? selectedMaterial.name : 'Select Material...'}
          </span>
          {selectedMaterial && (
            <span 
              style={{ 
                fontSize: '0.7rem', 
                color: '#64748B', 
                background: '#F1F5F9', 
                padding: '1px 6px', 
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                flexShrink: 0 
              }}
            >
              {selectedMaterial.category}
            </span>
          )}
        </div>

        <ChevronDown 
          size={15} 
          color="#64748B" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.15s ease',
            flexShrink: 0,
            marginLeft: '6px'
          }} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            minWidth: '320px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Search Input Bar */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC' }}>
            <Search size={14} color="#64748B" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search packaging material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.8rem',
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
                <X size={13} />
              </button>
            )}
          </div>

          {/* Material Items List */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '4px' }}>
            {filteredMaterials.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem' }}>
                No matching materials found
              </div>
            ) : (
              filteredMaterials.map((m) => {
                const isSelected = m.id === selectedMaterialId;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelect(m)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 9px',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.name}
                          </span>
                          <span 
                            style={{ 
                              fontSize: '0.66rem', 
                              color: isSelected ? accentColor : '#64748B', 
                              background: isSelected ? `${accentColor}20` : '#F1F5F9', 
                              padding: '1px 5px', 
                              borderRadius: '3px',
                              fontWeight: 600,
                              flexShrink: 0
                            }}
                          >
                            {m.category}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '1px' }}>
                          {m.ppwrMaterialCode ? `${m.ppwrMaterialCode} • ` : ''}{m.weightPerUnitKg ? `${(m.weightPerUnitKg * 1000).toFixed(0)}g` : ''}{m.dimensions ? ` • ${m.dimensions}` : ''}
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check size={15} color={accentColor} style={{ flexShrink: 0, marginLeft: '6px' }} />}
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
