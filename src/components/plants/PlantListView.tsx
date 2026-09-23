import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Cpu, 
  Database, 
  Calculator, 
  Edit3, 
  Settings2, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Plus,
  X,
  Users,
  FileText,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { Plant, RecordingMethod } from '../../types';

interface PlantListViewProps {
  plants: Plant[];
  activePlantId: string;
  onSelectPlant: (plantId: string) => void;
  onUpdatePlantConfig: (plantId: string, updates: Partial<Plant>) => void;
  onNavigateToFactory?: (plantId: string) => void;
}

export const PlantListView: React.FC<PlantListViewProps> = ({
  plants,
  activePlantId,
  onSelectPlant,
  onUpdatePlantConfig,
  onNavigateToFactory,
}) => {
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [editMethod, setEditMethod] = useState<RecordingMethod>('INVENTORY');
  const [editErp, setEditErp] = useState<'SAP S/4HANA (PP/MM)' | 'SAP EWM' | 'Oracle WMS'>('SAP S/4HANA (PP/MM)');
  const [editDesc, setEditDesc] = useState('');

  const openConfigModal = (plant: Plant) => {
    setEditingPlant(plant);
    setEditMethod(plant.configuredMethod);
    setEditErp(plant.primaryErpSystem);
    setEditDesc(plant.description);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant) return;

    onUpdatePlantConfig(editingPlant.id, {
      configuredMethod: editMethod,
      primaryErpSystem: editErp,
      description: editDesc
    });

    setEditingPlant(null);
  };

  const getMethodBadge = (method: RecordingMethod) => {
    switch (method) {
      case 'INVENTORY':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#F0F9FF',
              color: '#0284C7',
              border: '1px solid #BAE6FD'
            }}
          >
            <Database size={13} /> Approach A — Inventory Consumption
          </span>
        );
      case 'CALCULATED':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#FAF5FF',
              color: '#7C3AED',
              border: '1px solid #DDD6FE'
            }}
          >
            <Calculator size={13} /> Approach B — System Calculated
          </span>
        );
      case 'USER_INPUT':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0'
            }}
          >
            <Edit3 size={13} /> Approach C — User Input
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ background: '#FEE2E2', color: '#DA291C', padding: '5px', borderRadius: '6px' }}>
              <Building2 size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
              Factory Management & Pre-Configured Packaging Approaches
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Each Cummins factory operates under a pre-configured packaging approach based on plant automation and ERP maturity. Factory users cannot alter this approach.
          </p>
        </div>
      </div>

      {/* Factory Overview Table */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              Factory Overview Summary
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              3 Active Enterprise Facilities in Demo Scope
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
            ● 100% Operational
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Factory</th>
              <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Configured Approach</th>
              <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Users</th>
              <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Records</th>
              <th style={{ padding: '12px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => {
              const isCurrentActive = activePlantId === plant.id;

              return (
                <tr 
                  key={plant.id}
                  style={{ 
                    borderBottom: '1px solid #F1F5F9',
                    background: isCurrentActive ? 'rgba(218, 41, 28, 0.03)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = isCurrentActive ? 'rgba(218, 41, 28, 0.05)' : '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = isCurrentActive ? 'rgba(218, 41, 28, 0.03)' : 'transparent')}
                >
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800
                        }}
                      >
                        {plant.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                          {plant.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={11} /> {plant.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px 18px' }}>
                    {getMethodBadge(plant.configuredMethod)}
                  </td>

                  <td style={{ padding: '16px 18px' }}>
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        background: '#ECFDF5',
                        padding: '2px 8px',
                        borderRadius: '999px'
                      }}
                    >
                      <CheckCircle2 size={12} /> {plant.status || 'Active'}
                    </span>
                  </td>

                  <td style={{ padding: '16px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                    {plant.usersCount || (plant.id === 'PLANT-PUNE' ? 24 : plant.id === 'PLANT-PHALTAN' ? 18 : 12)}
                  </td>

                  <td style={{ padding: '16px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                    {(plant.recordsCount || (plant.id === 'PLANT-PUNE' ? 1248 : plant.id === 'PLANT-PHALTAN' ? 856 : 432)).toLocaleString()}
                  </td>

                  <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          onSelectPlant(plant.id);
                          if (onNavigateToFactory) onNavigateToFactory(plant.id);
                        }}
                        className={`btn btn-sm ${isCurrentActive ? 'btn-primary' : 'btn-outline'}`}
                      >
                        <span>{isCurrentActive ? 'Active Scope' : 'View Factory'}</span>
                        <ArrowRight size={13} />
                      </button>

                      <button
                        onClick={() => openConfigModal(plant)}
                        className="btn btn-secondary btn-sm"
                        title="Configure Factory Approach"
                      >
                        <Settings2 size={14} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detailed Factory Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {plants.map((plant) => {
          const isCurrentActive = activePlantId === plant.id;

          return (
            <div 
              key={plant.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '1.5rem',
                border: isCurrentActive ? '2px solid #DA291C' : '1px solid #E2E8F0',
                boxShadow: isCurrentActive ? '0 6px 20px rgba(218, 41, 28, 0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                    {plant.code}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 7px', borderRadius: '4px' }}>
                    {plant.primaryErpSystem}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                  {plant.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  <MapPin size={12} /> {plant.location}
                </div>

                {/* Configured Approach Callout */}
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Packaging Approach
                  </div>
                  {getMethodBadge(plant.configuredMethod)}
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                    {plant.description}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px 0', borderTop: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Assigned Users</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                      {plant.usersCount || (plant.id === 'PLANT-PUNE' ? 24 : plant.id === 'PLANT-PHALTAN' ? 18 : 12)} Users
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Total Records</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                      {(plant.recordsCount || (plant.id === 'PLANT-PUNE' ? 1248 : plant.id === 'PLANT-PHALTAN' ? 856 : 432)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => onSelectPlant(plant.id)}
                  className={`btn btn-sm ${isCurrentActive ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <span>{isCurrentActive ? 'Active Scope' : 'Select Factory'}</span>
                </button>
                <button
                  onClick={() => openConfigModal(plant)}
                  className="btn btn-secondary btn-sm"
                >
                  <Settings2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Configuration Modal */}
      {editingPlant && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.2s ease-out'
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#DA291C', textTransform: 'uppercase' }}>
                  Super Admin Factory Governance
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>
                  Configure {editingPlant.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingPlant(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Important Alert Notice */}
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#92400E', display: 'flex', gap: '8px' }}>
                <Info size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong>Factory-Level Rule:</strong> When a factory user from this plant logs in, the system automatically presents the selected approach. The user cannot bypass or change this.
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Pre-Configured Packaging Methodology</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { id: 'INVENTORY', label: 'Approach A — Inventory Consumption (Zero Input)', desc: 'Reconciles WMS batch stock deductions automatically.' },
                    { id: 'CALCULATED', label: 'Approach B — System Calculated (Smart Rules)', desc: 'Auto-computes box size, void cushioning, and tape based on CAD rules.' },
                    { id: 'USER_INPUT', label: 'Approach C — Floor Station User Input', desc: 'Shop-floor operator selects materials & logs digital scale weights.' }
                  ].map((opt) => (
                    <label 
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: editMethod === opt.id ? '2px solid #DA291C' : '1px solid #E2E8F0',
                        background: editMethod === opt.id ? '#FFF5F5' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="configuredMethod"
                        value={opt.id}
                        checked={editMethod === opt.id}
                        onChange={() => setEditMethod(opt.id as RecordingMethod)}
                        style={{ marginTop: '3px' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Primary ERP / WMS Ingestion Source</label>
                <select
                  className="form-select"
                  value={editErp}
                  onChange={(e) => setEditErp(e.target.value as any)}
                  style={{ height: '40px' }}
                >
                  <option value="SAP S/4HANA (PP/MM)">SAP S/4HANA (PP/MM)</option>
                  <option value="SAP EWM">SAP EWM (Extended Warehouse)</option>
                  <option value="Oracle WMS">Oracle WMS</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingPlant(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Plant Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
