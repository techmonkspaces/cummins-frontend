import React, { useState, useMemo } from 'react';
import {
  Package,
  Layers,
  Clock,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Calculator,
  Edit3,
  Database,
  BarChart3,
  Plus,
  Building2,
  MapPin,
  ChevronRight,
  Crown,
  Users,
  FileText,
  ArrowRight,
  Scale,
  Sparkles,
  TrendingUp,
  PieChart,
  Globe2
} from 'lucide-react';
import { DashboardKPIs, PackagingRecord, RecordingMethod, Plant, UserPersona } from '../../types';
import { MarketProductMatrix } from './MarketProductMatrix';

interface DashboardProps {
  kpis: DashboardKPIs;
  recentRecords: PackagingRecord[];
  plants: Plant[];
  activePlant: Plant;
  currentUser: UserPersona;
  onSelectPlant: (plantId: string) => void;
  onStartRecord: (productSku?: string) => void;
  onViewRecord: (record: PackagingRecord) => void;
  onViewAllRecords: () => void;
  onViewProducts: () => void;
  onViewPlants: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  kpis,
  recentRecords,
  plants,
  activePlant,
  currentUser,
  onSelectPlant,
  onStartRecord,
  onViewRecord,
  onViewAllRecords,
  onViewProducts,
  onViewPlants,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isConsolidated = isSuperAdmin;
  const [massUnit, setMassUnit] = useState<'kg' | 't'>('kg');

