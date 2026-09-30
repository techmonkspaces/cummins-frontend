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
  const isDataEntry = currentUser.role === 'DATA_ENTRY' || currentUser.role === 'PACKAGING_MANAGER';
  const isFactoryManager = currentUser.role === 'FACTORY_MANAGER' || currentUser.role === 'FACTORY_ADMIN';

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
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Platform Overview
              </div>

              {/* Global Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'dashboard')}
              >
                <LayoutDashboard size={17} color={activeTab === 'dashboard' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Global Dashboard</span>
              </button>

              {/* Factories Management */}
              <button
                onClick={() => onSelectTab('plants')}
                className={`sidebar-nav-btn ${activeTab === 'plants' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'plants')}
              >
                <Building2 size={17} color={activeTab === 'plants' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Factories</span>
                <span style={{ fontSize: '0.68rem', background: 'var(--bg-card-subtle)', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>28</span>
              </button>

              {/* Product Master */}
              <button
                onClick={() => onSelectTab('products')}
                className={`sidebar-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'products')}
              >
                <Boxes size={17} color={activeTab === 'products' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Product Master</span>
              </button>

              {/* Consolidated Records Ledger */}
              <button
                onClick={() => onSelectTab('records')}
                className={`sidebar-nav-btn ${activeTab === 'records' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'records')}
              >
                <FileText size={17} color={activeTab === 'records' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Packaging Records</span>
              </button>

              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', padding: '10px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Governance & Rules
              </div>

              {/* Users & Access */}
              <button
                onClick={() => onSelectTab('users')}
                className={`sidebar-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'users')}
              >
                <Users size={17} color={activeTab === 'users' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Users & Access</span>
              </button>

              {/* Rules & Config */}
              <button
                onClick={() => onSelectTab('rules')}
                className={`sidebar-nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'rules')}
              >
                <Sliders size={17} color={activeTab === 'rules' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Rules & Configuration</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* SCENARIO 2: DATA ENTRY / PACKAGING OPERATOR               */}
          {/* ======================================================== */}
          {isDataEntry && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {activePlant.shortName || activePlant.name || 'Data Entry Station'}
              </div>
              <button
                onClick={() => { onSelectTab('packaging'); onStartPackagingFlow(); }}
                className={`sidebar-nav-btn ${activeTab === 'packaging' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'packaging')}
              >
                <PackagePlus size={17} color={activeTab === 'packaging' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Record Packaging</span>
              </button>
            </>
          )}

          {/* ======================================================== */}
          {/* SCENARIO 3: FACTORY ADMIN / PLANT MANAGER                 */}
          {/* ======================================================== */}
          {isFactoryManager && (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-light)', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {activePlant.shortName || activePlant.name || 'Plant View'}
              </div>

              {/* Plant Dashboard */}
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'dashboard')}
              >
                <LayoutDashboard size={17} color={activeTab === 'dashboard' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Plant Dashboard</span>
              </button>

              {/* Uniform Record Packaging Button */}
              <button
                onClick={() => {
                  onSelectTab('packaging');
                  onStartPackagingFlow();
                }}
                className={`sidebar-nav-btn ${activeTab === 'packaging' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'packaging')}
              >
                <PackagePlus size={17} color={activeTab === 'packaging' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Add Record </span>
              </button>

              {/* Packaging Inventory */}
              <button
                onClick={() => onSelectTab('inventory')}
                className={`sidebar-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'inventory')}
              >
                <Layers size={17} color={activeTab === 'inventory' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Inventory</span>
              </button>

              {/* Packaging Records */}
              <button
                onClick={() => onSelectTab('records')}
                className={`sidebar-nav-btn ${activeTab === 'records' ? 'active' : ''}`}
                style={getNavBtnStyle(activeTab === 'records')}
              >
                <FileText size={17} color={activeTab === 'records' ? 'var(--cummins-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>Packaging Records</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer / Profile & Sign Out */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-main)',
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
                background: 'var(--cummins-red)',
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
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {isSuperAdmin ? 'Super Admin' : isDataEntry ? 'Packaging Manager' : 'Factory Admin'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--cummins-red)';
              e.currentTarget.style.background = 'var(--cummins-red-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
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
    color: isActive ? 'var(--cummins-red)' : 'var(--text-secondary)',
    background: isActive ? 'var(--cummins-red-subtle)' : 'transparent',
    border: isActive ? '1px solid var(--cummins-red-border)' : '1px solid transparent',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease'
  };
}
