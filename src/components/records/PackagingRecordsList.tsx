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
  Layers
} from 'lucide-react';
import { PackagingRecord, RecordingMethod, RecordStatus } from '../../types';
import { recordsService } from '../../services/recordsService';

interface PackagingRecordsListProps {
  records: PackagingRecord[];
  onSelectRecord: (record: PackagingRecord) => void;
  onStatusChange: (id: string, status: RecordStatus) => void;
  onDeleteRecord: (id: string) => void;
  onResetMockData: () => void;
  onOpenExportModal: () => void;
  onStartNewRecord: () => void;
}

export const PackagingRecordsList: React.FC<PackagingRecordsListProps> = ({
  records,
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

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || 
      r.id.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.productSku.toLowerCase().includes(q);

    const matchesMethod = methodFilter === 'ALL' || r.method === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesQuery && matchesMethod && matchesStatus;
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
                placeholder="Search record ID, SKU, product..."
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
      <div className="glass-card">
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Product & SKU</th>
                <th>Methodology</th>
                <th>Units Packed</th>
                <th>Total Pkg Mass</th>
                <th>Per-Unit Mass</th>
                <th>Paper / Plastic Fraction</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No packaging records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className="font-mono font-bold" style={{ color: '#0F172A' }}>
                        {record.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>
                          {record.productName}
                        </div>
                        <div className="font-mono text-xs text-muted">
                          {record.productSku}
                        </div>
                      </div>
                    </td>
                    <td>
                      {getMethodBadge(record.method)}
                    </td>
                    <td>
                      <span className="font-mono font-semibold">
                        {record.productQuantity.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-bold" style={{ color: '#DA291C' }}>
                        {record.totalPackagingWeightKg.toFixed(2)} kg
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs" style={{ color: '#0284C7' }}>
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
                        <button
                          className="badge badge-draft"
                          onClick={() => onStatusChange(record.id, 'CONFIRMED')}
                          style={{ cursor: 'pointer' }}
                          title="Click to confirm draft"
                        >
                          <Clock size={11} /> Draft (Confirm)
                        </button>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-secondary font-mono">
                        {record.createdAt}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectRecord(record)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          title="Inspect full BOM & PPWR details"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDeleteRecord(record.id)}
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
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