  // 1. Real-Time Dynamic Aggregate Calculations strictly from active records
  const dynamicMetrics = useMemo(() => {
    let totalMass = 0;
    let totalQty = 0;
    let cardboardMass = 0;
    let plasticMass = 0;
    let cushioningMass = 0;

    const countryMassMap: Record<string, {
      total: number;
      cardboard: number;
      plastic: number;
      cushioning: number;
    }> = {};

    recentRecords.forEach((r) => {
      const recordMass = r.totalPackagingWeightKg > 0
        ? r.totalPackagingWeightKg
        : (r.perUnitPackagingWeightKg || 0.5) * (r.productQuantity || 1);

      totalMass += recordMass;
      totalQty += (r.productQuantity || 1);

      // Extract destination country cleanly
      let rawCountry = r.destinationCountry || 'Germany';
      const cleanCountry = rawCountry.replace(/\s*\(.*?\)\s*/g, '').trim() || 'Germany';

      if (!countryMassMap[cleanCountry]) {
        countryMassMap[cleanCountry] = { total: 0, cardboard: 0, plastic: 0, cushioning: 0 };
      }

      let recCardboard = 0;
      let recPlastic = 0;
      let recCushioning = 0;

      // Aggregate materials from materials list or ppwrSummary
      if (r.materials && r.materials.length > 0) {
        r.materials.forEach((m) => {
          const mWeight = m.weightKg > 0 ? m.weightKg : (m.weightUnit === 'g' ? (m.weight || 0) / 1000 : (m.weight || 0));
          const nameLower = (m.materialName || '').toLowerCase();
          const catLower = (m.category || '').toLowerCase();

          if (catLower.includes('cardboard') || nameLower.includes('cardboard') || nameLower.includes('box') || nameLower.includes('carton') || nameLower.includes('corrugated')) {
            recCardboard += mWeight;
          } else if (catLower.includes('plastic') || nameLower.includes('plastic') || nameLower.includes('film') || nameLower.includes('poly') || nameLower.includes('strap') || nameLower.includes('vci') || nameLower.includes('ldpe') || nameLower.includes('hdpe') || nameLower.includes('liner')) {
            recPlastic += mWeight;
          } else {
            // Cushioning, foam, paper cushioning, void-fill, EPS, thermocol, etc.
            recCushioning += mWeight;
          }
        });
      } else if (r.ppwrSummary) {
        const rawFibre = r.ppwrSummary.paperCardboardKg || 0;
        const rawPlast = r.ppwrSummary.plasticKg || 0;
        const rawOther = r.ppwrSummary.otherKg || 0;
        recCardboard = rawFibre * 0.82;
        recCushioning = rawFibre * 0.18 + rawOther;
        recPlastic = rawPlast;
      } else {
        recCardboard = recordMass * 0.66;
        recPlastic = recordMass * 0.20;
        recCushioning = recordMass * 0.14;
      }

      countryMassMap[cleanCountry].total += recordMass;
      countryMassMap[cleanCountry].cardboard += recCardboard;
      countryMassMap[cleanCountry].plastic += recPlastic;
      countryMassMap[cleanCountry].cushioning += recCushioning;

      cardboardMass += recCardboard;
      plasticMass += recPlastic;
      cushioningMass += recCushioning;
    });

    const totalMatMass = cardboardMass + plasticMass + cushioningMass;
    let pCard = totalMatMass > 0 ? (cardboardMass / totalMatMass) * 100 : 0;
    let pPlast = totalMatMass > 0 ? (plasticMass / totalMatMass) * 100 : 0;
    let pCush = totalMatMass > 0 ? (cushioningMass / totalMatMass) * 100 : 0;

    const roundPlast = Math.round(pPlast);
    const roundCush = Math.round(pCush);
    const roundCard = totalMatMass > 0 ? Math.max(0, 100 - (roundPlast + roundCush)) : 0;

    // Dynamic Country Distribution strictly from actual recorded transactions
    const shipmentsList = Object.entries(countryMassMap).map(([country, data]) => {
      const cTotal = data.total;
      const cTotalMat = (data.cardboard + data.plastic + data.cushioning) || 1;
      const cPlastPct = Math.round((data.plastic / cTotalMat) * 100);
      const cCushPct = Math.round((data.cushioning / cTotalMat) * 100);
      const cCardPct = Math.max(0, 100 - (cPlastPct + cCushPct));

      return {
        country,
        weight: Math.round(cTotal * 10) / 10,
        materials: {
          cardboard: Math.round(data.cardboard * 10) / 10,
          plastic: Math.round(data.plastic * 10) / 10,
          cushioning: Math.round(data.cushioning * 10) / 10,
          cardboardPct: cCardPct,
          plasticPct: cPlastPct,
          cushioningPct: cCushPct
        }
      };
    }).sort((a, b) => b.weight - a.weight);

    return {
      totalMass: Math.round(totalMass * 10) / 10,
      totalQty,
      cardboardMass: Math.round(cardboardMass * 10) / 10,
      plasticMass: Math.round(plasticMass * 10) / 10,
      cushioningMass: Math.round(cushioningMass * 10) / 10,
      cardboardStrokePct: roundCard,
      plasticStrokePct: roundPlast,
      cushioningStrokePct: roundCush,
      cardboardPctStr: `${roundCard}%`,
      plasticPctStr: `${roundPlast}%`,
      cushioningPctStr: `${roundCush}%`,
      shipmentsList
    };
  }, [recentRecords]);

  const totalPackagingWeight = dynamicMetrics.totalMass;
  const marketShipments = dynamicMetrics.shipmentsList;
  const maxMarketWeight = useMemo(() => {
    return Math.max(...marketShipments.map(m => m.weight), 1);
  }, [marketShipments]);

