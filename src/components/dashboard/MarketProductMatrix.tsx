import React, { useState, useMemo } from 'react';
import { Globe2, BarChart3, Package, Layers, ArrowUpDown, Filter } from 'lucide-react';
import { PackagingRecord } from '../../types';

interface MarketProductMatrixProps {
  records: PackagingRecord[];
  onViewRecord?: (record: PackagingRecord) => void;
}

interface ProductUnitBreakdown {
  sku: string;
  name: string;
  units: number;
  pctOfMarket: number;
}

interface MarketUnitsSummary {
  country: string;
  flag: string;
  totalUnits: number;
  pctOfTotal: number;
  batchCount: number;
  products: ProductUnitBreakdown[];
}

const COUNTRY_FLAGS: Record<string, string> = {
  'Germany': '🇩🇪',
  'Germany (EU)': '🇩🇪',
  'Spain': '🇪🇸',
  'Spain (EU)': '🇪🇸',
  'Denmark': '🇩🇰',
  'France': '🇫🇷',
  'France (EU)': '🇫🇷',
  'Italy': '🇮🇹',
  'Italy (EU)': '🇮🇹',
  'United Kingdom': '🇬🇧',
  'United Kingdom (UK)': '🇬🇧',
  'UK': '🇬🇧',
  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'Australia': '🇦🇺',
  'India': '🇮🇳',
  'Netherlands': '🇳🇱',
  'Poland': '🇵🇱',
  'Sweden': '🇸🇪',
  'Global': '🌐'
};

const BAR_COLORS = [
  '#0F172A', // Dark Slate / Charcoal
  '#334155', // Charcoal
  '#475569', // Medium Slate
  '#64748B', // Neutral Slate
  '#94A3B8', // Light Slate
  '#1E293B', // Deep Charcoal
  '#64748B', // Charcoal
  '#CBD5E1', // Silver Gray
];

export const MarketProductMatrix: React.FC<MarketProductMatrixProps> = ({
  records,
  onViewRecord,
}) => {
  const [sortBy, setSortBy] = useState<'units' | 'name'>('units');

  // Dynamic Aggregation: Units sold per Market and per Product SKU
  const { marketData, totalGlobalUnits, maxMarketUnits, distinctProductsCount } = useMemo(() => {
    const marketMap: Record<string, { totalUnits: number; batchCount: number; productUnits: Record<string, { name: string; units: number }> }> = {};
    const allSkusSet = new Set<string>();
    let globalUnits = 0;

    records.forEach((rec) => {
      const rawCountry = rec.destinationCountry || 'Germany';
      const cleanCountry = rawCountry.replace(' (EU)', '').replace(' (UK)', '').trim();
      const units = rec.productQuantity || 1;
      const sku = rec.productSku || 'SKU-GEN';
      const name = rec.productName || sku;

      globalUnits += units;
      allSkusSet.add(sku);

      if (!marketMap[cleanCountry]) {
        marketMap[cleanCountry] = {
          totalUnits: 0,
          batchCount: 0,
          productUnits: {}
        };
      }

      const m = marketMap[cleanCountry];
      m.totalUnits += units;
      m.batchCount += 1;

      if (!m.productUnits[sku]) {
        m.productUnits[sku] = { name, units: 0 };
      }
      m.productUnits[sku].units += units;
    });

    const safeGlobalUnits = globalUnits > 0 ? globalUnits : 1;
    let maxUnits = 1;

    const list: MarketUnitsSummary[] = Object.entries(marketMap).map(([country, data]) => {
      if (data.totalUnits > maxUnits) maxUnits = data.totalUnits;

      const products: ProductUnitBreakdown[] = Object.entries(data.productUnits).map(([sku, p]) => ({
        sku,
        name: p.name,
        units: p.units,
        pctOfMarket: data.totalUnits > 0 ? Math.round((p.units / data.totalUnits) * 100) : 0
      })).sort((a, b) => b.units - a.units);

      return {
        country,
        flag: COUNTRY_FLAGS[country] || '🌐',
        totalUnits: data.totalUnits,
        pctOfTotal: Math.round((data.totalUnits / safeGlobalUnits) * 100),
        batchCount: data.batchCount,
        products
      };
    });

    if (sortBy === 'units') {
      list.sort((a, b) => b.totalUnits - a.totalUnits);
    } else {
      list.sort((a, b) => a.country.localeCompare(b.country));
    }

    return {
      marketData: list,
      totalGlobalUnits: globalUnits,
      maxMarketUnits: maxUnits,
      distinctProductsCount: allSkusSet.size
    };
  }, [records, sortBy]);

  if (marketData.length === 0) return null;

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={15} color="#0F172A" />
            </div>
            <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Product Units Sold by Destination Market
            </h3>
            <span style={{ fontSize: '0.7rem', color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
              {totalGlobalUnits.toLocaleString()} Total Units
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '3px' }}>
            Distribution of manufactured product units and SKU counts shipped across target compliance markets.
          </p>
        </div>

        {/* Quick Sort Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setSortBy(s => s === 'units' ? 'name' : 'units')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              fontSize: '0.74rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <ArrowUpDown size={12} />
            <span>Sort: {sortBy === 'units' ? 'Units (High to Low)' : 'Market (A-Z)'}</span>
          </button>
        </div>
      </div>

      {/* Scalable Bar Chart & Breakdown List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
        {marketData.map((market, idx) => {
          const barWidthPct = maxMarketUnits > 0 ? Math.max(4, Math.round((market.totalUnits / maxMarketUnits) * 100)) : 0;
          const barColor = BAR_COLORS[idx % BAR_COLORS.length];

          return (
            <div
              key={market.country}
              style={{
                border: '1px solid #F1F5F9',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                background: '#FAFAFA',
                transition: 'background 0.15s ease'
              }}
            >
              {/* Top Line: Market Name, Units & Share */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{market.flag}</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A' }}>
                    {market.country}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>
                    ({market.products.length} product{market.products.length > 1 ? 's' : ''})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                    {market.totalUnits.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                    units
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--theme-progress-bar)', background: 'var(--theme-progress-bar-bg)', border: '1px solid var(--theme-progress-bar-border)', padding: '1px 6px', borderRadius: '4px' }}>
                    {market.pctOfTotal}%
                  </span>
                </div>
              </div>

              {/* Graphical Unit Distribution Bar */}
              <div style={{ height: '7px', background: 'var(--theme-progress-track, #F1F5F9)', borderRadius: '999px', overflow: 'hidden', marginBottom: '7px' }}>
                <div
                  style={{
                    width: `${barWidthPct}%`,
                    height: '100%',
                    background: 'var(--theme-progress-bar)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              {/* Product SKUs Count Chips (Clean & Minimalist) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                {market.products.map((prod) => (
                  <span
                    key={prod.sku}
                    style={{
                      fontSize: '0.72rem',
                      color: '#334155',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <strong style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{prod.sku}</strong>
                    <span style={{ color: '#64748B' }}>{prod.name}</span>
                    <strong style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                      {prod.units.toLocaleString()} u
                    </strong>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
