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
import { ApproachInventory } from './ApproachInventory';
import { ApproachCalculated } from './ApproachCalculated';
import { ApproachUserInput } from './ApproachUserInput';
import { PackagingSummary } from './PackagingSummary';
import { recordsService } from '../../services/recordsService';

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
  availableProducts,
  availableMaterials,
  onFinish,
  onCancel,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || availableProducts[0]
  );

  // Directly land on the configured method form
  const [currentStep, setCurrentStep] = useState<FlowStep>(
    initialProduct ? 'METHOD_FORM' : 'SELECT_PRODUCT'
  );

  const selectedMethod: RecordingMethod = activePlant.configuredMethod || 'INVENTORY';

  const [workingQuantity, setWorkingQuantity] = useState<number>(
    initialProduct?.defaultBatchSize || 1000
  );
  const [workingMaterials, setWorkingMaterials] = useState<PackagingLineItem[]>([]);
  const [workingPeriod, setWorkingPeriod] = useState<string | undefined>('2026-W38 (Sep 15 - Sep 21)');
  const [workingNotes, setWorkingNotes] = useState<string | undefined>('');
  const [createdRecord, setCreatedRecord] = useState<PackagingRecord | null>(null);

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
    period?: string;
    notes?: string;
  }) => {
    if (data.product) {
      setSelectedProduct(data.product);
    }
    setWorkingQuantity(data.productQuantity);
    setWorkingMaterials(data.materials);
    setWorkingPeriod(data.period);
    setWorkingNotes(data.notes);
    setCurrentStep('REVIEW_SUMMARY');
  };

  const handleSaveRecord = (status: RecordStatus) => {
    const newRecord = recordsService.createRecord({
      product: selectedProduct,
      productQuantity: workingQuantity,
      method: selectedMethod,
      plantId: activePlant.id,
      plantName: activePlant.name,
      materials: workingMaterials,
      status,
      period: workingPeriod,
      notes: workingNotes
    });

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

      {/* Step 4: Common Packaging Summary Review */}
      {currentStep === 'REVIEW_SUMMARY' && (
        <PackagingSummary
          product={selectedProduct}
          productQuantity={workingQuantity}
          method={selectedMethod}
          materials={workingMaterials}
          period={workingPeriod}
          notes={workingNotes}
          onSave={handleSaveRecord}
          onBackToEdit={() => setCurrentStep('METHOD_FORM')}
        />
      )}

      {/* Step 5: Success / Confirmed Screen */}
      {currentStep === 'CONFIRMED_SUCCESS' && createdRecord && (
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
      )}
    </div>
  );
};
