import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProductList } from './components/products/ProductList';
import { PackagingWorkflow } from './components/packaging-flow/PackagingWorkflow';
import { PackagingRecordsList } from './components/records/PackagingRecordsList';
import { RecordDetailModal } from './components/records/RecordDetailModal';
import { PpwrExportModal } from './components/records/PpwrExportModal';
import { PackagingInventoryView } from './components/inventory/PackagingInventoryView';
import { PlantListView } from './components/plants/PlantListView';
import { UsersListView } from './components/users/UsersListView';
import { RulesConfigView } from './components/rules/RulesConfigView';
import { LoginView } from './components/auth/LoginView';

import { productService } from './services/productService';
import { inventoryService } from './services/inventoryService';
import { recordsService } from './services/recordsService';
import { plantService } from './services/plantService';
import { authService } from './services/authService';
import { 
  Product, 
  PackagingMaterialMaster, 
  PackagingRecord, 
  DashboardKPIs,
  RecordStatus,
  Plant,
  UserPersona
} from './types';
import { Sparkles, CheckCircle2, Building2 } from 'lucide-react';

export const App: React.FC = () => {
  // Auth State
  const initialUser = authService.getCurrentUser() || plantService.getActivePersona();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserPersona>(initialUser);

  // Navigation State - Data entry users go directly to their logging station
  const [activeTab, setActiveTab] = useState<NavTab>(initialUser?.role === 'DATA_ENTRY' ? 'packaging' : 'dashboard');
  const [inRecordingFlow, setInRecordingFlow] = useState<boolean>(initialUser?.role === 'DATA_ENTRY');
  const [selectedProductForFlow, setSelectedProductForFlow] = useState<Product | undefined>(undefined);

  // Plant State
  const [plants, setPlants] = useState<Plant[]>(plantService.getPlants());
  const [personas, setPersonas] = useState<UserPersona[]>(plantService.getPersonas());
  const [activePlant, setActivePlant] = useState<Plant>(plantService.getActivePlant());

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
    setPlants(plantService.getPlants());
    setActivePlant(plantService.getActivePlant());
    setPersonas(plantService.getPersonas());
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

  // Auth Handlers
  const handleLogin = (persona: UserPersona) => {
    authService.loginWithPersona(persona.id);
    setCurrentUser(persona);
    setIsAuthenticated(true);
    if (persona.plantId && persona.plantId !== 'ALL_PLANTS') {
      const p = plantService.setActivePlant(persona.plantId);
      setActivePlant(p);
    }
    if (persona.role === 'DATA_ENTRY') {
      setActiveTab('packaging');
      setInRecordingFlow(true);
    } else {
      setActiveTab('dashboard');
      setInRecordingFlow(false);
    }
    showToast('Signed In Successfully', `Welcome ${persona.name} (${persona.roleTitle.split('•')[0]}).`, 'success');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    showToast('Signed Out', 'You have been signed out from Cummins Packaging Hub.', 'info');
  };

  // Plant & Persona Switchers
  const handleSelectPlant = (plantId: string) => {
    const updated = plantService.setActivePlant(plantId);
    setActivePlant(updated);
    const matchedPersona = personas.find(p => p.plantId === plantId);
    if (matchedPersona) {
      setCurrentUser(matchedPersona);
      if (matchedPersona.role === 'DATA_ENTRY') {
        setActiveTab('packaging');
        setInRecordingFlow(true);
      }
    }
    showToast('Active Factory Switched', `Switched active factory to ${updated.name}.`, 'info');
  };

  const handleSelectPersona = (personaId: string) => {
    const updated = authService.loginWithPersona(personaId);
    if (updated) {
      setCurrentUser(updated);
      plantService.setActivePersona(personaId);
      setActivePlant(plantService.getActivePlant());
      if (updated.role === 'DATA_ENTRY') {
        setActiveTab('packaging');
        setInRecordingFlow(true);
      } else {
        setActiveTab('dashboard');
        setInRecordingFlow(false);
      }
      showToast('Role Switched', `Active role: ${updated.name} (${updated.roleTitle.split('•')[0]}).`, 'info');
    }
  };

  const handleUpdatePlantConfig = (plantId: string, updates: Partial<Plant>) => {
    plantService.updatePlantConfig(plantId, updates);
    refreshData();
    showToast('Factory Configuration Saved', `Updated pre-configured approach for ${plantId}.`, 'success');
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
    setActiveTab('packaging');
  };

  // Status Change for a Record
  const handleStatusChange = (id: string, newStatus: RecordStatus) => {
    recordsService.updateRecordStatus(id, newStatus);
    refreshData();
    showToast('Status Updated', `Record ${id} confirmed and committed to PPWR ledger.`, 'success');
  };

  // If user is not authenticated, show Login Screen
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Filter records based on role / active plant
  const displayedRecords = currentUser.role === 'SUPER_ADMIN' 
    ? records 
    : records.filter(r => r.plantId === activePlant.id || r.plantName?.toLowerCase().includes(activePlant.shortName.toLowerCase()));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      
      {/* Left Enterprise Sidebar (Clean White Background) */}
      <Sidebar
        activeTab={inRecordingFlow ? 'packaging' : activeTab}
        onSelectTab={(tab: NavTab) => {
          if (tab === 'reports') {
            setIsExportModalOpen(true);
          } else {
            setActiveTab(tab);
            setInRecordingFlow(false);
          }
        }}
        currentUser={currentUser}
        activePlant={activePlant}
        onLogout={handleLogout}
        onStartPackagingFlow={() => handleStartRecording()}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          activePlant={activePlant}
          plants={plants}
          personas={personas}
          onSelectPlant={handleSelectPlant}
          onSelectPersona={handleSelectPersona}
          onLogout={handleLogout}
          onStartNewRecord={() => handleStartRecording()}
        />

        {/* Dynamic Viewport Content */}
        <main style={{ flex: 1, padding: '1.75rem 2rem 3rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          
          {/* Packaging Workflow Active */}
          {inRecordingFlow ? (
            <PackagingWorkflow
              initialProduct={selectedProductForFlow}
              activePlant={activePlant}
              availableProducts={products}
              availableMaterials={materials}
              onFinish={(record: PackagingRecord) => {
                refreshData();
                setInRecordingFlow(false);
                setActiveTab('records');
                showToast('Record Committed', `Successfully committed ${record.id} into compliance ledger.`, 'success');
              }}
              onCancel={() => {
                setInRecordingFlow(false);
                setActiveTab('dashboard');
              }}
              onViewRecordDetail={(rec: PackagingRecord) => setSelectedRecordForDetail(rec)}
            />
          ) : (
            <>
              {/* Tab 1: Dashboard */}
              {activeTab === 'dashboard' && (
                <Dashboard
                  kpis={kpis}
                  recentRecords={displayedRecords}
                  plants={plants}
                  activePlant={activePlant}
                  currentUser={currentUser}
                  onSelectPlant={handleSelectPlant}
                  onStartRecord={handleStartRecording}
                  onViewRecord={(rec: PackagingRecord) => setSelectedRecordForDetail(rec)}
                  onViewAllRecords={() => setActiveTab('records')}
                  onViewProducts={() => setActiveTab('products')}
                  onViewPlants={() => setActiveTab('plants')}
                />
              )}

              {/* Tab 2: Factories (Super Admin Only) */}
              {activeTab === 'plants' && (
                <PlantListView
                  plants={plants}
                  activePlantId={activePlant.id}
                  onSelectPlant={handleSelectPlant}
                  onUpdatePlantConfig={handleUpdatePlantConfig}
                  onNavigateToFactory={(plantId: string) => {
                    handleSelectPlant(plantId);
                    setActiveTab('dashboard');
                  }}
                />
              )}

              {/* Tab 3: Products */}
              {activeTab === 'products' && (
                <ProductList
                  products={products}
                  categories={categories}
                  onSelectProductForPackaging={(product: Product) => handleStartRecording(product.sku)}
                  onAddNewProduct={(prod: Product) => {
                    productService.addProduct(prod);
                    refreshData();
                    showToast('Product Added', `Added ${prod.name} to product master.`, 'success');
                  }}
                />
              )}

              {/* Tab 4: Packaging Inventory */}
              {activeTab === 'inventory' && (
                <PackagingInventoryView
                  materials={materials}
                />
              )}

              {/* Tab 5: Packaging Records */}
              {activeTab === 'records' && (
                <PackagingRecordsList
                  records={displayedRecords}
                  plants={plants}
                  isSuperAdmin={currentUser.role === 'SUPER_ADMIN'}
                  canDelete={currentUser.permissions.canDeleteRecords}
                  canApprove={currentUser.permissions.canApproveRecords}
                  canExport={currentUser.permissions.canExportPpwr}
                  onSelectRecord={(record: PackagingRecord) => setSelectedRecordForDetail(record)}
                  onStatusChange={handleStatusChange}
                  onDeleteRecord={(id: string) => {
                    recordsService.deleteRecord(id);
                    refreshData();
                    showToast('Record Deleted', `Record ${id} removed.`, 'info');
                  }}
                  onResetMockData={() => {
                    recordsService.resetMockRecords();
                    refreshData();
                    showToast('Data Reset', 'Mock packaging records reset to initial seed state.', 'info');
                  }}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  onStartNewRecord={() => handleStartRecording()}
                />
              )}

              {/* Tab 6: Users (Super Admin Only) */}
              {activeTab === 'users' && (
                <UsersListView
                  onImpersonateUser={(persona: UserPersona) => handleLogin(persona)}
                />
              )}

              {/* Tab 7: Rules & Configuration (Super Admin Only) */}
              {activeTab === 'rules' && (
                <RulesConfigView />
              )}
            </>
          )}

        </main>
      </div>

      {/* Record Detail Modal */}
      {selectedRecordForDetail && (
        <RecordDetailModal
          record={selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
          onStatusToggle={(id: string, status: RecordStatus) => handleStatusChange(id, status)}
          onOpenExport={() => setIsExportModalOpen(true)}
        />
      )}

      {/* PPWR / IntegrityNext Export Modal */}
      {isExportModalOpen && (
        <PpwrExportModal
          records={displayedRecords}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '10px',
            padding: '12px 18px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'toastSlideUp 0.25s ease-out'
          }}
        >
          <div style={{ background: toastMessage.type === 'success' ? '#059669' : '#0284C7', borderRadius: '50%', padding: '4px', display: 'flex' }}>
            <CheckCircle2 size={16} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{toastMessage.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{toastMessage.desc}</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
