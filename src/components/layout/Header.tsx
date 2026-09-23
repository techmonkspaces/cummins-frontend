import React from 'react';
import { 
  PlusCircle, 
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
        padding: '0 1.75rem',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
    >
      {/* Left: Plant & Approach Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div 
          style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: isSuperAdmin ? '#FFF5F5' : '#F8FAFC', 
            border: isSuperAdmin ? '1px solid #FECACA' : '1px solid #E2E8F0',
            color: isSuperAdmin ? '#DA291C' : '#0F172A', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 800
          }}
        >
          {isSuperAdmin ? <Crown size={16} color="#DA291C" /> : <Building2 size={16} color="#0284C7" />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                {isSuperAdmin ? 'Global Operations Network' : activePlant.name}
              </span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                {isSuperAdmin ? 'All 3 Plants' : activePlant.code}
              </span>
            </div>
          </div>

          {!isSuperAdmin && (
            <div style={{ marginLeft: '4px' }}>
              {getApproachBadge()}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Action CTAs & User Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        
        {/* Super Admin Plant Switcher (Only visible to Super Admin) */}
        {isSuperAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '4px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Scope:</span>
            <select
              value={activePlant.id}
              onChange={(e) => onSelectPlant(e.target.value)}
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
              <option value="ALL_PLANTS">All Factories (Consolidated)</option>
              {plants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Record CTA */}
        <button 
          className="btn btn-primary btn-sm"
          onClick={onStartNewRecord}
          style={{ whiteSpace: 'nowrap', fontWeight: 700, padding: '7px 14px' }}
        >
          <PlusCircle size={15} />
          <span>Record Packaging</span>
        </button>

        {/* User Pill & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px', borderLeft: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: isSuperAdmin ? '#DA291C' : '#059669', fontWeight: 700 }}>
              {isSuperAdmin ? 'Super Admin' : 'Factory User'}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            title="Sign Out"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
};
