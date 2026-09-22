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
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
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
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              Recorded Material Bill-of-Materials
            </h4>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Material ID</th>
                    <th>Material Name</th>
                    <th>Category</th>
                    <th>Recorded Qty</th>
                    <th>Standard Mass</th>
                    <th>Per Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {record.materials.map((m) => {
                    const perUnit = record.productQuantity > 0 ? m.weightKg / record.productQuantity : 0;
                    return (
                      <tr key={m.id}>
                        <td><span className="font-mono text-xs font-semibold" style={{ color: '#64748B' }}>{m.materialId}</span></td>
                        <td><span style={{ fontWeight: 600, color: '#0F172A' }}>{m.materialName}</span></td>
                        <td><span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{m.category}</span></td>
                        <td><span className="font-mono">{m.quantity} {m.unit}</span></td>
                        <td><span className="font-mono font-bold" style={{ color: '#DA291C' }}>{m.weightKg.toFixed(3)} kg</span></td>
                        <td><span className="font-mono text-xs" style={{ color: '#0284C7' }}>{perUnit.toFixed(4)} kg/u</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* PPWR Summary */}
          <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>
              <ShieldCheck size={16} /> PPWR Article 9/11 Material Compliance Data
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div>
                <span className="text-xs text-muted">Paper / Cardboard Fraction:</span>
                <div className="font-mono font-semibold" style={{ color: '#D97706' }}>
                  {record.ppwrSummary.paperCardboardKg.toFixed(2)} kg ({record.ppwrSummary.paperCardboardPct}%)
                </div>
              </div>
              <div>
                <span className="text-xs text-muted">Plastic / Polymer Fraction:</span>
                <div className="font-mono font-semibold" style={{ color: '#DB2777' }}>
                  {record.ppwrSummary.plasticKg.toFixed(2)} kg ({record.ppwrSummary.plasticPct}%)
                </div>
              </div>
              <div>
                <span className="text-xs text-muted">Avg Recyclable Content:</span>
                <div className="font-mono font-semibold" style={{ color: '#059669' }}>
                  {record.ppwrSummary.avgRecyclablePct}% Recyclable
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
