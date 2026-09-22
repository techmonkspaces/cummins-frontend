import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw
} from 'lucide-react';
import { 
  Product, 
  PackagingMaterialMaster, 
  RecordingMethod, 
  PackagingLineItem, 
  RecordStatus,
  PackagingRecord
} from '../../types';
import { MethodSelector } from './MethodSelector';
import { ApproachInventory } from './ApproachInventory';
import { ApproachCalculated } from './ApproachCalculated';
import { ApproachUserInput } from './ApproachUserInput';
import { PackagingSummary } from './PackagingSummary';
import { recordsService } from '../../services/recordsService';

interface PackagingWorkflowProps {
  initialProduct?: Product;
  availableProducts: Product[];
  availableMaterials: PackagingMaterialMaster[];
  onFinish: (record: PackagingRecord) => void;
  onCancel: () => void;
  onViewRecordDetail?: (record: PackagingRecord) => void;
}

type FlowStep = 'SELECT_PRODUCT' | 'SELECT_METHOD' | 'METHOD_FORM' | 'REVIEW_SUMMARY' | 'CONFIRMED_SUCCESS';

export const PackagingWorkflow: React.FC<PackagingWorkflowProps> = ({
  initialProduct,
  availableProducts,
  availableMaterials,
  onFinish,
  onCancel,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || availableProducts[0]
  );
  const [currentStep, setCurrentStep] = useState<FlowStep>(
    initialProduct ? 'SELECT_METHOD' : 'SELECT_PRODUCT'
  );
  const [selectedMethod, setSelectedMethod] = useState<RecordingMethod | null>('INVENTORY');

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
    setCurrentStep('SELECT_METHOD');
  };

  const handleMethodChosen = () => {
    if (!selectedMethod) return;
    setCurrentStep('METHOD_FORM');
  };

  const handleMethodFormCompleted = (data: {
    productQuantity: number;
    materials: PackagingLineItem[];
    period?: string;
    notes?: string;
  }) => {
    setWorkingQuantity(data.productQuantity);
    setWorkingMaterials(data.materials);
    setWorkingPeriod(data.period);
    setWorkingNotes(data.notes);
    setCurrentStep('REVIEW_SUMMARY');
  };

  const handleSaveRecord = (status: RecordStatus) => {
    if (!selectedMethod) return;

    const newRecord = recordsService.createRecord({
      product: selectedProduct,
      productQuantity: workingQuantity,
      method: selectedMethod,
      materials: workingMaterials,
      status,
      period: workingPeriod,
      notes: workingNotes
    });

    setCreatedRecord(newRecord);
    setCurrentStep('CONFIRMED_SUCCESS');
  };

  const getStepNumber = (step: FlowStep) => {
    switch (step) {
      case 'SELECT_PRODUCT': return 1;
      case 'SELECT_METHOD': return 2;
      case 'METHOD_FORM': return 3;
      case 'REVIEW_SUMMARY': return 4;
      case 'CONFIRMED_SUCCESS': return 5;
    }
  };

  const currentStepNum = getStepNumber(currentStep);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Step Tracker Indicator */}
      <div className="glass-card" style={{ padding: '0.85rem 1.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { num: 1, label: '1. Select Product' },
            { num: 2, label: '2. Choose Method' },
            { num: 3, label: '3. Record / Calculate' },
            { num: 4, label: '4. Common Summary' },
            { num: 5, label: '5. Confirmation' },
          ].map((s) => {
            const isDone = currentStepNum > s.num;
            const isCurrent = currentStepNum === s.num;

            return (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isCurrent || isDone ? 1 : 0.45 }}>
                <div 
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: isCurrent ? 'var(--cummins-red)' : isDone ? '#059669' : '#F1F5F9',
                    color: isCurrent || isDone ? '#fff' : '#64748B',
                    border: isDone || isCurrent ? 'none' : '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#0F172A' : '#64748B' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Select Product */}
      {currentStep === 'SELECT_PRODUCT' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
            Select Product for Packaging Recording
          </h2>
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Choose Method */}
      {currentStep === 'SELECT_METHOD' && (
        <MethodSelector
          product={selectedProduct}
          selectedMethod={selectedMethod}
          onSelectMethod={(m) => setSelectedMethod(m)}
          onContinue={handleMethodChosen}
          onBack={onCancel}
        />
      )}

      {/* Step 3: Method Specific Recording Screens */}
      {currentStep === 'METHOD_FORM' && selectedMethod === 'INVENTORY' && (
        <ApproachInventory
          product={selectedProduct}
          availableMaterials={availableMaterials}
          onComplete={handleMethodFormCompleted}
          onBack={() => setCurrentStep('SELECT_METHOD')}
        />
      )}

      {currentStep === 'METHOD_FORM' && selectedMethod === 'CALCULATED' && (
        <ApproachCalculated
          product={selectedProduct}
          availableMaterials={availableMaterials}
          onComplete={handleMethodFormCompleted}
          onBack={() => setCurrentStep('SELECT_METHOD')}
        />
      )}

      {currentStep === 'METHOD_FORM' && selectedMethod === 'USER_INPUT' && (
        <ApproachUserInput
          product={selectedProduct}
          availableMaterials={availableMaterials}
          onComplete={handleMethodFormCompleted}
          onBack={() => setCurrentStep('SELECT_METHOD')}
        />
      )}

      {/* Step 4: Common Packaging Summary Review */}
      {currentStep === 'REVIEW_SUMMARY' && selectedMethod && (
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
            {createdRecord.productQuantity.toLocaleString()} units of <strong>{createdRecord.productName}</strong> recorded via <strong>{createdRecord.method}</strong> methodology. Committed to the PPWR data ledger.
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
                setCurrentStep('SELECT_METHOD');
                setWorkingMaterials([]);
              }}
            >
              <RotateCcw size={16} />
              <span>Record Another Batch</span>
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
