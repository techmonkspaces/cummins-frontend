import React, { useState, useMemo } from 'react';
import {
  Settings2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  LayoutGrid,
  List
} from 'lucide-react';
import { Plant, RecordingMethod } from '../../types';

interface PlantListViewProps {
  plants: Plant[];
  activePlantId: string;
  onSelectPlant: (plantId: string) => void;
  onUpdatePlantConfig: (plantId: string, updates: Partial<Plant>) => void;
  onNavigateToFactory?: (plantId: string) => void;
}

export const PlantListView: React.FC<PlantListViewProps> = ({
  plants,
  activePlantId,
  onSelectPlant,
  onUpdatePlantConfig,
  onNavigateToFactory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedApproach, setSelectedApproach] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Edit Modal State
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [editMethod, setEditMethod] = useState<RecordingMethod>('INVENTORY');
  const [editErp, setEditErp] = useState<'SAP S/4HANA (PP/MM)' | 'SAP EWM' | 'Oracle WMS'>('SAP S/4HANA (PP/MM)');
  const [editDesc, setEditDesc] = useState('');

  // Extract unique countries and regions
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    plants.forEach(p => { if (p.country && p.country !== 'Global') set.add(p.country); });
    return Array.from(set).sort();
  }, [plants]);

  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    plants.forEach(p => { if (p.region && p.region !== 'Global') set.add(p.region); });
    return Array.from(set).sort();
  }, [plants]);

  // Filtered Plants
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      if (plant.id === 'ALL_PLANTS') return false;

      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query ||
        plant.name.toLowerCase().includes(query) ||
        plant.code.toLowerCase().includes(query) ||
        plant.location.toLowerCase().includes(query) ||
        plant.country.toLowerCase().includes(query) ||
        plant.managerName.toLowerCase().includes(query);

      const matchCountry = selectedCountry === 'ALL' || plant.country === selectedCountry;
      const matchRegion = selectedRegion === 'ALL' || plant.region === selectedRegion;
      const matchApproach = selectedApproach === 'ALL' || plant.configuredMethod === selectedApproach;

      return matchSearch && matchCountry && matchRegion && matchApproach;
    });
  }, [plants, searchQuery, selectedCountry, selectedRegion, selectedApproach]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPlants = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredPlants.slice(start, start + itemsPerPage);
  }, [filteredPlants, validCurrentPage, itemsPerPage]);

  // Stats calculation
  const stats = useMemo(() => {
    const activeList = plants.filter(p => p.id !== 'ALL_PLANTS');
    const total = activeList.length;
    const approachA = activeList.filter(p => p.configuredMethod === 'INVENTORY').length;
    const approachB = activeList.filter(p => p.configuredMethod === 'CALCULATED').length;
    const approachC = activeList.filter(p => p.configuredMethod === 'USER_INPUT').length;
    const countries = new Set(activeList.map(p => p.country)).size;
    return { total, approachA, approachB, approachC, countries };
  }, [plants]);

  const openConfigModal = (plant: Plant) => {
    setEditingPlant(plant);
    setEditMethod(plant.configuredMethod);
    setEditErp(plant.primaryErpSystem);
    setEditDesc(plant.description);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlant) return;

    onUpdatePlantConfig(editingPlant.id, {
      configuredMethod: editMethod,
      primaryErpSystem: editErp,
      description: editDesc
    });

    setEditingPlant(null);
  };

  // Clean, subtle, minimalist approach label (no heavy colored boxes, no icons)
  const getMethodBadge = (method: RecordingMethod) => {
    switch (method) {
      case 'INVENTORY':
        return (
          <span className="clean-pill pill-neutral">
            Approach A · Inventory
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="clean-pill pill-neutral">
            Approach B · Calculated
          </span>
        );
      case 'USER_INPUT':
        return (
          <span className="clean-pill pill-neutral">
            Approach C · User Input
          </span>
        );
    }
  };

  const handleCountryFilterChange = (val: string) => {
    setSelectedCountry(val);
    setCurrentPage(1);
  };

  const handleRegionFilterChange = (val: string) => {
    setSelectedRegion(val);
    setCurrentPage(1);
  };

  const handleApproachFilterChange = (val: string) => {
    setSelectedApproach(val);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCountry('ALL');
    setSelectedRegion('ALL');
    setSelectedApproach('ALL');
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Top Header - Minimalist Typography, No Icon Box */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.85rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Worldwide Cummins Manufacturing Facilities
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Super Admin global directory of {stats.total} manufacturing plants across {stats.countries} countries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card-subtle)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setViewMode('table')}
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-secondary' : ''}`}
            style={{ padding: '4px 8px', background: viewMode === 'table' ? '#FFFFFF' : 'transparent', border: 'none' }}
            title="Table View"
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-secondary' : ''}`}
            style={{ padding: '4px 8px', background: viewMode === 'grid' ? '#FFFFFF' : 'transparent', border: 'none' }}
            title="Grid Cards View"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* Quick Stats Ribbon - Minimal & Light */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Plants</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{stats.total}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Across {stats.countries} Countries</div>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approach A</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{stats.approachA}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Inventory Deduction</div>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approach B</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{stats.approachB}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Calculated CAD Rules</div>
        </div>
        <div className="glass-card" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approach C</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{stats.approachC}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Operator Station Input</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search plant name, code, city, country..."
            style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8rem' }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>

          {/* Country Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Country:</span>
            <select
              className="form-select"
              value={selectedCountry}
              onChange={(e) => handleCountryFilterChange(e.target.value)}
              style={{ height: '34px', fontSize: '0.78rem', minWidth: '120px', padding: '3px 8px' }}
            >
              <option value="ALL">All Countries ({stats.countries})</option>
              {availableCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Region:</span>
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => handleRegionFilterChange(e.target.value)}
              style={{ height: '34px', fontSize: '0.78rem', minWidth: '100px', padding: '3px 8px' }}
            >
              <option value="ALL">All Regions</option>
              {availableRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div> */}

          {/* Approach Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Approach:</span>
            <select
              className="form-select"
              value={selectedApproach}
              onChange={(e) => handleApproachFilterChange(e.target.value)}
              style={{ height: '34px', fontSize: '0.78rem', minWidth: '130px', padding: '3px 8px' }}
            >
              <option value="ALL">All Approaches</option>
              <option value="INVENTORY">Approach A · Inventory</option>
              <option value="CALCULATED">Approach B · Calculated</option>
              <option value="USER_INPUT">Approach C · User Input</option>
            </select>
          </div>

          {(searchQuery || selectedCountry !== 'ALL' || selectedRegion !== 'ALL' || selectedApproach !== 'ALL') && (
            <button
              onClick={clearAllFilters}
              className="btn btn-secondary btn-sm"
              style={{ height: '34px', padding: '0 8px', fontSize: '0.74rem' }}
              title="Clear Filters"
            >
              <X size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Minimal Table */}
      {viewMode === 'table' ? (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Factory / Location</th>
                <th>Country </th>
                <th>Configured Approach</th>

                <th>Users</th>
                <th>Records</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlants.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No manufacturing plants found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedPlants.map((plant) => {
                  const isCurrentActive = activePlantId === plant.id;

                  return (
                    <tr
                      key={plant.id}
                      style={{
                        background: isCurrentActive ? 'rgba(218, 41, 28, 0.02)' : undefined,
                      }}
                    >
                      {/* Clean Factory & Location (No square black avatar box) */}
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                            {plant.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            <span className="font-mono text-xs font-semibold">{plant.code}</span>
                            <span style={{ margin: '0 5px' }}>·</span>
                            <span>{plant.location}</span>
                          </div>
                        </div>
                      </td>

                      {/* Clean Country / Region (No emoji flag prefix) */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                            {plant.country}
                          </span>

                        </div>
                      </td>

                      {/* Clean Approach (Simple subtle text) */}
                      <td>
                        {getMethodBadge(plant.configuredMethod)}
                      </td>



                      {/* Users */}
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                        {plant.usersCount || 12}
                      </td>

                      {/* Records */}
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                        {(plant.recordsCount || 400).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              onSelectPlant(plant.id);
                              if (onNavigateToFactory) onNavigateToFactory(plant.id);
                            }}
                            className={`btn btn-sm ${isCurrentActive ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ height: '28px', padding: '0 9px', fontSize: '0.72rem' }}
                          >
                            <span>{isCurrentActive ? 'Active Scope' : 'Select'}</span>
                            <ArrowRight size={11} />
                          </button>

                          <button
                            onClick={() => openConfigModal(plant)}
                            className="btn btn-secondary btn-sm"
                            style={{ height: '28px', padding: '0 7px' }}
                            title="Configure Factory Approach"
                          >
                            <Settings2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Mode - Clean & Minimal */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.85rem' }}>
          {paginatedPlants.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              No manufacturing plants found matching your filter criteria.
            </div>
          ) : (
            paginatedPlants.map((plant) => {
              const isCurrentActive = activePlantId === plant.id;

              return (
                <div
                  key={plant.id}
                  className="glass-card"
                  style={{
                    border: isCurrentActive ? '2px solid var(--cummins-red)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.65rem',
                    padding: '1.1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {plant.code}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {plant.primaryErpSystem}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {plant.name}
                    </h3>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>{plant.country}</span>
                      <span style={{ margin: '0 4px' }}>·</span>
                      <span>{plant.location}</span>
                    </div>

                    <div style={{ background: 'var(--bg-card-subtle)', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <div style={{ marginBottom: '2px' }}>{getMethodBadge(plant.configuredMethod)}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {plant.description}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', padding: '3px 0', borderTop: '1px solid var(--border-subtle)' }}>
                      <span>{plant.usersCount || 12} Users</span>
                      <span>{(plant.recordsCount || 400).toLocaleString()} Records</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '5px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => {
                        onSelectPlant(plant.id);
                        if (onNavigateToFactory) onNavigateToFactory(plant.id);
                      }}
                      className={`btn btn-sm ${isCurrentActive ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, justifyContent: 'center', height: '30px', fontSize: '0.72rem' }}
                    >
                      <span>{isCurrentActive ? 'Active Scope' : 'Select'}</span>
                      <ArrowRight size={11} />
                    </button>
                    <button
                      onClick={() => openConfigModal(plant)}
                      className="btn btn-secondary btn-sm"
                      style={{ height: '30px', padding: '0 7px' }}
                      title="Configure"
                    >
                      <Settings2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          background: 'var(--bg-card)',
          borderRadius: '0 0 10px 10px',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredPlants.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0}</strong> - <strong style={{ color: 'var(--text-primary)' }}>{Math.min(validCurrentPage * itemsPerPage, filteredPlants.length)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredPlants.length}</strong> factories
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                height: '30px',
                padding: '0 10px',
                fontSize: '0.76rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={validCurrentPage <= 1}
            className="btn btn-secondary btn-sm"
            style={{ height: '30px', padding: '0 10px', fontSize: '0.74rem', opacity: validCurrentPage <= 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`btn btn-sm ${pageNum === validCurrentPage ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  minWidth: '30px',
                  height: '30px',
                  padding: '0 6px',
                  fontSize: '0.76rem',
                  fontWeight: pageNum === validCurrentPage ? 700 : 500
                }}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={validCurrentPage >= totalPages}
            className="btn btn-secondary btn-sm"
            style={{ height: '30px', padding: '0 10px', fontSize: '0.74rem', opacity: validCurrentPage >= totalPages ? 0.5 : 1 }}
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Configuration Modal */}
      {editingPlant && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Configure {editingPlant.name}
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Set pre-configured compliance approach for this factory
                </span>
              </div>
              <button
                onClick={() => setEditingPlant(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Pre-Configured Packaging Methodology</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {[
                    { id: 'INVENTORY', label: 'Approach A · Inventory Consumption', desc: 'Reconciles WMS batch stock deductions automatically.' },
                    { id: 'CALCULATED', label: 'Approach B · System Calculated', desc: 'Computes box size & void cushioning from CAD rules.' },
                    { id: 'USER_INPUT', label: 'Approach C · Floor Station User Input', desc: 'Shop-floor operator selects materials & logs digital scale.' }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: editMethod === opt.id ? '2px solid var(--cummins-red)' : '1px solid var(--border-subtle)',
                        background: editMethod === opt.id ? 'var(--cummins-red-subtle)' : 'var(--bg-surface)',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="configuredMethod"
                        value={opt.id}
                        checked={editMethod === opt.id}
                        onChange={() => setEditMethod(opt.id as RecordingMethod)}
                        style={{ marginTop: '2px' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Primary ERP / WMS Ingestion Source</label>
                <select
                  className="form-select"
                  value={editErp}
                  onChange={(e) => setEditErp(e.target.value as any)}
                  style={{ height: '36px' }}
                >
                  <option value="SAP S/4HANA (PP/MM)">SAP S/4HANA (PP/MM)</option>
                  <option value="SAP EWM">SAP EWM (Extended Warehouse)</option>
                  <option value="Oracle WMS">Oracle WMS</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingPlant(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
