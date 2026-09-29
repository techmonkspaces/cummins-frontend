import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Building2,
  ChevronRight
} from 'lucide-react';
import { 
  Product, 
  PackagingMaterialMaster, 
  RecordingMethod, 
  PackagingLineItem, 
  RecordStatus, 
  PackagingRecord,
  Plant
} from '../../types';
import { ApproachInventory, BatchSkuRecordPayload } from './ApproachInventory';
import { ApproachCalculated } from './ApproachCalculated';
import { ApproachUserInput } from './ApproachUserInput';
import { PackagingSummary } from './PackagingSummary';
import { recordsService } from '../../services/recordsService';
import { inventoryService } from '../../services/inventoryService';
import { MOCK_PRODUCTS, MOCK_PACKAGING_INVENTORY } from '../../data/mockData';

interface PackagingWorkflowProps {
  initialProduct?: Product;
  activePlant: Plant;
  availableProducts: Product[];
  availableMaterials: PackagingMaterialMaster[];
  onFinish: (record: PackagingRecord) => void;
  onCancel: () => void;
  onViewRecordDetail?: (record: PackagingRecord) => void;
}

type FlowStep = 'SELECT_PRODUCT' | 'METHOD_FORM' | 'REVIEW_SUMMARY' | 'CONFIRMED_SUCCESS';

