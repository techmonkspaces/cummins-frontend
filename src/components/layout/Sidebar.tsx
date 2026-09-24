import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Boxes,
  Layers,
  FileText,
  Users,
  Sliders,
  FileSpreadsheet,
  PackagePlus,
  LogOut,
  ChevronRight,
  Calculator,
  Database,
  Edit3,
  Sparkles,
  ClipboardList,
  Scale,
  Menu
} from 'lucide-react';
import { Plant, UserPersona } from '../../types';
import { CumminsLogo } from './CumminsLogo';

export type NavTab =
  | 'dashboard'
  | 'plants'
  | 'products'
  | 'packaging'
  | 'inventory'
  | 'records'
  | 'users'
  | 'rules'
  | 'reports';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserPersona;
  activePlant: Plant;
  onLogout: () => void;
  onStartPackagingFlow: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  activePlant,
  onLogout,
  onStartPackagingFlow,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isDataEntry = currentUser.role === 'DATA_ENTRY';
  const isFactoryManager = currentUser.role === 'FACTORY_MANAGER';
  const method = activePlant.configuredMethod;

  const getApproachTag = () => {
    switch (method) {
      case 'INVENTORY': return { label: 'Approach A', color: '#0284C7', bg: '#F0F9FF' };
      case 'CALCULATED': return { label: 'Approach B', color: '#7C3AED', bg: '#FAF5FF' };
      case 'USER_INPUT': return { label: 'Approach C', color: '#059669', bg: '#ECFDF5' };
    }
  };

  const tag = getApproachTag();

  return (
    <>
      {/* Invisible Hover Trigger Zone on Left Screen Edge */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '85px',
          height: '60px',
          zIndex: 990,
          cursor: 'pointer'
        }}
      />

      {/* Floating Hover Indicator Tab on Left Edge (visible when sidebar is hidden) */}
      {!isHovered && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          style={{
            position: 'fixed',
            top: '12px',
            left: '16px',
            zIndex: 991,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '6px 10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
          data-tooltip="Hover to open navigation menu"
        >
          <Menu size={16} color="#475569" />
          <CumminsLogo height={20} showWordmark={false} />
        </div>
      )}

      {/* Full Sidebar with 100% untouched contents */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '260px',
          minWidth: '260px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(-100%)',
          background: '#FFFFFF',
          color: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #E2E8F0',
          zIndex: 999,
          userSelect: 'none',
          boxShadow: isHovered ? '8px 0 30px rgba(0, 0, 0, 0.15)' : 'none',
          transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1.15rem',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <CumminsLogo height={34} showWordmark={true} />
        </div>

        {/* Dynamic Role-Tailored Navigation */}
        <nav
          style={{
            flex: 1,
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            overflowY: 'auto'
          }}
        >
          {/* ======================================================== */}
          {/* SCENARIO 1: SUPER ADMIN SIDEBAR                         */}
          {/* ======================================================== */}
          {isSuperAdmin && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Platform Overview
              </div>

              {/* Global Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'dashboard')}
              >
                <LayoutDashboard size={17} color={activeTab === 'dashboard' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Global Dashboard</span>
              </button>

              {/* Factories Management */}
              <button
                onClick={() => onSelectTab('plants')}
                className={`sidebar-nav-btn ${activeTab === 'plants' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'plants')}
              >
                <Building2 size={17} color={activeTab === 'plants' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Factories</span>
                <span style={{ fontSize: '0.68rem', background: '#F1F5F9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>3</span>
              </button>

              {/* Product Master */}
              <button
                onClick={() => onSelectTab('products')}
                className={`sidebar-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'products')}
              >
                <Boxes size={17} color={activeTab === 'products' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Product Master</span>
              </button>

              {/* Consolidated Records Ledger */}
              <button
                onClick={() => onSelectTab('records')}
                className={`sidebar-nav-btn ${activeTab === 'records' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'records')}
              >
                <FileText size={17} color={activeTab === 'records' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Packaging Records</span>
              </button>

              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '10px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Governance & Rules
              </div>

              {/* Users & Access */}
              <button
                onClick={() => onSelectTab('users')}
                className={`sidebar-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'users')}
              >
                <Users size={17} color={activeTab === 'users' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Users & Access</span>
              </button>

              {/* 4-Tier Rules & Config */}
              <button
                onClick={() => onSelectTab('rules')}
                className={`sidebar-nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'rules')}
              >
                <Sliders size={17} color={activeTab === 'rules' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Rules & Configuration</span>
                <span style={{ fontSize: '0.65rem', background: '#FAF5FF', color: '#7C3AED', border: '1px solid #DDD6FE', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>4-Tier</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* DATA ENTRY: PUNE (APPROACH A) — Minimal Logger Only       */}
          {/* ======================================================== */}
          {isDataEntry && method === 'INVENTORY' && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Data Entry Station
              </div>
              <button
                onClick={() => { onSelectTab('packaging'); onStartPackagingFlow(); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#0284C7', background: '#F0F9FF', border: '1px solid #BAE6FD', cursor: 'pointer', textAlign: 'left', margin: '3px 0' }}
              >
                <Database size={17} color="#0284C7" />
                <span style={{ flex: 1 }}>Submit Batch Deduction</span>
                <span style={{ fontSize: '0.62rem', background: '#0284C7', color: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>APPR. A</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* DATA ENTRY: PHALTAN (APPROACH B) — Minimal Logger Only    */}
          {/* ======================================================== */}
          {isDataEntry && method === 'CALCULATED' && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Data Entry Station
              </div>
              <button
                onClick={() => { onSelectTab('packaging'); onStartPackagingFlow(); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#7C3AED', background: '#FAF5FF', border: '1px solid #DDD6FE', cursor: 'pointer', textAlign: 'left', margin: '3px 0' }}
              >
                <Calculator size={17} color="#7C3AED" />
                <span style={{ flex: 1 }}>Run BOM Calculation</span>
                <span style={{ fontSize: '0.62rem', background: '#7C3AED', color: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>APPR. B</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* DATA ENTRY: JAMSHEDPUR (APPROACH C) — Minimal Logger Only */}
          {/* ======================================================== */}
          {isDataEntry && method === 'USER_INPUT' && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Data Entry Station
              </div>
              <button
                onClick={() => { onSelectTab('packaging'); onStartPackagingFlow(); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', cursor: 'pointer', textAlign: 'left', margin: '3px 0' }}
              >
                <Scale size={17} color="#059669" />
                <span style={{ flex: 1 }}>Packing Station Logger</span>
                <span style={{ fontSize: '0.62rem', background: '#059669', color: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>APPR. C</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* SCENARIO 2: PUNE FACTORY MANAGER (APPROACH A — INVENTORY) */}
          {/* ======================================================== */}
          {isFactoryManager && method === 'INVENTORY' && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pune Operations
              </div>

              {/* Pune Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                style={getNavBtnStyle(activeTab === 'dashboard')}
              >
                <LayoutDashboard size={17} color={activeTab === 'dashboard' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Plant Dashboard</span>
              </button>

              {/* Primary Action: Approach A Batch Reconciliation */}
              <button
                onClick={() => {
                  onSelectTab('packaging');
                  onStartPackagingFlow();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#0284C7',
                  background: activeTab === 'packaging' ? '#E0F2FE' : '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  cursor: 'pointer',
                  textAlign: 'left',
                  margin: '3px 0'
                }}
              >
                <Database size={17} color="#0284C7" />
                <span style={{ flex: 1 }}>Batch Reconciliation</span>
                <span style={{ fontSize: '0.62rem', background: '#0284C7', color: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>
                  APPR. A
                </span>
              </button>

              {/* Pune Packaging Records */}
              <button
                onClick={() => onSelectTab('records')}
                style={getNavBtnStyle(activeTab === 'records')}
              >
                <FileText size={17} color={activeTab === 'records' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Batch Audit Records</span>
              </button>

              {/* Material Consumption / WMS Stock */}
              <button
                onClick={() => onSelectTab('inventory')}
                style={getNavBtnStyle(activeTab === 'inventory')}
              >
                <Layers size={17} color={activeTab === 'inventory' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Packaging Stock & Issues</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* SCENARIO 3: PHALTAN FACTORY MANAGER (APPROACH B — RULES)  */}
          {/* ======================================================== */}
          {isFactoryManager && method === 'CALCULATED' && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Phaltan Engineering
              </div>

              {/* Phaltan Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                style={getNavBtnStyle(activeTab === 'dashboard')}
              >
                <LayoutDashboard size={17} color={activeTab === 'dashboard' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Engineering Dashboard</span>
              </button>

              {/* Primary Action: Approach B Box Calculator */}
              <button
                onClick={() => {
                  onSelectTab('packaging');
                  onStartPackagingFlow();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#7C3AED',
                  background: activeTab === 'packaging' ? '#EDE9FE' : '#FAF5FF',
                  border: '1px solid #DDD6FE',
                  cursor: 'pointer',
                  textAlign: 'left',
                  margin: '3px 0'
                }}
              >
                <Calculator size={17} color="#7C3AED" />
                <span style={{ flex: 1 }}>Auto-Box Calculator</span>
                <span style={{ fontSize: '0.62rem', background: '#7C3AED', color: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>
                  APPR. B
                </span>
              </button>

              {/* Assembly Products Catalog */}
              <button
                onClick={() => onSelectTab('products')}
                style={getNavBtnStyle(activeTab === 'products')}
              >
                <Boxes size={17} color={activeTab === 'products' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Assembly Parts & CAD</span>
              </button>

              {/* Phaltan Confirmed Records */}
              <button
                onClick={() => onSelectTab('records')}
                style={getNavBtnStyle(activeTab === 'records')}
              >
                <FileText size={17} color={activeTab === 'records' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Calculated Records</span>
              </button>

              {/* Available Packaging Stock */}
              <button
                onClick={() => onSelectTab('inventory')}
                style={getNavBtnStyle(activeTab === 'inventory')}
              >
                <Layers size={17} color={activeTab === 'inventory' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Standard Packaging BOM</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* SCENARIO 4: JAMSHEDPUR FACTORY MANAGER (APPROACH C — LOG) */}
          {/* ======================================================== */}
          {isFactoryManager && method === 'USER_INPUT' && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Floor Packing Station
              </div>

              {/* Jamshedpur Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                style={getNavBtnStyle(activeTab === 'dashboard')}
              >
                <LayoutDashboard size={17} color={activeTab === 'dashboard' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Station Dashboard</span>
              </button>

              {/* Primary Action: Approach C Floor Station Logger */}
              <button
                onClick={() => {
                  onSelectTab('packaging');
                  onStartPackagingFlow();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#059669',
                  background: activeTab === 'packaging' ? '#D1FAE5' : '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  margin: '3px 0'
                }}
              >
                <Scale size={17} color="#059669" />
                <span style={{ flex: 1 }}>Packing Station Logger</span>
                <span style={{ fontSize: '0.62rem', background: '#059669', color: '#FFFFFF', padding: '2px 5px', borderRadius: '4px', fontWeight: 800 }}>
                  APPR. C
                </span>
              </button>

              {/* Jamshedpur Packaging Records */}
              <button
                onClick={() => onSelectTab('records')}
                style={getNavBtnStyle(activeTab === 'records')}
              >
                <FileText size={17} color={activeTab === 'records' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Shift Packing Logs</span>
              </button>

              {/* Station Packaging Materials Stock */}
              <button
                onClick={() => onSelectTab('inventory')}
                style={getNavBtnStyle(activeTab === 'inventory')}
              >
                <Layers size={17} color={activeTab === 'inventory' ? '#DA291C' : '#64748B'} />
                <span style={{ flex: 1 }}>Bench Materials Stock</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer / Profile & Sign Out */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderTop: '1px solid #F1F5F9',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isSuperAdmin ? '#DA291C' : tag.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.82rem',
                flexShrink: 0
              }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                {isSuperAdmin ? 'Super Admin' : isDataEntry ? 'Data Entry Operator' : 'Factory Manager'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#DC2626';
              e.currentTarget.style.background = '#FEE2E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748B';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

function getNavBtnStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: isActive ? 700 : 600,
    color: isActive ? '#DA291C' : '#334155',
    background: isActive ? '#FFF5F5' : 'transparent',
    border: isActive ? '1px solid #FECACA' : '1px solid transparent',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  };
}
