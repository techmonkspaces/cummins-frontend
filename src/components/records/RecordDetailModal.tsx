import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Database,
  Calculator,
  Edit3,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { PackagingRecord, RecordingMethod, RecordStatus } from '../../types';
import { MOCK_PACKAGING_INVENTORY } from '../../data/mockData';

interface RecordDetailModalProps {
  record: PackagingRecord | null;
  onClose: () => void;
  onStatusToggle?: (id: string, status: RecordStatus) => void;
  onOpenExport?: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
  onStatusToggle,
  onOpenExport,
}) => {
  if (!record) return null;

  const getMethodBadge = (method: RecordingMethod) => {
    switch (method) {
      case 'INVENTORY':
        return <span className="badge badge-inventory"><Database size={11} /> Approach A — Inventory / Consumption</span>;
      case 'CALCULATED':
        return <span className="badge badge-calculated"><Calculator size={11} /> Approach B — System Calculated</span>;
      case 'USER_INPUT':
        return <span className="badge badge-user-input"><Edit3 size={11} /> Approach C — User Input Log</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '1060px', width: '95%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span className="font-mono font-bold text-sm" style={{ color: '#DA291C' }}>
                {record.id}
              </span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              {getMethodBadge(record.method)}
              <span style={{ color: '#CBD5E1' }}>•</span>
              {record.status === 'CONFIRMED' ? (
                <span className="badge badge-confirmed"><CheckCircle2 size={11} /> Confirmed</span>
              ) : (
                <span className="badge badge-draft"><Clock size={11} /> Draft Review</span>
              )}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              {record.productName} ({record.productSku})
            </h2>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem 0.5rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', overflowY: 'auto' }}>
          {/* Key Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Quantity Packed</div>
              <div className="font-mono font-bold text-base" style={{ color: '#0284C7' }}>
                {record.productQuantity.toLocaleString()} units
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Total Packaging Mass</div>
              <div className="font-mono font-bold text-base" style={{ color: '#DA291C' }}>
                {record.totalPackagingWeightKg.toFixed(2)} kg
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Per-Unit Consumption</div>
              <div className="font-mono font-bold text-base" style={{ color: '#059669' }}>
                {record.perUnitPackagingWeightKg.toFixed(3)} kg/u
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Date Created</div>
              <div className="font-mono font-bold text-base" style={{ color: '#0F172A' }}>
                {record.createdAt}
              </div>
            </div>
          </div>

          {/* BOM Table */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
              Recorded Bill of Materials (PPWR Compliance Spec)
            </h4>
            <div className="table-wrapper" style={{ overflowX: 'visible' }}>
              <table className="custom-table" style={{ width: '100%', tableLayout: 'auto' }}>
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>Packaging Component</th>
                    {/* <th style={{ whiteSpace: 'nowrap' }}>Packaging Class</th> */}
                    {/* <th style={{ whiteSpace: 'nowrap' }}>Single Use / Reusable</th> */}
                    <th style={{ whiteSpace: 'nowrap' }}>Dimensions</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Weight %</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Total Mass</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Per Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {record.materials.map((m) => {
                    const perUnit = record.productQuantity > 0 ? m.weightKg / record.productQuantity : 0;
                    const weightPct = record.totalPackagingWeightKg > 0
                      ? ((m.weightKg / record.totalPackagingWeightKg) * 100).toFixed(1)
                      : '0.0';

                    // Packaging Class, Use Type & Dimensions from Inventory Master
                    const master = MOCK_PACKAGING_INVENTORY.find(
                      inv => inv.id === m.materialId || inv.name.toLowerCase() === m.materialName.toLowerCase()
                    );

                    let pClass = m.packagingClass || master?.packagingClass;
                    let isReusable = (m.useType || master?.useType) === 'Reusable';
                    let dimensions = m.dimensions || master?.dimensions || '-';

                    if (!pClass) {
                      const matNameLower = m.materialName.toLowerCase();
                      if (matNameLower.includes('box') || matNameLower.includes('carton') || matNameLower.includes('tray')) {
                        pClass = 'Primary';
                        if (dimensions === '-') dimensions = '35 × 25 × 20 cm';
                      } else if (matNameLower.includes('tape') || matNameLower.includes('film') || matNameLower.includes('bag') || matNameLower.includes('wrap')) {
                        pClass = 'Secondary';
                        if (dimensions === '-') dimensions = matNameLower.includes('tape') ? '50 mm × 66 m' : '1000 mm × 50 m';
                      } else {
                        pClass = 'Tertiary';
                        if (dimensions === '-') dimensions = matNameLower.includes('end-cap') ? '15 × 10 × 8 cm' : '70 gsm / 5-ply';
                      }
                    }

                    return (
                      <tr key={m.id}>
                        <td>
                          <div>
                            <span style={{ fontWeight: 600, color: '#0F172A', display: 'block' }}>{m.materialName}</span>
                            <span className="font-mono text-xs" style={{ color: '#64748B' }}>{m.materialId} • {m.category}</span>
                          </div>
                        </td>
                        {/* <td style={{ whiteSpace: 'nowrap' }}>
                          <span className={`badge ${pClass === 'Primary' ? 'badge-calculated' : pClass === 'Secondary' ? 'badge-inventory' : 'badge-neutral'}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                            {pClass}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="badge" style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 600,
                            background: isReusable ? '#ECFDF5' : '#EFF6FF',
                            color: isReusable ? '#059669' : '#1E40AF',
                            border: `1px solid ${isReusable ? '#A7F3D0' : '#BFDBFE'}`
                          }}>
                            {isReusable ? 'Reusable' : 'Single-Use'}
                          </span>
                        </td> */}
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="font-mono text-xs" style={{ color: '#475569' }}>
                            {dimensions}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="font-mono font-semibold" style={{ color: '#0F172A' }}>
                            {weightPct}%
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="font-mono font-bold" style={{ color: '#DA291C' }}>
                            {m.weightKg.toFixed(2)} kg
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="font-mono text-xs" style={{ color: '#0284C7' }}>
                            {perUnit.toFixed(4)} kg/u
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Material Breakdown Summary */}
          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: '#0F172A', fontSize: '0.85rem', fontWeight: 700 }}>
              <ShieldCheck size={16} color="#059669" /> Material Category & Packaging Type Breakdown
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div>
                <span className="text-xs text-muted">Paper / Cardboard:</span>
                <div className="font-mono font-semibold" style={{ color: '#D97706' }}>
                  {record.ppwrSummary.paperCardboardKg.toFixed(2)} kg ({record.ppwrSummary.paperCardboardPct}%)
                </div>
              </div>
              <div>
                <span className="text-xs text-muted">Plastic / Polymer:</span>
                <div className="font-mono font-semibold" style={{ color: '#DB2777' }}>
                  {record.ppwrSummary.plasticKg.toFixed(2)} kg ({record.ppwrSummary.plasticPct}%)
                </div>
              </div>
              <div>
                <span className="text-xs text-muted">Packaging Format Type:</span>
                <div className="font-mono font-semibold" style={{ color: '#1E40AF' }}>
                  100% Single-Use Packaging
                </div>
              </div>
            </div>
          </div>

          {record.notes && (
            <div style={{ fontSize: '0.8rem', color: '#475569', background: '#F1F5F9', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <strong style={{ color: '#0F172A' }}>Notes:</strong> {record.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {record.status === 'DRAFT' && onStatusToggle && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onStatusToggle(record.id, 'CONFIRMED');
                onClose();
              }}
            >
              <CheckCircle2 size={15} />
              <span>Confirm This Record</span>
            </button>
          )}

          {onOpenExport && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenExport}
              style={{ color: '#0284C7', border: '1px solid #BAE6FD', background: '#F0F9FF' }}
            >
              <Share2 size={15} />
              <span>Export JSON Payload</span>
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
