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
        return <span className="clean-pill pill-neutral">Approach A · Inventory</span>;
      case 'CALCULATED':
        return <span className="clean-pill pill-neutral">Approach B · Calculated</span>;
      case 'USER_INPUT':
        return <span className="clean-pill pill-neutral">Approach C · User Input</span>;
    }
  };

  const totalPackagingWeight = kpis.totalPackagingWeightKg || 1480;
  const cardboardSharePct = Math.round((kpis.cardboardConsumptionKg / totalPackagingWeight) * 100);
  const plasticSharePct = Math.round((kpis.plasticConsumptionKg / totalPackagingWeight) * 100);
  const paperSharePct = Math.round((kpis.paperConsumptionKg / totalPackagingWeight) * 100);

  const isConsolidated = isSuperAdmin;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Uniform KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isConsolidated ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: '1rem' }}>
        {/* Metric 1 - Only for Super Admin / Consolidated view */}
        {isConsolidated && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Total Factories</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={15} color="#0284C7" />
              </div>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
              {plants.length}
            </div>
          </div>
        )}

        {/* Metric 2 */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Active Users</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={15} color="#7C3AED" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {isConsolidated ? '82' : (activePlant.usersCount || 24)}
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
            {isConsolidated ? '18,940' : activePlant.id === 'PLANT-DARLINGTON' ? '13,351' : activePlant.id === 'PLANT-COLUMBUS' ? '4,520' : (kpis.totalProductsPacked > 0 ? kpis.totalProductsPacked.toLocaleString() : '1,150')}
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
            {isConsolidated ? '2,536' : (activePlant.recordsCount || 1248).toLocaleString()}
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
            {isConsolidated ? '17,450 kg' : activePlant.id === 'PLANT-DARLINGTON' ? '8,973 kg' : activePlant.id === 'PLANT-COLUMBUS' ? '4,210 kg' : `${Math.round(totalPackagingWeight).toLocaleString()} kg`}
          </div>

        </div>
      </div>



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

        {/* Right Side: Market Shipments & Material Split */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Destination Market Shipments Breakdown */}
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                Destination Market Distribution
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                {isConsolidated ? 'Global Shipments' : activePlant.name.replace('Cummins ', '')}
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1rem' }}>
              Packaging mass exported to target regulatory compliance markets
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(
                activePlant.country === 'Australia'
                  ? [
                      { country: 'USA', weight: 480, pct: 62 },
                      { country: 'UK', weight: 190, pct: 24 },
                      { country: 'Germany', weight: 110, pct: 14 }
                    ]
                  : activePlant.country === 'United Kingdom'
                  ? [
                      { country: 'Germany', weight: 4250, pct: 47 },
                      { country: 'France', weight: 2680, pct: 30 },
                      { country: 'Spain', weight: 2043, pct: 23 }
                    ]
                  : [
                      { country: 'Germany', weight: 8120, pct: 47 },
                      { country: 'USA', weight: 4850, pct: 28 },
                      { country: 'France', weight: 2680, pct: 15 },
                      { country: 'Italy', weight: 1800, pct: 10 }
                    ]
              ).map((m) => (
                <div key={m.country}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '3px' }}>
                    <span style={{ color: '#0F172A' }}>{m.country}</span>
                    <span style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                      {m.weight.toLocaleString()} kg <span style={{ color: '#0F172A', fontWeight: 800 }}>({m.pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${m.pct}%`, height: '100%', background: '#DA291C', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Material Mass Distribution */}
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Material Mass Distribution (PPWR Split)
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1rem' }}>
              EU PPWR Article 6 & 9 Recyclability targets tracking
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '3px' }}>
                  <span style={{ color: '#0284C7' }}>Cardboard & Paper (Fibre)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{cardboardSharePct + paperSharePct}%</span>
                </div>
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cardboardSharePct + paperSharePct}%`, height: '100%', background: '#0284C7', borderRadius: '999px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '3px' }}>
                  <span style={{ color: '#7C3AED' }}>Plastics (Polymers / EPS)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{plasticSharePct}%</span>
                </div>
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${plasticSharePct}%`, height: '100%', background: '#7C3AED', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
};
