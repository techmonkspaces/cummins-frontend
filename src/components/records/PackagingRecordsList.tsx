import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Database, 
  Calculator, 
  Edit3, 
  Trash2, 
  Eye, 
  Share2, 
  RefreshCw, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers,
  Building2
} from 'lucide-react';
import { PackagingRecord, RecordingMethod, RecordStatus, Plant } from '../../types';
import { recordsService } from '../../services/recordsService';

interface PackagingRecordsListProps {
  records: PackagingRecord[];
  plants?: Plant[];
  isSuperAdmin?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
  canExport?: boolean;
  onSelectRecord: (record: PackagingRecord) => void;
  onStatusChange: (id: string, status: RecordStatus) => void;
  onDeleteRecord: (id: string) => void;
  onResetMockData: () => void;
  onOpenExportModal: () => void;
  onStartNewRecord: () => void;
}

export const PackagingRecordsList: React.FC<PackagingRecordsListProps> = ({
  records,
  plants = [],
  isSuperAdmin = false,
  canDelete = true,
  canApprove = true,
  canExport = true,
  onSelectRecord,
  onStatusChange,
  onDeleteRecord,
  onResetMockData,
  onOpenExportModal,
  onStartNewRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [plantFilter, setPlantFilter] = useState<string>('ALL');

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || 
      r.id.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.productSku.toLowerCase().includes(q) ||
      (r.plantName && r.plantName.toLowerCase().includes(q));

    const matchesMethod = methodFilter === 'ALL' || r.method === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesPlant = plantFilter === 'ALL' || r.plantId === plantFilter;

    return matchesQuery && matchesMethod && matchesStatus && matchesPlant;
  });

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

  const handleExportCsv = () => {
    const csvContent = recordsService.exportCsv(filteredRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cummins-ppwr-records-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-confirmed">
                <ShieldCheck size={12} /> Compliance Audit Trail
              </span>
              <span className="text-xs text-muted">
                {records.length} total captured batches
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
              Packaging Consumption Records Ledger
            </h2>
          </div>

          {/* Export & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {canExport && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleExportCsv}
                  title="Download CSV table"
                >
                  <FileSpreadsheet size={15} />
                  <span>Export CSV</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={onOpenExportModal}
                  title="Generate JSON dataset formatted for downstream integration"
                  style={{ border: '1px solid #BAE6FD', color: '#0284C7', background: '#F0F9FF' }}
                >
                  <Share2 size={15} />
                  <span>Export Dataset (JSON)</span>
                </button>
              </>
            )}

            <button
              className="btn btn-primary btn-sm"
              onClick={onStartNewRecord}
            >
              <Layers size={15} />
              <span>New Record</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search record ID, SKU, plant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', height: '36px' }}
              />
            </div>

            {/* Method Filter */}
            <select
              className="form-select"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{ width: '160px', height: '36px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Methods</option>
              <option value="INVENTORY">Inventory (A)</option>
              <option value="CALCULATED">Calculated (B)</option>
              <option value="USER_INPUT">User Input (C)</option>
            </select>

            {/* Super Admin: Factory Filter */}
            {isSuperAdmin && plants.length > 0 && (
              <select
                className="form-select"
                value={plantFilter}
                onChange={(e) => setPlantFilter(e.target.value)}
                style={{ width: '180px', height: '36px', padding: '0.35rem 0.6rem', fontSize: '0.8rem', borderColor: '#DA291C', color: '#DA291C', fontWeight: 700 }}
              >
                <option value="ALL">🏭 All Factories</option>
                {plants.map(p => (
                  <option key={p.id} value={p.id}>{p.shortName}</option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '150px', height: '36px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DRAFT">Draft Review</option>
            </select>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onResetMockData}
            style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
            title="Reset to default mock dataset"
          >
            <RefreshCw size={12} />
            <span>Reset Mock Data</span>
          </button>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
          <table className="custom-table" style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Record ID</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Product & SKU</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Factory Site</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Methodology</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Units</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Total Mass</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Per-Unit Mass</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap', minWidth: '95px' }}>Date</th>
                <th style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                    No packaging records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '7px 12px' }}>
                      <span className="font-mono font-bold" style={{ color: '#0F172A', fontSize: '0.8rem' }}>
                        {record.id}
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {record.productName}
                        </div>
                        <div className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>
                          {record.productSku}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '7px 12px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', background: '#F8FAFC', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
                        {record.plantName ? record.plantName.replace('Cummins ', '') : 'Pune Factory'}
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px', whiteSpace: 'nowrap' }}>
                      {getMethodBadge(record.method)}
                    </td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span className="font-mono font-bold" style={{ fontSize: '0.82rem', color: '#0F172A' }}>
                        {record.productQuantity.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span className="font-mono font-bold" style={{ color: '#DA291C', fontSize: '0.84rem' }}>
                        {record.totalPackagingWeightKg.toFixed(2)} kg
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span className="font-mono font-bold" style={{ color: '#0284C7', fontSize: '0.8rem' }}>
                        {record.perUnitPackagingWeightKg.toFixed(3)} kg/u
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {record.status === 'CONFIRMED' ? (
                        <span className="badge badge-confirmed" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                          <CheckCircle2 size={10} /> Confirmed
                        </span>
                      ) : canApprove ? (
                        <button
                          className="badge badge-draft"
                          onClick={() => onStatusChange(record.id, 'CONFIRMED')}
                          style={{ cursor: 'pointer', fontSize: '0.68rem', padding: '2px 7px' }}
                          title="Click to confirm and approve draft record"
                        >
                          <Clock size={10} /> Draft (Approve)
                        </button>
                      ) : (
                        <span className="badge badge-draft" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                          <Clock size={10} /> Draft
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '7px 12px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.76rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                        {record.createdAt}
                      </span>
                    </td>
                    <td style={{ padding: '7px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectRecord(record)}
                          style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                          title="Inspect full BOM & PPWR details"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        {canDelete && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDeleteRecord(record.id)}
                            style={{ padding: '3px 6px' }}
                            title="Delete Record"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
