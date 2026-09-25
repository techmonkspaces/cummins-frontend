import React from 'react';
import {
  Building2,
  Crown,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';
import { Plant, UserPersona } from '../../types';

interface HeaderProps {
  currentUser: UserPersona;
  activePlant: Plant;
  plants: Plant[];
  personas: UserPersona[];
  canSwitchRoles?: boolean;
  onSelectPlant: (plantId: string) => void;
  onSelectPersona: (personaId: string) => void;
  onLogout: () => void;
  onStartNewRecord: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activePlant,
  plants,
  personas,
  canSwitchRoles = false,
  onSelectPlant,
  onSelectPersona,
  onLogout,
  onStartNewRecord,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const getApproachBadge = () => {
    switch (activePlant.configuredMethod) {
      case 'INVENTORY':
        return (
          <span
            style={{
              background: '#F0F9FF',
              color: '#0284C7',
              border: '1px solid #BAE6FD',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            Approach A (Inventory)
          </span>
        );
      case 'CALCULATED':
        return (
          <span
            style={{
              background: '#FAF5FF',
              color: '#7C3AED',
              border: '1px solid #DDD6FE',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            Approach B (Calculated)
          </span>
        );
      case 'USER_INPUT':
        return (
          <span
            style={{
              background: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            Approach C (User Input)
          </span>
        );
    }
  };

  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 80,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem 0 6.5rem',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
    >
      {/* Left: Plant & Approach Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
          {activePlant.id === 'ALL_PLANTS' ? 'Global Operations Network' : activePlant.name}
        </span>
        <span style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>•</span>
        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
          {activePlant.id === 'ALL_PLANTS' ? 'All 3 Plants' : activePlant.code}
        </span>

        {activePlant.id !== 'ALL_PLANTS' && (
          <div style={{ marginLeft: '6px' }}>
            {getApproachBadge()}
          </div>
        )}
      </div>

      {/* Right: Quick Demo Persona Switcher & Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>

        {/* Quick Demo Switcher - Only visible if logged in as Super Admin */}
        {canSwitchRoles && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F8FAFC',
              padding: '5px 10px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Demo Role:
            </span>
            <select
              value={currentUser.id}
              onChange={(e) => onSelectPersona(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="PERSONA-ADMIN">Super Admin</option>
              <optgroup label="Pune Factory - Approach A">
                <option value="PERSONA-PUNE-MGR"> Manager</option>
                <option value="PERSONA-PUNE-OPR"> Data Entry</option>
              </optgroup>
              <optgroup label="Phaltan Factory - Approach B">
                <option value="PERSONA-PHALTAN-MGR"> Manager</option>
                <option value="PERSONA-PHALTAN-OPR"> Data Entry</option>
              </optgroup>
              <optgroup label="Jamshedpur Factory - Approach C">
                <option value="PERSONA-JAMSHEDPUR-MGR"> Manager</option>
                <option value="PERSONA-JAMSHEDPUR-OPR"> Data Entry</option>
              </optgroup>
            </select>
          </div>
        )}

        {/* Minimal Clean Sign Out Button */}
        <button
          onClick={onLogout}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Sign Out"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>

      </div>
    </header>
  );
};
