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
  ExternalLink,
  Plus
} from 'lucide-react';
import { DashboardKPIs, PackagingRecord, RecordingMethod } from '../../types';

interface DashboardProps {
  kpis: DashboardKPIs;
  recentRecords: PackagingRecord[];
  onStartRecord: (productSku?: string) => void;
  onViewRecord: (record: PackagingRecord) => void;
  onViewAllRecords: () => void;
  onViewProducts: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  kpis,
  recentRecords,
  onStartRecord,
  onViewRecord,
  onViewAllRecords,
  onViewProducts,
}) => {
  const getMethodBadge = (method: RecordingMethod) => {
    switch (method) {
      case 'INVENTORY':
        return <span className="badge badge-inventory"><Database size={11} /> Inventory (A)</span>;
      case 'CALCULATED':
        return <span className="badge badge-calculated"><Calculator size={11} /> Calculated (B)</span>;
      case 'USER_INPUT':
        return <span className="badge badge-user-input"><Edit3 size={11} /> User Input (C)</span>;
    }
  };

  const totalMethodRecords = (kpis.methodBreakdown.inventory + kpis.methodBreakdown.calculated + kpis.methodBreakdown.userInput) || 1;
  const inventoryPct = Math.round((kpis.methodBreakdown.inventory / totalMethodRecords) * 100);
  const calculatedPct = Math.round((kpis.methodBreakdown.calculated / totalMethodRecords) * 100);
  const userInputPct = Math.round((kpis.methodBreakdown.userInput / totalMethodRecords) * 100);

  const totalPackagingWeight = kpis.totalPackagingWeightKg || 1;
  const cardboardSharePct = Math.round((kpis.cardboardConsumptionKg / totalPackagingWeight) * 100);
  const plasticSharePct = Math.round((kpis.plasticConsumptionKg / totalPackagingWeight) * 100);
  const paperSharePct = Math.round((kpis.paperConsumptionKg / totalPackagingWeight) * 100);
  const otherSharePct = Math.max(0, 100 - cardboardSharePct - plasticSharePct - paperSharePct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner / Intro */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', color: '#DA291C', textTransform: 'uppercase' }}>
              Packaging Data Capture Concept
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
              Frontend-Only Demo (Mock Data)
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.4rem', color: '#0F172A' }}>
            Packaging Consumption & Recording Hub
          </h1>
          <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Evaluating 3 recording approaches: <strong>Inventory Reconciliation</strong>, <strong>System Calculated (Top-Down)</strong>, and <strong>Floor Operator Log</strong> with a unified output data model ready for future API integration.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            onClick={onViewProducts}
          >
            <Package size={16} />
            <span>Browse Products</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => onStartRecord('GA-102')}
          >
            <Plus size={16} />
            <span>Record Packaging</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid-cols-4">
        {/* Total Products Packed */}
        <div className="glass-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Products Processed
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#F0F9FF', color: '#0284C7' }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0F172A', marginBottom: '0.25rem' }}>
            {kpis.totalProductsPacked.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>units</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#059669', fontWeight: 600 }}>Active production batches</span> across 4 SKUs
          </div>
        </div>

        {/* Total Packaging Material */}
        <div className="glass-card" style={{ borderLeft: '4px solid #DA291C' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Packaging Used
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#FEF2F2', color: '#DA291C' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0F172A', marginBottom: '0.25rem' }}>
            {kpis.totalPackagingWeightKg.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Avg</span> 
            <strong style={{ color: '#0F172A' }}>
              {kpis.totalProductsPacked > 0 ? (kpis.totalPackagingWeightKg / kpis.totalProductsPacked).toFixed(3) : 0} kg
            </strong> 
            <span>per product unit</span>
          </div>
        </div>

        {/* Cardboard & Paper Total */}
        <div className="glass-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Cardboard / Paper
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#FFFBEB', color: '#D97706' }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0F172A', marginBottom: '0.25rem' }}>
            {(kpis.cardboardConsumptionKg + kpis.paperConsumptionKg).toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#059669', fontWeight: 600 }}>{cardboardSharePct + paperSharePct}%</span> of total weight (High Recyclability)
          </div>
        </div>

        {/* Plastic Consumption & Review Queue */}
        <div className="glass-card" style={{ borderLeft: '4px solid #7C3AED' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Plastic Content & Drafts
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#FAF5FF', color: '#7C3AED' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0F172A', marginBottom: '0.25rem' }}>
            {kpis.plasticConsumptionKg.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {kpis.recordsRequiringReview > 0 ? (
              <span style={{ color: '#D97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <AlertCircle size={13} /> {kpis.recordsRequiringReview} draft records awaiting review
              </span>
            ) : (
              <span style={{ color: '#059669' }}>All records confirmed</span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics & Method Breakdown Row */}
      <div className="grid-cols-2">
        {/* Method Distribution Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                Packaging Records by Method
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Capturing method breakdown across 3 distinct workflows
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
              {kpis.totalRecordsCount} Total Records
            </span>
          </div>

          {/* Progress Visual Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="progress-bar-container" style={{ height: '10px' }}>
              <div 
                className="progress-segment" 
                style={{ width: `${inventoryPct}%`, background: '#0284C7' }} 
                title={`Inventory Method: ${inventoryPct}%`}
              />
              <div 
                className="progress-segment" 
                style={{ width: `${calculatedPct}%`, background: '#7C3AED' }} 
                title={`Calculated Method: ${calculatedPct}%`}
              />
              <div 
                className="progress-segment" 
                style={{ width: `${userInputPct}%`, background: '#059669' }} 
                title={`User Input Method: ${userInputPct}%`}
              />
            </div>
          </div>

          {/* Method Detail Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Approach A */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.9rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0284C7' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                    Approach A — Inventory / Consumption
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Period inventory deduction ÷ product volume
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284C7' }}>
                  {kpis.methodBreakdown.inventory} records
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>
                  ({inventoryPct}%)
                </span>
              </div>
            </div>

            {/* Approach B */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.9rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#7C3AED' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                    Approach B — System Calculated (Top-Down)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Rule engine dynamic BOM based on SKU weight/volume
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7C3AED' }}>
                  {kpis.methodBreakdown.calculated} records
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>
                  ({calculatedPct}%)
                </span>
              </div>
            </div>

            {/* Approach C */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0.9rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#059669' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                    Approach C — User Input / Actual Packaging
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Packaging floor operator manual bill-of-materials log
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#059669' }}>
                  {kpis.methodBreakdown.userInput} records
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>
                  ({userInputPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PPWR Material Categorization Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>
                PPWR Material Fractions (Simulated)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Material category weight distribution based on recorded packaging
              </p>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontWeight: 600 }}>
              Schema Preview
            </span>
          </div>

          {/* PPWR Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="progress-bar-container" style={{ height: '10px' }}>
              <div 
                className="progress-segment" 
                style={{ width: `${cardboardSharePct}%`, background: '#D97706' }} 
                title={`Cardboard: ${kpis.cardboardConsumptionKg} kg`}
              />
              <div 
                className="progress-segment" 
                style={{ width: `${paperSharePct}%`, background: '#0284C7' }} 
                title={`Paper Cushioning: ${kpis.paperConsumptionKg} kg`}
              />
              <div 
                className="progress-segment" 
                style={{ width: `${plasticSharePct}%`, background: '#DB2777' }} 
                title={`Plastic / EPS / Tape: ${kpis.plasticConsumptionKg} kg`}
              />
              {otherSharePct > 0 && (
                <div 
                  className="progress-segment" 
                  style={{ width: `${otherSharePct}%`, background: '#64748B' }} 
                  title={`Other: ${kpis.otherConsumptionKg} kg`}
                />
              )}
            </div>
          </div>

          {/* PPWR Categories List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                Corrugated & Boxes (PAP-20)
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#D97706' }}>
                {kpis.cardboardConsumptionKg.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {cardboardSharePct}% total packaging mass
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                Paper Cushioning (PAP-22)
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0284C7' }}>
                {kpis.paperConsumptionKg.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {paperSharePct}% total packaging mass
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                Polymers & EPS (PS/LDPE)
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#DB2777' }}>
                {kpis.plasticConsumptionKg.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {plasticSharePct}% total packaging mass
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                Other / Tape / Barrier
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#475569' }}>
                {kpis.otherConsumptionKg.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {otherSharePct}% total packaging mass
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Packaging Records Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
              Recent Packaging Records
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Latest packaging consumption batches across all three methods
            </p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onViewAllRecords}
          >
            <span>View All Records ({kpis.totalRecordsCount})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Product / SKU</th>
                <th>Method Used</th>
                <th>Qty Packed</th>
                <th>Total Pkg Wt</th>
                <th>Per Unit Wt</th>
                <th>PPWR Material Share</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="font-mono font-semibold" style={{ color: '#0F172A' }}>
                      {record.id}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{record.productName}</div>
                      <div className="font-mono text-xs text-muted">{record.productSku}</div>
                    </div>
                  </td>
                  <td>
                    {getMethodBadge(record.method)}
                  </td>
                  <td>
                    <span className="font-mono font-medium">
                      {record.productQuantity.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-semibold" style={{ color: '#DA291C' }}>
                      {record.totalPackagingWeightKg.toFixed(2)} kg
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-sm" style={{ color: '#475569' }}>
                      {record.perUnitPackagingWeightKg.toFixed(3)} kg/u
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                      <span style={{ color: '#D97706', fontWeight: 600 }}>📦 {record.ppwrSummary.paperCardboardPct}%</span>
                      <span style={{ color: '#DB2777', fontWeight: 600 }}>🧪 {record.ppwrSummary.plasticPct}%</span>
                    </div>
                  </td>
                  <td>
                    {record.status === 'CONFIRMED' ? (
                      <span className="badge badge-confirmed">
                        <CheckCircle2 size={11} /> Confirmed
                      </span>
                    ) : (
                      <span className="badge badge-draft">
                        <Clock size={11} /> Draft Review
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="text-xs text-secondary font-mono">
                      {record.createdAt}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewRecord(record)}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <span>Inspect</span>
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
