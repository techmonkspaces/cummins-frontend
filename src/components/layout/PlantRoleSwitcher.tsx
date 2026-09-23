import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Check, 
  Cpu, 
  Database, 
  Calculator, 
  Edit3, 
  Globe2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { Plant, UserPersona, RecordingMethod } from '../../types';

interface PlantRoleSwitcherProps {
  plants: Plant[];
  personas: UserPersona[];
  activePlant: Plant;
  activePersona: UserPersona;
  onSelectPlant: (plantId: string) => void;
  onSelectPersona: (personaId: string) => void;
}

export const PlantRoleSwitcher: React.FC<PlantRoleSwitcherProps> = ({
  plants,
  personas,
  activePlant,
  activePersona,
  onSelectPlant,
  onSelectPersona,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getMethodBadge = (method: RecordingMethod) => {
    switch (method) {
      case 'INVENTORY':
        return (
          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Database size={10} /> Approach A (ERP Sync)
          </span>
        );
      case 'CALCULATED':
        return (
          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#FAF5FF', color: '#7C3AED', border: '1px solid #DDD6FE', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Calculator size={10} /> Approach B (Automated Rules)
          </span>
        );
      case 'USER_INPUT':
        return (
          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Edit3 size={10} /> Approach C (Floor Log)
          </span>
        );
    }
  };

  return (
    <div className="plant-switcher-container" ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease',
          textAlign: 'left'
        }}
      >
        <div 
          style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            background: activePersona.isGlobalAdmin ? '#0F172A' : 'var(--cummins-red-light)', 
            color: activePersona.isGlobalAdmin ? '#FFFFFF' : 'var(--cummins-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {activePersona.isGlobalAdmin ? <Globe2 size={16} /> : <Building2 size={16} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '160px', maxWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activePersona.isGlobalAdmin ? 'Global Admin (All Sites)' : activePlant.shortName}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
              {activePersona.isGlobalAdmin ? 'GLOBAL' : activePlant.code}
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck size={11} color="#059669" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activePersona.name} • {activePersona.roleTitle.split('(')[0]}
            </span>
          </div>
        </div>

        <ChevronDown size={15} style={{ color: '#64748B', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '380px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          {/* Menu Header */}
          <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Factory & Role Selection (RBAC)
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Pre-Configured Plant Methodologies
              </div>
            </div>
            <span style={{ fontSize: '0.65rem', background: '#DA291C', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              ENTERPRISE
            </span>
          </div>

          {/* Plant List */}
          <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', padding: '4px 8px', textTransform: 'uppercase' }}>
              Manufacturing Plants (Site-Level Approach)
            </div>

            {plants.map((plant) => {
              const isSelected = activePlant.id === plant.id && !activePersona.isGlobalAdmin;
              return (
                <div
                  key={plant.id}
                  onClick={() => {
                    onSelectPlant(plant.id);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#F8FAFC' : 'transparent',
                    border: isSelected ? '1.5px solid #0284C7' : '1.5px solid transparent',
                    marginBottom: '4px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                        {plant.shortName}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                        ({plant.code})
                      </span>
                    </div>
                    {isSelected && <Check size={16} color="#0284C7" strokeWidth={3} />}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '6px' }}>
                    {plant.location}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    {getMethodBadge(plant.configuredMethod)}
                    <span style={{ fontSize: '0.65rem', color: '#64748B', background: '#F8FAFC', padding: '1px 5px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                      {plant.primaryErpSystem}
                    </span>
                  </div>
                </div>
              );
            })}

            <div style={{ borderTop: '1px solid #E2E8F0', margin: '6px 0', paddingTop: '6px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', padding: '4px 8px', textTransform: 'uppercase' }}>
                Global Multi-Site Roles
              </div>

              {personas.filter(p => p.isGlobalAdmin).map((adminPersona) => {
                const isSelected = activePersona.id === adminPersona.id;
                return (
                  <div
                    key={adminPersona.id}
                    onClick={() => {
                      onSelectPersona(adminPersona.id);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected ? '#0F172A' : '#F8FAFC',
                      color: isSelected ? '#FFFFFF' : '#0F172A',
                      border: isSelected ? '1.5px solid #0F172A' : '1.5px solid #E2E8F0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Globe2 size={16} color={isSelected ? '#38BDF8' : '#0284C7'} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          {adminPersona.name}
                        </span>
                      </div>
                      {isSelected && <Check size={16} color="#38BDF8" strokeWidth={3} />}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isSelected ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                      {adminPersona.roleTitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer explanation */}
          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderTop: '1px solid #E2E8F0', fontSize: '0.7rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#059669" />
            <span>Methodologies are pre-calibrated per factory. Plant users record directly into their site workflow.</span>
          </div>
        </div>
      )}
    </div>
  );
};
