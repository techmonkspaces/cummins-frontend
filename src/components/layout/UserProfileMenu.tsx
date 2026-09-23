import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  ChevronDown, 
  Crown, 
  Building2, 
  Edit3, 
  LogOut, 
  Check, 
  ShieldCheck, 
  KeyRound,
  UserCheck
} from 'lucide-react';
import { UserPersona, UserRoleType } from '../../types';
import { MOCK_PERSONAS } from '../../data/mockData';

interface UserProfileMenuProps {
  currentUser: UserPersona;
  onSelectPersona: (personaId: string) => void;
  onLogout: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  currentUser,
  onSelectPersona,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (role: UserRoleType) => {
    switch (role) {
      case 'SUPER_ADMIN': return <Crown size={14} color="#FBBF24" />;
      case 'FACTORY_ADMIN': return <Building2 size={14} color="#0284C7" />;
      case 'DATA_ENTRY': return <Edit3 size={14} color="#059669" />;
    }
  };

  const getRoleBadge = (role: UserRoleType) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#FEE2E2', color: '#DA291C', padding: '2px 8px', borderRadius: '4px', border: '1px solid #FECACA' }}>
            SUPER ADMIN
          </span>
        );
      case 'FACTORY_ADMIN':
        return (
          <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#F0F9FF', color: '#0284C7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BAE6FD' }}>
            FACTORY ADMIN
          </span>
        );
      case 'DATA_ENTRY':
        return (
          <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
            DATA ENTRY
          </span>
        );
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '8px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease'
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: currentUser.role === 'SUPER_ADMIN' ? '#0F172A' : currentUser.role === 'FACTORY_ADMIN' ? '#0284C7' : '#059669',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.78rem'
          }}
        >
          {currentUser.name.split(' ').map(n => n[0]).join('')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
              {currentUser.name}
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
            {getRoleBadge(currentUser.role)}
          </div>
        </div>

        <ChevronDown size={14} style={{ color: '#64748B', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Profile Menu Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '320px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease'
          }}
        >
          {/* User Info Header */}
          <div style={{ background: '#F8FAFC', padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {getRoleIcon(currentUser.role)}
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>
                {currentUser.name}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
              {currentUser.email}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#0F172A', marginTop: '4px', fontWeight: 600 }}>
              {currentUser.roleTitle}
            </div>
          </div>

          {/* Quick Persona Switcher (Super Admin Only) */}
          {currentUser.role === 'SUPER_ADMIN' && (
            <div style={{ padding: '8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', padding: '4px 8px', textTransform: 'uppercase' }}>
                Switch Account Context
              </div>

              {MOCK_PERSONAS.map((p) => {
                const isSelected = p.id === currentUser.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPersona(p.id);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isSelected ? '#F1F5F9' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getRoleIcon(p.role)}
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                          {p.role === 'SUPER_ADMIN' ? 'Super Admin' : p.role === 'FACTORY_ADMIN' ? `Factory Admin (${p.plantName.replace('Cummins ', '')})` : 'Data Entry Operator'}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check size={15} color="#DA291C" strokeWidth={3} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sign Out Action */}
          <div style={{ borderTop: '1px solid #E2E8F0', padding: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: '#FEF2F2',
                color: '#DA291C',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LogOut size={14} />
              <span>Sign Out to Login Screen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
