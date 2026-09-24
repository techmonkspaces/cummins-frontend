import React from 'react';
import { 
  Package, 
  Layers, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Calculator, 
  Edit3, 
  Database, 
  BarChart3, 
  Plus, 
  Building2, 
  MapPin, 
  ChevronRight, 
  Crown, 
  Users, 
  FileText, 
  ArrowRight, 
  Scale,
  Sparkles
} from 'lucide-react';
import { DashboardKPIs, PackagingRecord, RecordingMethod, Plant, UserPersona } from '../../types';

interface DashboardProps {
  kpis: DashboardKPIs;
  recentRecords: PackagingRecord[];
  plants: Plant[];
  activePlant: Plant;
  currentUser: UserPersona;
  onSelectPlant: (plantId: string) => void;
  onStartRecord: (productSku?: string) => void;
  onViewRecord: (record: PackagingRecord) => void;
  onViewAllRecords: () => void;
  onViewProducts: () => void;
  onViewPlants: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  kpis,
  recentRecords,
  plants,
  activePlant,
  currentUser,
  onSelectPlant,
  onStartRecord,
  onViewRecord,
  onViewAllRecords,
  onViewProducts,
  onViewPlants,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const getMethodBadge = (method: RecordingMethod) => {
    switch (method) {
      case 'INVENTORY':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#F0F9FF',
              color: '#0284C7',
              border: '1px solid #BAE6FD'
            }}
          >
            <Database size={11} /> Approach A (Inventory)
          </span>
        );
      case 'CALCULATED':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#FAF5FF',
              color: '#7C3AED',
              border: '1px solid #DDD6FE'
            }}
          >
            <Calculator size={11} /> Approach B (Calculated)
          </span>
        );
      case 'USER_INPUT':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0'
            }}
          >
            <Edit3 size={11} /> Approach C (User Input)
          </span>
        );
    }
  };

  const totalPackagingWeight = kpis.totalPackagingWeightKg || 1480;
  const cardboardSharePct = Math.round((kpis.cardboardConsumptionKg / totalPackagingWeight) * 100);
  const plasticSharePct = Math.round((kpis.plasticConsumptionKg / totalPackagingWeight) * 100);
  const paperSharePct = Math.round((kpis.paperConsumptionKg / totalPackagingWeight) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Uniform KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {/* Metric 1 */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>{isSuperAdmin ? 'Total Factories' : 'Site Status'}</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={15} color="#0284C7" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {isSuperAdmin ? '3' : 'Active'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <CheckCircle2 size={11} /> {isSuperAdmin ? 'Pune, Phaltan, JSR' : '100% Operational'}
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Active Users</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={15} color="#7C3AED" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {isSuperAdmin ? '54' : activePlant.id === 'PLANT-PUNE' ? '24' : activePlant.id === 'PLANT-PHALTAN' ? '18' : '12'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            {isSuperAdmin ? 'All 3 Plants' : 'Assigned to this plant'}
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Products Packed</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={15} color="#DA291C" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {kpis.totalProductsPacked > 0 ? kpis.totalProductsPacked.toLocaleString() : '1,150'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            Units Processed
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Packaging Records</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={15} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {isSuperAdmin ? '2,536' : (activePlant.recordsCount || 1248).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
            100% Confirmed
          </div>
        </div>

        {/* Metric 5 */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Total Packaging Mass</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#DA291C', marginTop: '6px' }}>
            {isSuperAdmin ? '1,480 kg' : `${Math.round(totalPackagingWeight).toLocaleString()} kg`}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
            Standardized SI Mass
          </div>
        </div>
      </div>

      {/* Super Admin: Factory Overview Table */}
      {isSuperAdmin && (
        <div 
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                Factory Overview & Configured Methodologies
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Pre-configured approach per factory ensures zero ambiguity during shop-floor packaging capture
              </span>
            </div>
            <button onClick={onViewPlants} className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem' }}>
              <span>Manage Factories</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '12px 18px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Factory</th>
                <th style={{ padding: '12px 18px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Configured Approach</th>
                <th style={{ padding: '12px 18px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 18px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Users</th>
                <th style={{ padding: '12px 18px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Records</th>
                <th style={{ padding: '12px 18px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant) => (
                <tr 
                  key={plant.id}
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>{plant.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{plant.location}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {getMethodBadge(plant.configuredMethod)}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '999px' }}>
                      ● Active
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                    {plant.usersCount || (plant.id === 'PLANT-PUNE' ? 24 : plant.id === 'PLANT-PHALTAN' ? 18 : 12)}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                    {(plant.recordsCount || (plant.id === 'PLANT-PUNE' ? 1248 : plant.id === 'PLANT-PHALTAN' ? 856 : 432)).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => onSelectPlant(plant.id)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span>View Factory</span>
                      <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Material Breakdown & Recent Records Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Packaging Records */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
              Recent Packaging Records
            </h3>
            <button onClick={onViewAllRecords} className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem' }}>
              <span>View All Records</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {recentRecords.slice(0, 4).map((rec) => (
              <div 
                key={rec.id}
                onClick={() => onViewRecord(rec)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DA291C';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>{rec.id}</span>
                    <span style={{ fontSize: '0.7rem', color: '#CBD5E1' }}>•</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{rec.productName}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                    {rec.plantName} • {rec.createdAt}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#DA291C', fontFamily: 'var(--font-mono)' }}>
                    {(rec.perUnitPackagingWeightKg * 1000).toFixed(0)} g/unit
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                    {rec.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Mass Distribution */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
            Material Mass Distribution (PPWR Split)
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1.25rem' }}>
            EU PPWR Article 6 & 9 Recyclability targets tracking
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#0284C7' }}>Cardboard & Paper (Fibre)</span>
                <span>{cardboardSharePct + paperSharePct}%</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${cardboardSharePct + paperSharePct}%`, height: '100%', background: '#0284C7', borderRadius: '999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#7C3AED' }}>Plastics (Polymers / EPS)</span>
                <span>{plasticSharePct}%</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${plasticSharePct}%`, height: '100%', background: '#7C3AED', borderRadius: '999px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: '#059669' }}>Avg Recyclability Score</span>
                <span>94.2%</span>
              </div>
              <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '94.2%', height: '100%', background: '#059669', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