export const PackagingWorkflow: React.FC<PackagingWorkflowProps> = ({
  initialProduct,
  activePlant,
  availableProducts = MOCK_PRODUCTS,
  availableMaterials = MOCK_PACKAGING_INVENTORY,
  onFinish,
  onCancel,
}) => {
  const defaultProduct = initialProduct || (availableProducts && availableProducts.length > 0 ? availableProducts[0] : MOCK_PRODUCTS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(defaultProduct);

  // Keep selectedProduct in sync if initialProduct changes
  React.useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    } else if (!selectedProduct && availableProducts && availableProducts.length > 0) {
      setSelectedProduct(availableProducts[0]);
    }
  }, [initialProduct, availableProducts]);

  // Directly land on the configured method form
  const [currentStep, setCurrentStep] = useState<FlowStep>('METHOD_FORM');

  const selectedMethod: RecordingMethod = activePlant.configuredMethod || 'INVENTORY';

  const [workingQuantity, setWorkingQuantity] = useState<number>(
    initialProduct?.defaultBatchSize || 1000
  );
  const [workingMaterials, setWorkingMaterials] = useState<PackagingLineItem[]>([]);
  const [workingPeriod, setWorkingPeriod] = useState<string | undefined>('September 2026');
  const [workingNotes, setWorkingNotes] = useState<string | undefined>('');
  const [createdRecord, setCreatedRecord] = useState<PackagingRecord | null>(null);
  const [createdRecords, setCreatedRecords] = useState<PackagingRecord[]>([]);

  const [workingDestinationCountry, setWorkingDestinationCountry] = useState<string>(
    activePlant.country === 'Australia' ? 'Australia' : 'Germany'
  );

  const handleProductSelected = (prod: Product) => {
    setSelectedProduct(prod);
    setWorkingQuantity(prod.defaultBatchSize);
    // Direct routing to plant's pre-configured approach
    setCurrentStep('METHOD_FORM');
  };

  const handleMethodFormCompleted = (data: {
    product?: Product;
    productQuantity: number;
    materials: PackagingLineItem[];
    destinationCountry?: string;
    period?: string;
    notes?: string;
  }) => {
    if (data.product) {
      setSelectedProduct(data.product);
    }
    setWorkingQuantity(data.productQuantity);
    setWorkingMaterials(data.materials);
    if (data.destinationCountry) {
      setWorkingDestinationCountry(data.destinationCountry);
    }
    setWorkingPeriod(data.period);
    setWorkingNotes(data.notes);
    setCurrentStep('REVIEW_SUMMARY');
  };

  const handleBatchSaveRecords = (batchPayloads: BatchSkuRecordPayload[]) => {
    const newRecords = recordsService.createBatchRecords(
      batchPayloads.map(p => ({
        product: p.product,
        productQuantity: p.productQuantity,
        method: 'INVENTORY' as RecordingMethod,
        plantId: activePlant.id,
        plantName: activePlant.name,
        destinationCountry: p.destinationCountry,
        materials: p.materials,
        status: p.status,
        period: p.period,
        notes: p.notes
      }))
    );

    // Real-time Factory Inventory Deduction for all materials
    const allMaterialsMap: Record<string, number> = {};
    batchPayloads.forEach(p => {
      p.materials.forEach(m => {
        allMaterialsMap[m.materialId] = (allMaterialsMap[m.materialId] || 0) + m.quantity;
      });
    });
    inventoryService.deductStock(
      Object.entries(allMaterialsMap).map(([materialId, quantity]) => ({
        materialId,
        quantity
      }))
    );

    setCreatedRecords(newRecords);
    setCreatedRecord(newRecords[0]);
    setCurrentStep('CONFIRMED_SUCCESS');
  };

  const handleSaveRecord = (status: RecordStatus) => {
    const newRecord = recordsService.createRecord({
      product: selectedProduct,
      productQuantity: workingQuantity,
      method: selectedMethod,
      plantId: activePlant.id,
      plantName: activePlant.name,
      destinationCountry: workingDestinationCountry,
      materials: workingMaterials,
      status,
      period: workingPeriod,
      notes: workingNotes
    });

    // Real-time Factory Inventory Deduction
    inventoryService.deductStock(workingMaterials.map(m => ({
      materialId: m.materialId,
      quantity: m.quantity
    })));

    setCreatedRecords([newRecord]);
    setCreatedRecord(newRecord);
    setCurrentStep('CONFIRMED_SUCCESS');
  };

  const getMethodBadgeText = () => {
    switch (selectedMethod) {
      case 'INVENTORY': return 'Approach A (ERP Inventory Reconciliation)';
      case 'CALCULATED': return 'Approach B (Top-Down Automated Rules)';
      case 'USER_INPUT': return 'Approach C (Floor Station Manual Log)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Step 1: Select Product (if no initial product) */}
      {currentStep === 'SELECT_PRODUCT' && (
        <div className="glass-card">
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
              Select Product for {activePlant.shortName}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Select an industrial product SKU to execute the site's pre-configured packaging capture flow.
            </p>
          </div>

          <div className="grid-cols-2">
            {availableProducts.map((p) => (
              <div 
                key={p.sku} 
                className="glass-card glass-card-interactive" 
                onClick={() => handleProductSelected(p)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="font-mono text-sm font-bold" style={{ color: '#DA291C' }}>{p.sku}</span>
                  <span className="text-xs text-secondary">{p.weightKg} kg</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{p.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>{p.description}</p>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', color: '#0284C7', fontSize: '0.75rem', fontWeight: 600, alignItems: 'center', gap: '3px' }}>
                  <span>Open Packaging Station</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Method Specific Recording Screens */}
      {currentStep === 'METHOD_FORM' && selectedMethod === 'INVENTORY' && (
        <ApproachInventory
          product={selectedProduct}
          availableMaterials={availableMaterials}
          onCommitBatch={handleBatchSaveRecords}
          onComplete={handleMethodFormCompleted}
          onBack={onCancel}
        />
      )}

      {currentStep === 'METHOD_FORM' && selectedMethod === 'CALCULATED' && (
        <ApproachCalculated
          product={selectedProduct}
          availableMaterials={availableMaterials}
          onComplete={handleMethodFormCompleted}
          onBack={onCancel}
        />
      )}

      {currentStep === 'METHOD_FORM' && selectedMethod === 'USER_INPUT' && (
        <ApproachUserInput
          product={selectedProduct}
          availableMaterials={availableMaterials}
          onComplete={handleMethodFormCompleted}
          onBack={onCancel}
        />
      )}

      {/* Step 4: Common Packaging Summary Review (for Approach B & C) */}
      {currentStep === 'REVIEW_SUMMARY' && (
        <PackagingSummary
          product={selectedProduct}
          productQuantity={workingQuantity}
          method={selectedMethod}
          materials={workingMaterials}
          destinationCountry={workingDestinationCountry}
          period={workingPeriod}
          notes={workingNotes}
          onSave={handleSaveRecord}
          onBackToEdit={() => setCurrentStep('METHOD_FORM')}
        />
      )}

      {/* Step 5: Success / Confirmed Screen */}
      {currentStep === 'CONFIRMED_SUCCESS' && (
        createdRecords.length > 1 ? (
          /* Multi-SKU Batch Success (Approach A) */
          <div className="glass-card" style={{ padding: '2.5rem 2rem', background: '#FFFFFF', border: '1.5px solid #A7F3D0', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid #059669' }}>
                <CheckCircle2 size={32} />
              </div>

              <span className="badge badge-confirmed" style={{ marginBottom: '0.4rem' }}>
                {createdRecords.length} SKU Records Successfully Generated & Reconciled
              </span>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                Plant Reconciliation Ledger Committed ({createdRecords[createdRecords.length - 1].id} – {createdRecords[0].id})
              </h2>

              <p style={{ color: '#475569', maxWidth: '640px', margin: '0 auto', fontSize: '0.88rem' }}>
                {createdRecords.reduce((s, r) => s + r.productQuantity, 0).toLocaleString()} total units across 4 active SKUs recorded at <strong>{activePlant.name}</strong> via <strong>Approach A (ERP Inventory Reconciliation)</strong> for destination <strong>{createdRecords[0].destinationCountry}</strong>.
              </p>
            </div>

            {/* 4-SKU Committed Summary Table */}
            <div style={{ background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '1rem', marginBottom: '1.75rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #CBD5E1' }}>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Record ID</th>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>SKU & Name</th>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Batch Units</th>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Per-Unit Packaging</th>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#DA291C', textTransform: 'uppercase', textAlign: 'right' }}>Total Pkg Mass</th>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Market</th>
                    <th style={{ padding: '8px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {createdRecords.map((rec) => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                      <td style={{ padding: '9px 10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284C7', fontSize: '0.82rem' }}>
                        {rec.id}
                      </td>
                      <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0F172A', fontSize: '0.84rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#64748B', marginRight: '6px' }}>{rec.productSku}</span>
                        {rec.productName}
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
                        {rec.productQuantity.toLocaleString()}
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 700, color: '#059669', fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>
                        {(rec.perUnitPackagingWeightKg * 1000).toFixed(1)} g/u
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 800, color: '#DA291C', fontSize: '0.86rem', fontFamily: 'var(--font-mono)' }}>
                        {rec.totalPackagingWeightKg.toFixed(2)} kg
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'center', fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                        {rec.destinationCountry}
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'center' }}>
                        <span className={`badge ${rec.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-draft'}`} style={{ fontSize: '0.7rem' }}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#F0F9FF', borderTop: '2px solid #BAE6FD' }}>
                    <td colSpan={2} style={{ padding: '9px 10px', fontWeight: 800, color: '#0369A1', fontSize: '0.84rem' }}>
                      Reconciled Total (4 SKUs)
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#0369A1', fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
                      {createdRecords.reduce((s, r) => s + r.productQuantity, 0).toLocaleString()} units
                    </td>
                    <td></td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 900, color: '#DA291C', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
                      {createdRecords.reduce((s, r) => s + r.totalPackagingWeightKg, 0).toFixed(2)} kg
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentStep('METHOD_FORM');
                  setWorkingMaterials([]);
                }}
              >
                <RotateCcw size={16} />
                <span>Reconcile Another Period for {activePlant.shortName}</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => onFinish(createdRecords[0])}
              >
                <span>View in Packaging Records Table</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : createdRecord ? (
          /* Single SKU Success (Approach B or C) */
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#FFFFFF', border: '1.5px solid #A7F3D0', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.08)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid #059669' }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="badge badge-confirmed" style={{ marginBottom: '0.5rem' }}>
              Record Successfully Generated
            </span>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Packaging Record {createdRecord.id} Saved
            </h2>

            <p style={{ color: '#475569', maxWidth: '560px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              {createdRecord.productQuantity.toLocaleString()} units of <strong>{createdRecord.productName}</strong> recorded at <strong>{activePlant.name}</strong> via <strong>{createdRecord.method}</strong> methodology. Committed to the PPWR data ledger.
            </p>

            <div style={{ display: 'inline-flex', gap: '2rem', background: '#F8FAFC', padding: '1rem 2rem', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '2rem', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Total Weight</div>
                <div className="font-mono font-bold text-base" style={{ color: '#DA291C' }}>{createdRecord.totalPackagingWeightKg.toFixed(2)} kg</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Per-Unit Consumption</div>
                <div className="font-mono font-bold text-base" style={{ color: '#059669' }}>{createdRecord.perUnitPackagingWeightKg.toFixed(3)} kg/u</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Paper / Plastic</div>
                <div className="font-mono font-bold text-base" style={{ color: '#0F172A' }}>
                  {createdRecord.ppwrSummary.paperCardboardPct}% / {createdRecord.ppwrSummary.plasticPct}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentStep('METHOD_FORM');
                  setWorkingMaterials([]);
                }}
              >
                <RotateCcw size={16} />
                <span>Record Another Batch for {activePlant.shortName}</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => onFinish(createdRecord)}
              >
                <span>View in Packaging Records Table</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};
