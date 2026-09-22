import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { DemoGuideBar } from './components/layout/DemoGuideBar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductList } from './components/products/ProductList';
import { PackagingWorkflow } from './components/packaging-flow/PackagingWorkflow';
import { PackagingRecordsList } from './components/records/PackagingRecordsList';
import { RecordDetailModal } from './components/records/RecordDetailModal';
import { PpwrExportModal } from './components/records/PpwrExportModal';
import { PackagingInventoryView } from './components/inventory/PackagingInventoryView';

import { productService } from './services/productService';
import { inventoryService } from './services/inventoryService';
import { recordsService } from './services/recordsService';
import { 
  Product, 
  PackagingMaterialMaster, 
  PackagingRecord, 
  DashboardKPIs,
  RecordStatus
} from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'records' | 'inventory'>('dashboard');
  const [inRecordingFlow, setInRecordingFlow] = useState<boolean>(false);
  const [selectedProductForFlow, setSelectedProductForFlow] = useState<Product | undefined>(undefined);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<PackagingMaterialMaster[]>([]);
  const [records, setRecords] = useState<PackagingRecord[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs>(recordsService.getDashboardKPIs());

  // Modal State
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<PackagingRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);

  // Demo Story Step (1 to 8)
  const [demoStep, setDemoStep] = useState<number>(1);

  // Load Initial Data
  const refreshData = async () => {
    const prods = await productService.getProducts();
    const mats = await inventoryService.getMaterials();
    const recs = recordsService.getRecords();
    const cats = productService.getCategories();
    const dashboardKpis = recordsService.getDashboardKPIs();

    setProducts(prods);
    setMaterials(mats);
    setRecords(recs);
    setCategories(cats);
    setKpis(dashboardKpis);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Start Packaging Flow Handler
  const handleStartRecording = (productSku?: string) => {
    let prod = products[0];
    if (productSku) {
      const found = products.find(p => p.sku === productSku);
      if (found) prod = found;
    }
    setSelectedProductForFlow(prod);
    setInRecordingFlow(true);
  };

  // Status Change for a Record
  const handleStatusChange = (id: string, newStatus: RecordStatus) => {
    recordsService.updateRecordStatus(id, newStatus);
    refreshData();
    showToast('Status Updated', `Record ${id} confirmed and committed to PPWR ledger.`, 'success');
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    recordsService.deleteRecord(id);
    refreshData();
    showToast('Record Deleted', `Record ${id} removed from ledger.`, 'info');
  };

  // Reset to Mock Dataset
  const handleResetMockData = () => {
    recordsService.resetToMockData();
    refreshData();
    showToast('Mock Data Reset', 'Dataset restored to initial baseline demonstration records.', 'info');
  };

  // Workflow Finish
  const handleWorkflowFinish = (newRecord: PackagingRecord) => {
    setInRecordingFlow(false);
    refreshData();
    setActiveTab('records');
    showToast('Record Created', `Successfully generated ${newRecord.id} for ${newRecord.productName}!`, 'success');
  };

  // Guided Demo Story Stepper Handler
  const handleSelectDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    const gearAssembly = products.find(p => p.sku === 'GA-102') || products[0];

    switch (stepNumber) {
      case 1: // Select Product
        setInRecordingFlow(false);
        setActiveTab('products');
        showToast('Demo Step 1: Select Product', 'Viewing Products Catalog with GA-102 Gear Assembly highlighted.', 'info');
        break;

      case 2: // Choose Method
        setSelectedProductForFlow(gearAssembly);
        setInRecordingFlow(true);
        showToast('Demo Step 2: Choose Method', 'Comparing the 3 packaging recording approaches for Gear Assembly.', 'info');
        break;

      case 3: // Approach A: Inventory
        setSelectedProductForFlow(gearAssembly);
        setInRecordingFlow(true);
        showToast('Demo Step 3: Inventory Method', 'Demonstrating 500kg Cardboard ÷ 1,000 products = 0.5kg/unit.', 'info');
        break;

      case 4: // Approach B: Calculated
        setSelectedProductForFlow(gearAssembly);
        setInRecordingFlow(true);
        showToast('Demo Step 4: System Calculated', 'Rule engine calculates box, cushioning, thermocol, and tape.', 'info');
        break;

      case 5: // Approach C: User Input
        setSelectedProductForFlow(gearAssembly);
        setInRecordingFlow(true);
        showToast('Demo Step 5: User Input Method', 'Floor operator logs actual materials used at packing station.', 'info');
        break;

      case 6: // Review Summary
        setSelectedProductForFlow(gearAssembly);
        setInRecordingFlow(true);
        showToast('Demo Step 6: Review Summary', 'Reviewing unified Bill-of-Materials and PPWR material breakdown.', 'info');
        break;

      case 7: // Confirm Record
        setSelectedProductForFlow(gearAssembly);
        setInRecordingFlow(true);
        showToast('Demo Step 7: Confirm Record', 'Commit the record to the compliance data model.', 'info');
        break;

      case 8: // Audit & Export
        setInRecordingFlow(false);
        setActiveTab('records');
        setIsExportModalOpen(true);
        showToast('Demo Step 8: Audit & Export', 'View confirmed record and inspect IntegrityNext / PPWR JSON payload.', 'info');
        break;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setInRecordingFlow(false);
          setActiveTab(tab);
        }}
        onStartNewRecord={() => handleStartRecording('GA-102')}
      />

      {/* Guided Demo Story Assistant */}
      <DemoGuideBar
        currentDemoStep={demoStep}
        onSelectDemoStep={handleSelectDemoStep}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {inRecordingFlow ? (
          <PackagingWorkflow
            initialProduct={selectedProductForFlow}
            availableProducts={products}
            availableMaterials={materials}
            onFinish={handleWorkflowFinish}
            onCancel={() => setInRecordingFlow(false)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                kpis={kpis}
                recentRecords={records.slice(0, 5)}
                onStartRecord={handleStartRecording}
                onViewRecord={(rec) => setSelectedRecordForDetail(rec)}
                onViewAllRecords={() => setActiveTab('records')}
                onViewProducts={() => setActiveTab('products')}
              />
            )}

            {activeTab === 'products' && (
              <ProductList
                products={products}
                categories={categories}
                onSelectProductForPackaging={(prod) => {
                  setSelectedProductForFlow(prod);
                  setInRecordingFlow(true);
                  setDemoStep(2);
                }}
                onAddNewProduct={async (newProd) => {
                  await productService.addProduct(newProd);
                  refreshData();
                  showToast('Product Added', `Added ${newProd.sku} (${newProd.name}) to Master Catalog.`, 'success');
                }}
              />
            )}

            {activeTab === 'records' && (
              <PackagingRecordsList
                records={records}
                onSelectRecord={(rec) => setSelectedRecordForDetail(rec)}
                onStatusChange={handleStatusChange}
                onDeleteRecord={handleDeleteRecord}
                onResetMockData={handleResetMockData}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onStartNewRecord={() => handleStartRecording('GA-102')}
              />
            )}

            {activeTab === 'inventory' && (
              <PackagingInventoryView
                materials={materials}
                onAddNewMaterial={async (newMat) => {
                  await inventoryService.addMaterial(newMat);
                  refreshData();
                  showToast('Material Added', `Added ${newMat.id} (${newMat.name}) to Packaging Master.`, 'success');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Record Detail Modal */}
      {selectedRecordForDetail && (
        <RecordDetailModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
          onStatusToggle={handleStatusChange}
          onOpenExport={() => {
            setSelectedRecordForDetail(null);
            setIsExportModalOpen(true);
          }}
        />
      )}

      {/* IntegrityNext / PPWR JSON Export Modal */}
      {isExportModalOpen && (
        <PpwrExportModal
          records={records}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <div style={{ color: toastMessage.type === 'success' ? '#10B981' : '#38BDF8' }}>
              {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{toastMessage.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{toastMessage.desc}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