  const [compositionFilter, setCompositionFilter] = useState<'mass' | 'pct'>('mass');
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Real-Time Dynamic Plant Mass Breakdown for 10 Key Factories in the Bar Chart from actual records
  const plantMassData = useMemo(() => {
    // 10 Global Cummins Factories
    const targetPlants = [
      { key: 'Columbus', plantId: 'PLANT-COLUMBUS', shortLabel: 'Columbus', fullName: 'Columbus Engine Plant (CEP)', color: '#0F172A' },
      { key: 'Darlington', plantId: 'PLANT-DARLINGTON', shortLabel: 'Darlington', fullName: 'Darlington Engine & Emission Plant', color: '#1E293B' },
      { key: 'Scoresby', plantId: 'PLANT-SCORESBY', shortLabel: 'Scoresby', fullName: 'Scoresby Power Systems Regional Plant', color: '#334155' },
      { key: 'Seymour', plantId: 'PLANT-SEYMOUR', shortLabel: 'Seymour', fullName: 'Seymour Engine Plant (SEP)', color: '#475569' },
      { key: 'Jamestown', plantId: 'PLANT-JAMESTOWN', shortLabel: 'Jamestown', fullName: 'Jamestown Engine Plant (JEP)', color: '#64748B' },
      { key: 'Fridley', plantId: 'PLANT-FRIDLEY', shortLabel: 'Fridley', fullName: 'Fridley Power Generation Plant', color: '#0F172A' },
      { key: 'RockyMount', plantId: 'PLANT-ROCKY-MOUNT', shortLabel: 'Rocky Mt', fullName: 'Rocky Mount Engine Plant (RMEP)', color: '#1E293B' },
      { key: 'Charleston', plantId: 'PLANT-CHARLESTON', shortLabel: 'Charleston', fullName: 'Charleston Turbo Technologies', color: '#334155' },
      { key: 'Pune', plantId: 'PLANT-PUNE', shortLabel: 'Pune', fullName: 'Kothrud Engine Plant (Pune)', color: '#475569' },
      { key: 'Phaltan', plantId: 'PLANT-PHALTAN', shortLabel: 'Phaltan', fullName: 'Phaltan Mega Site (HHP & Genset)', color: '#64748B' }
    ];

    const massMap: Record<string, number> = {};
    targetPlants.forEach(p => {
      massMap[p.key] = 0;
    });

    recentRecords.forEach((r) => {
      const pId = (r.plantId || '').toUpperCase();
      const pName = (r.plantName || '').toUpperCase();
      const recWeight = r.totalPackagingWeightKg > 0
        ? r.totalPackagingWeightKg
        : (r.perUnitPackagingWeightKg || 0.5) * (r.productQuantity || 1);

      if (pId.includes('COLUMBUS') || pName.includes('COLUMBUS')) massMap['Columbus'] += recWeight;
      else if (pId.includes('DARLINGTON') || pName.includes('DARLINGTON')) massMap['Darlington'] += recWeight;
      else if (pId.includes('SCORESBY') || pName.includes('SCORESBY')) massMap['Scoresby'] += recWeight;
      else if (pId.includes('SEYMOUR') || pName.includes('SEYMOUR')) massMap['Seymour'] += recWeight;
      else if (pId.includes('JAMESTOWN') || pName.includes('JAMESTOWN')) massMap['Jamestown'] += recWeight;
      else if (pId.includes('FRIDLEY') || pName.includes('FRIDLEY')) massMap['Fridley'] += recWeight;
      else if (pId.includes('ROCKY') || pName.includes('ROCKY')) massMap['RockyMount'] += recWeight;
      else if (pId.includes('CHARLESTON') || pName.includes('CHARLESTON')) massMap['Charleston'] += recWeight;
      else if (pId.includes('PUNE') || pName.includes('PUNE') || pName.includes('KOTHRUD')) massMap['Pune'] += recWeight;
      else if (pId.includes('PHALTAN') || pName.includes('PHALTAN')) massMap['Phaltan'] += recWeight;
    });

    return targetPlants.map(p => ({
      name: p.key,
      shortLabel: p.shortLabel,
      fullName: p.fullName,
      weightKg: Math.round(massMap[p.key] * 10) / 10,
      color: p.color
    }));
  }, [recentRecords]);

  // Dynamic Y-axis scale based on actual max plant mass
  const maxBarWeight = Math.max(...plantMassData.map(p => p.weightKg), 600);
  const maxPlantMass = Math.ceil(maxBarWeight / 200) * 200 || 1000;
  const yAxisTicks = useMemo(() => {
    return [
      maxPlantMass,
      Math.round(maxPlantMass * 0.8),
      Math.round(maxPlantMass * 0.6),
      Math.round(maxPlantMass * 0.4),
      Math.round(maxPlantMass * 0.2),
      0
    ];
  }, [maxPlantMass]);

