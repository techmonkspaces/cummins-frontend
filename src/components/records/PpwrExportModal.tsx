import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck
} from 'lucide-react';
import { PackagingRecord } from '../../types';
import { recordsService } from '../../services/recordsService';

interface PpwrExportModalProps {
  records: PackagingRecord[];
  onClose: () => void;
}

export const PpwrExportModal: React.FC<PpwrExportModalProps> = ({
  records,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const jsonPayload = recordsService.exportPpwrJson(records);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cummins-ppwr-integritynext-payload-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-confirmed">
                <ShieldCheck size={12} /> Standard Data Model
              </span>
              <span className="text-xs text-muted">
                Structured Output Format (JSON)
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Packaging Bill-of-Materials JSON Dataset
            </h2>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.35rem 0.5rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#475569' }}>
            Standardized JSON format capturing product details, recorded packaging line items, and mass category totals.
          </p>

          <div style={{ position: 'relative' }}>
            <pre 
              style={{ 
                background: '#0F172A', 
                color: '#38BDF8', 
                padding: '1rem', 
                borderRadius: '8px', 
                fontSize: '0.78rem', 
                fontFamily: 'var(--font-mono)', 
                maxHeight: '380px', 
                overflowY: 'auto',
                border: '1px solid #1E293B',
                lineHeight: 1.4
              }}
            >
              {jsonPayload}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={handleDownload}>
            <Download size={14} />
            <span>Download .json File</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
