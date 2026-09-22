import React from 'react';
import { 
  Package, 
  LayoutDashboard, 
  Boxes, 
  FileText, 
  Layers, 
  PlusCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'products' | 'records' | 'inventory';
  onSelectTab: (tab: 'dashboard' | 'products' | 'records' | 'inventory') => void;
  onStartNewRecord: () => void;
  onOpenDemoGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onStartNewRecord,
}) => {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => onSelectTab('dashboard')}>
          <div className="brand-logo-badge">
            C
          </div>
          <div className="brand-titles">
            <div className="brand-name">
              Packaging Data Capture <span className="brand-badge">FRONTEND DEMO</span>
            </div>
            <div className="brand-subtitle">
              Packaging Consumption Recording MVP (Mock Data)
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSelectTab('dashboard')}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </button>
          
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => onSelectTab('products')}
          >
            <Boxes size={17} />
            <span>Products</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => onSelectTab('records')}
          >
            <FileText size={17} />
            <span>Packaging Records</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => onSelectTab('inventory')}
          >
            <Layers size={17} />
            <span>Packaging Master</span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.75rem', fontWeight: 600, background: '#F1F5F9', padding: '4px 10px', borderRadius: '999px', border: '1px solid #CBD5E1' }}>
            <ShieldCheck size={14} color="#0284C7" />
            <span>MVP Concept</span>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={onStartNewRecord}
          >
            <PlusCircle size={16} />
            <span>Record Packaging</span>
          </button>
        </div>
      </div>
    </header>
  );
};