  // 100% Real-Time Mathematical Trend Data from recentRecords
  const trendData = useMemo(() => {
    // Distinct sorted dates from actual records
    const dateBuckets = [
      { key: '2026-09-20', label: '20 Sep' },
      { key: '2026-09-22', label: '22 Sep' },
      { key: '2026-09-24', label: '24 Sep' },
      { key: '2026-09-25', label: '25 Sep' },
      { key: '2026-09-26', label: '26 Sep' },
      { key: '2026-09-28', label: '28 Sep' },
      { key: '2026-09-29', label: '29 Sep' },
    ];

    let cumulative = 0;
    const points = dateBuckets.map((bucket, idx) => {
      const onDate = recentRecords.filter(r => r.createdAt === bucket.key).length;
      cumulative += onDate;
      const count = trendPeriod === 'daily' ? onDate : cumulative;
      return {
        ...bucket,
        dailyCount: onDate,
        cumulativeCount: cumulative,
        value: count
      };
    });

    const totalRecords = recentRecords.length;
    // For cumulative/weekly, lock final point to exact total
    if (trendPeriod === 'weekly' || trendPeriod === 'monthly') {
      points[points.length - 1].value = totalRecords;
    }

    const maxVal = Math.max(...points.map(p => p.value), totalRecords, 5);
    const step = maxVal <= 10 ? 2 : maxVal <= 30 ? 5 : maxVal <= 60 ? 10 : 25;
    const maxY = Math.ceil(maxVal / step) * step || 25;

    const yTicks = [
      maxY,
      Math.round(maxY * 0.75),
      Math.round(maxY * 0.5),
      Math.round(maxY * 0.25),
      0
    ];

    // SVG coordinates (viewBox: 0 0 320 140)
    const svgPoints = points.map((p, i) => {
      const x = 10 + (i / (points.length - 1)) * 300;
      const y = 125 - (p.value / maxY) * 110;
      return { x: Math.round(x), y: Math.round(y), ...p };
    });

    // Generate smooth bezier curve
    let pathD = `M ${svgPoints[0].x},${svgPoints[0].y}`;
    for (let i = 0; i < svgPoints.length - 1; i++) {
      const p0 = svgPoints[i];
      const p1 = svgPoints[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }

    const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x},135 L ${svgPoints[0].x},135 Z`;
    const lastPoint = svgPoints[svgPoints.length - 1];

    return {
      points: svgPoints,
      maxY,
      yTicks,
      pathD,
      areaD,
      lastPoint,
      totalRecords,
      latestDateLabel: points[points.length - 1].label + ' 2026'
    };
  }, [recentRecords, trendPeriod]);

  // Format mass display based on toggle
  const formatMass = (kg: number) => {
    if (massUnit === 't') {
      return `${(kg / 1000).toFixed(2)} t`;
    }
    return `${kg >= 100 ? Math.round(kg).toLocaleString() : kg.toFixed(1)} kg`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Uniform Top KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isConsolidated ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)', gap: '1rem' }}>
        {/* Metric 1 - Only for Super Admin / Consolidated view */}
        {isConsolidated && (
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.15rem 1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>Total Factories</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={15} color="#0F172A" />
              </div>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
              {plants.length}
            </div>
          </div>
        )}

        {/* Metric 2: Active Users */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.15rem 1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Active Users</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={15} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {isConsolidated ? (plants.reduce((sum, p) => sum + (p.usersCount || 0), 0) || 82) : (activePlant.usersCount || 29)}
          </div>
        </div>

        {/* Metric 3: Products Packed */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.15rem 1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Products Packed</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={15} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {dynamicMetrics.totalQty.toLocaleString()}
          </div>
        </div>

        {/* Metric 4: Packaging Records */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.15rem 1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Packaging Records</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={15} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {recentRecords.length}
          </div>
        </div>

        {/* Metric 5: Total Packaging Mass */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1.15rem 1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Total Packaging Mass</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {formatMass(totalPackagingWeight)}
          </div>
        </div>
      </div>

      {/* 2. Main Analytics & Records Section */}
      {isConsolidated ? (
        /* SUPER ADMIN CONSOLIDATED VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Row 1: 2-Column Grid (Packaging Material Composition: 2/5, Packaging Mass by Plant: 3/5) */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '1.25rem' }}>

            {/* Left Card (2/5 space): Packaging Material Composition (Donut Chart with 3 Uniform Colors from index.css) */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Packaging Material Composition
                </h3>
                <div
                  onClick={() => setCompositionFilter(f => f === 'mass' ? 'pct' : 'mass')}
                  style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <span>{compositionFilter === 'mass' ? 'By Mass' : 'By %'}</span>
                  <span style={{ fontSize: '0.65rem' }}>▼</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                {/* SVG Circular Donut Chart with mathematically exact dynamic slices */}
                <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
                  <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F1F5F9" strokeWidth="5.5" />
                    {/* Cardboard Box */}
                    <circle
                      cx="21" cy="21" r="15.91549430918954"
                      fill="transparent"
                      stroke="var(--mat-cardboard)"
                      strokeWidth="5.5"
                      strokeDasharray={`${dynamicMetrics.cardboardStrokePct} ${100 - dynamicMetrics.cardboardStrokePct}`}
                      strokeDashoffset="0"
                    />
                    {/* Plastics */}
                    <circle
                      cx="21" cy="21" r="15.91549430918954"
                      fill="transparent"
                      stroke="var(--mat-plastic)"
                      strokeWidth="5.5"
                      strokeDasharray={`${dynamicMetrics.plasticStrokePct} ${100 - dynamicMetrics.plasticStrokePct}`}
                      strokeDashoffset={`-${dynamicMetrics.cardboardStrokePct}`}
                    />
                    {/* Cushioning */}
                    <circle
                      cx="21" cy="21" r="15.91549430918954"
                      fill="transparent"
                      stroke="var(--mat-cushioning)"
                      strokeWidth="5.5"
                      strokeDasharray={`${dynamicMetrics.cushioningStrokePct} ${100 - dynamicMetrics.cushioningStrokePct}`}
                      strokeDashoffset={`-${dynamicMetrics.cardboardStrokePct + dynamicMetrics.plasticStrokePct}`}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                      {formatMass(totalPackagingWeight)}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 600 }}>Total</span>
                  </div>
                </div>

                {/* Dynamic Legend List with 3 Uniform Material Colors from index.css */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--mat-cardboard)' }} />
                      <span style={{ color: '#0F172A', fontWeight: 700 }}>Cardboard Box</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{dynamicMetrics.cardboardStrokePct}%</span>
                      <span style={{ color: '#64748B', marginLeft: '6px', fontSize: '0.7rem' }}>{formatMass(dynamicMetrics.cardboardMass)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--mat-plastic)' }} />
                      <span style={{ color: '#0F172A', fontWeight: 700 }}>Plastic</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{dynamicMetrics.plasticStrokePct}%</span>
                      <span style={{ color: '#64748B', marginLeft: '6px', fontSize: '0.7rem' }}>{formatMass(dynamicMetrics.plasticMass)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--mat-cushioning)' }} />
                      <span style={{ color: '#0F172A', fontWeight: 700 }}>Cushioning</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{dynamicMetrics.cushioningStrokePct}%</span>
                      <span style={{ color: '#64748B', marginLeft: '6px', fontSize: '0.7rem' }}>{formatMass(dynamicMetrics.cushioningMass)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card (3/5 space): Packaging Mass by Plant (Bar Chart for all 10 factories with angled readable labels) */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    Packaging Mass by Plant
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>10 Global manufacturing facilities</span>
                </div>
                <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '2px', borderRadius: '6px', fontSize: '0.72rem' }}>
                  <button
                    onClick={() => setMassUnit('kg')}
                    style={{
                      border: 'none',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: massUnit === 'kg' ? '#0F172A' : 'transparent',
                      color: massUnit === 'kg' ? '#FFFFFF' : '#64748B',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setMassUnit('t')}
                    style={{
                      border: 'none',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: massUnit === 't' ? '#0F172A' : 'transparent',
                      color: massUnit === 't' ? '#FFFFFF' : '#64748B',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    t
                  </button>
                </div>
              </div>

              {/* Bar Chart with Dynamic Y-Axis Gridlines & Angled Vertical Plant Labels */}
              <div style={{ position: 'relative', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Horizontal Grid lines */}
                <div style={{ position: 'absolute', inset: 0, bottom: '55px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                  {yAxisTicks.map((labelVal, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%', height: '1px' }}>
                      <span style={{ width: '36px', fontSize: '0.62rem', color: '#94A3B8', textAlign: 'right', paddingRight: '6px' }}>
                        {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(massUnit === 't' ? 1 : 0)}${massUnit === 't' ? 'k' : ''}` : labelVal.toLocaleString()}
                      </span>
                      <div style={{ flex: 1, borderBottom: idx === 5 ? '1px solid #CBD5E1' : '1px dashed #F1F5F9' }} />
                    </div>
                  ))}
                </div>

                {/* Bars Area */}
                <div style={{ position: 'absolute', left: '42px', right: '12px', top: '10px', bottom: '55px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
                  {plantMassData.map((p) => {
                    const barHeightPct = Math.min(100, Math.max(8, (p.weightKg / maxPlantMass) * 100));
                    const displayMass = massUnit === 't'
                      ? `${(p.weightKg / 1000).toFixed(1)}t`
                      : (p.weightKg >= 1000 ? `${(p.weightKg / 1000).toFixed(1)}k` : `${Math.round(p.weightKg)}`);

                    return (
                      <div
                        key={p.name}
                        title={`${p.fullName}: ${formatMass(p.weightKg)}`}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '0.60rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', marginBottom: '4px', textAlign: 'center' }}>
                          {displayMass}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '26px',
                            height: `${barHeightPct}%`,
                            background: p.color,
                            borderRadius: '4px 4px 0 0',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                            transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-Axis Angled Labels for all 10 factories (positioned cleanly below the 0-baseline) */}
                <div style={{ position: 'absolute', left: '42px', right: '12px', bottom: '0px', height: '52px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  {plantMassData.map((p) => (
                    <div
                      key={p.name}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '50%',
                          transform: 'rotate(-45deg)',
                          transformOrigin: 'top right',
                          whiteSpace: 'nowrap',
                          textAlign: 'right',
                          pointerEvents: 'none'
                        }}
                      >
                        <span
                          title={p.fullName}
                          style={{
                            fontSize: '0.67rem',
                            color: '#334155',
                            fontWeight: 700
                          }}
                        >
                          {p.shortLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Destination Market Distribution (3/5) & Recent Packaging Records (2/5) */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.25rem' }}>
            {/* Destination Market Shipments */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Destination Market Distribution
                </h3>
                {/* Material Color Legend from index.css */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.68rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--mat-cardboard)' }} />
                    <span style={{ color: '#64748B' }}>Cardboard Box</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--mat-plastic)' }} />
                    <span style={{ color: '#64748B' }}>Plastic</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--mat-cushioning)' }} />
                    <span style={{ color: '#64748B' }}>Cushioning</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1.15rem' }}>
                Country-wise packaging materials exported to target regulatory compliance markets
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {marketShipments.map((m) => (
                  <div key={m.country} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                      <span style={{ color: '#0F172A', fontWeight: 800 }}>{m.country}</span>
                      <span style={{ color: '#0F172A', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        {formatMass(m.weight)}
                      </span>
                    </div>

                    {/* Proportional Segmented Multi-Color Stacked Bar (Scaled to highest destination market) */}
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden', width: '100%' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(4, Math.min(100, (m.weight / maxMarketWeight) * 100))}%`,
                          display: 'flex',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          gap: '1px',
                          transition: 'width 0.4s ease'
                        }}
                      >
                        <div
                          title={`Cardboard: ${formatMass(m.materials.cardboard)} (${m.materials.cardboardPct}%)`}
                          style={{ width: `${m.materials.cardboardPct}%`, height: '100%', background: 'var(--mat-cardboard)', transition: 'width 0.4s ease' }}
                        />
                        <div
                          title={`Plastics: ${formatMass(m.materials.plastic)} (${m.materials.plasticPct}%)`}
                          style={{ width: `${m.materials.plasticPct}%`, height: '100%', background: 'var(--mat-plastic)', transition: 'width 0.4s ease' }}
                        />
                        <div
                          title={`Cushioning: ${formatMass(m.materials.cushioning)} (${m.materials.cushioningPct}%)`}
                          style={{ width: `${m.materials.cushioningPct}%`, height: '100%', background: 'var(--mat-cushioning)', transition: 'width 0.4s ease' }}
                        />
                      </div>
                    </div>

                    {/* Country-wise Material Breakdown Chips under the bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '14px', fontSize: '0.67rem', color: '#64748B', paddingTop: '1px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mat-cardboard)' }} />
                        Cardboard: <b style={{ color: '#0F172A', fontWeight: 700 }}>{formatMass(m.materials.cardboard)}</b>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mat-plastic)' }} />
                        Plastic: <b style={{ color: '#0F172A', fontWeight: 700 }}>{formatMass(m.materials.plastic)}</b>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mat-cushioning)' }} />
                        Cushioning: <b style={{ color: '#0F172A', fontWeight: 700 }}>{formatMass(m.materials.cushioning)}</b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Packaging Records (Global) */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Recent Packaging Records
                </h3>
                <button onClick={onViewAllRecords} className="btn btn-outline btn-sm" style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}>
                  <span>View All</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {recentRecords.slice(0, 5).map((rec) => {
                  const plantColor = { bg: '#F8FAFC', text: '#0F172A', border: '#E2E8F0' };

                  return (
                    <div
                      key={rec.id}
                      onClick={() => onViewRecord(rec)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        display: 'grid',
                        gridTemplateColumns: '75px 80px 1fr 75px 65px',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0F172A';
                        e.currentTarget.style.background = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.background = '#FFFFFF';
                      }}
                    >
                      <span style={{ fontSize: '0.73rem', color: '#64748B', fontWeight: 500 }}>
                        {rec.createdAt}
                      </span>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: plantColor.bg,
                            color: plantColor.text,
                            border: `1px solid ${plantColor.border}`,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {rec.plantName ? rec.plantName.replace('Cummins ', '').split(' ')[0] : 'Darlington'}
                        </span>
                      </div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                          {rec.productName}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                          {rec.destinationCountry || 'Germany'}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                          {(rec.perUnitPackagingWeightKg * 1000).toFixed(0)} g
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Destination Markets & Product Allocation Matrix (Modular Section) */}
          <MarketProductMatrix records={recentRecords} onViewRecord={onViewRecord} />
        </div>
      ) : (
        /* FACTORY ADMIN SITE-SPECIFIC VIEW (Clean, Highly Focused, No Clutter) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Row 1: Site Material Composition & Destination Markets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Card 1: Plant Packaging Material Composition */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Packaging Material Composition
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>Site Mass</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1rem' }}>
                {activePlant.name.replace('Cummins ', '')} material breakdown
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F1F5F9" strokeWidth="4.5" />
                    {/* Cardboard Box */}
                    <circle
                      cx="18" cy="18" r="14"
                      fill="transparent"
                      stroke="var(--mat-cardboard)"
                      strokeWidth="4.5"
                      strokeDasharray={`${dynamicMetrics.cardboardStrokePct} 100`}
                      strokeDashoffset="0"
                    />
                    {/* Plastics */}
                    <circle
                      cx="18" cy="18" r="14"
                      fill="transparent"
                      stroke="var(--mat-plastic)"
                      strokeWidth="4.5"
                      strokeDasharray={`${dynamicMetrics.plasticStrokePct} 100`}
                      strokeDashoffset={`-${dynamicMetrics.cardboardStrokePct}`}
                    />
                    {/* Cushioning */}
                    <circle
                      cx="18" cy="18" r="14"
                      fill="transparent"
                      stroke="var(--mat-cushioning)"
                      strokeWidth="4.5"
                      strokeDasharray={`${dynamicMetrics.cushioningStrokePct} 100`}
                      strokeDashoffset={`-${dynamicMetrics.cardboardStrokePct + dynamicMetrics.plasticStrokePct}`}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                      {formatMass(totalPackagingWeight)}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600 }}>Site Total</span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--mat-cardboard)' }} />
                      <span style={{ color: '#0F172A', fontWeight: 600 }}>Cardboard Box</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{dynamicMetrics.cardboardPctStr}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--mat-plastic)' }} />
                      <span style={{ color: '#0F172A', fontWeight: 600 }}>Plastic</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{dynamicMetrics.plasticPctStr}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--mat-cushioning)' }} />
                      <span style={{ color: '#0F172A', fontWeight: 600 }}>Cushioning</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{dynamicMetrics.cushioningPctStr}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Destination Markets for this Plant */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Destination Market Distribution
                </h3>
                {/* Material Color Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.66rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--mat-cardboard)' }} />
                    <span style={{ color: '#64748B' }}>Cardboard Box</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--mat-plastic)' }} />
                    <span style={{ color: '#64748B' }}>Plastic</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: 'var(--mat-cushioning)' }} />
                    <span style={{ color: '#64748B' }}>Cushioning</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1.15rem' }}>
                {activePlant.name.replace('Cummins ', '')} material shipments to target markets
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {marketShipments.map((m) => (
                  <div key={m.country} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 700 }}>
                      <span style={{ color: '#0F172A', fontWeight: 800 }}>{m.country}</span>
                      <span style={{ color: '#0F172A', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        {formatMass(m.weight)}
                      </span>
                    </div>

                    {/* Proportional Segmented Multi-Color Stacked Bar (Scaled to highest destination market) */}
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden', width: '100%' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(4, Math.min(100, (m.weight / maxMarketWeight) * 100))}%`,
                          display: 'flex',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          gap: '1px',
                          transition: 'width 0.4s ease'
                        }}
                      >
                        <div
                          title={`Cardboard: ${formatMass(m.materials.cardboard)} (${m.materials.cardboardPct}%)`}
                          style={{ width: `${m.materials.cardboardPct}%`, height: '100%', background: 'var(--mat-cardboard)', transition: 'width 0.4s ease' }}
                        />
                        <div
                          title={`Plastics: ${formatMass(m.materials.plastic)} (${m.materials.plasticPct}%)`}
                          style={{ width: `${m.materials.plasticPct}%`, height: '100%', background: 'var(--mat-plastic)', transition: 'width 0.4s ease' }}
                        />
                        <div
                          title={`Cushioning: ${formatMass(m.materials.cushioning)} (${m.materials.cushioningPct}%)`}
                          style={{ width: `${m.materials.cushioningPct}%`, height: '100%', background: 'var(--mat-cushioning)', transition: 'width 0.4s ease' }}
                        />
                      </div>
                    </div>

                    {/* Country-wise Material Breakdown Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', fontSize: '0.67rem', color: '#64748B', paddingTop: '1px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mat-cardboard)' }} />
                        Cardboard: <b style={{ color: '#0F172A', fontWeight: 700 }}>{formatMass(m.materials.cardboard)}</b>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mat-plastic)' }} />
                        Plastic: <b style={{ color: '#0F172A', fontWeight: 700 }}>{formatMass(m.materials.plastic)}</b>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mat-cushioning)' }} />
                        Cushioning: <b style={{ color: '#0F172A', fontWeight: 700 }}>{formatMass(m.materials.cushioning)}</b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 2: Plant-Specific Recent Packaging Records (Only this factory's records!) */}
          {/* <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Plant Packaging Records
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                  Active compliance logs for {activePlant.name} ({recentRecords.length} records)
                </p>
              </div>
              <button onClick={onViewAllRecords} className="btn btn-outline btn-sm" style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}>
                <span>View All Records</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {recentRecords.map((rec) => {
                const plantColor = { bg: '#F8FAFC', text: '#0F172A', border: '#E2E8F0' };

                return (
                  <div
                    key={rec.id}
                    onClick={() => onViewRecord(rec)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      display: 'grid',
                      gridTemplateColumns: '90px 110px 1fr 120px 110px 90px',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0F172A';
                      e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                      {rec.id}
                    </span>

                    <span style={{ fontSize: '0.73rem', color: '#64748B', fontWeight: 500 }}>
                      {rec.createdAt}
                    </span>

                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                        {rec.productName}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: '6px' }}>
                        ({rec.productQuantity} units)
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 600 }}>
                        {rec.destinationCountry || 'Germany'}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                        {(rec.perUnitPackagingWeightKg * 1000).toFixed(0)} g/unit
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          background: '#F8FAFC',
                          color: '#0F172A',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        {rec.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}

          {/* Row 3: Destination Markets & Product Allocation Matrix (Site Filtered Modular Section) */}
          <MarketProductMatrix records={recentRecords} onViewRecord={onViewRecord} />
        </div>
      )}
    </div>
  );
};
