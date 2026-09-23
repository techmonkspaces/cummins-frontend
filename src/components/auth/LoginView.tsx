import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Crown, 
  Building2, 
  Edit3, 
  CheckCircle2, 
  Globe2, 
  Sparkles,
  Layers,
  Cpu,
  Calculator,
  Database
} from 'lucide-react';
import { CumminsLogo } from '../layout/CumminsLogo';
import { UserPersona } from '../../types';
import { MOCK_PERSONAS } from '../../data/mockData';

interface LoginViewProps {
  onLogin: (persona: UserPersona) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@cummins.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRoleCard, setSelectedRoleCard] = useState<string>('PERSONA-ADMIN');

  const superAdmin        = MOCK_PERSONAS.find(p => p.id === 'PERSONA-ADMIN')!;
  const puneMgr           = MOCK_PERSONAS.find(p => p.id === 'PERSONA-PUNE-MGR')!;
  const puneOpr           = MOCK_PERSONAS.find(p => p.id === 'PERSONA-PUNE-OPR')!;
  const phaltanMgr        = MOCK_PERSONAS.find(p => p.id === 'PERSONA-PHALTAN-MGR')!;
  const phaltanOpr        = MOCK_PERSONAS.find(p => p.id === 'PERSONA-PHALTAN-OPR')!;
  const jamshedpurMgr     = MOCK_PERSONAS.find(p => p.id === 'PERSONA-JAMSHEDPUR-MGR')!;
  const jamshedpurOpr     = MOCK_PERSONAS.find(p => p.id === 'PERSONA-JAMSHEDPUR-OPR')!;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = MOCK_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase()) || superAdmin;
    onLogin(matched);
  };

  const handleSelectQuickPersona = (persona: UserPersona) => {
    setSelectedRoleCard(persona.id);
    setEmail(persona.email);
    onLogin(persona);
  };

  const PersonaCard = ({
    persona, accent, icon, badge, badgeBg, sub
  }: {
    persona: UserPersona;
    accent: string;
    icon: React.ReactNode;
    badge: string;
    badgeBg: string;
    sub: string;
  }) => (
    <div
      onClick={() => handleSelectQuickPersona(persona)}
      style={{
        padding: '9px 12px',
        borderRadius: '9px',
        background: '#FFFFFF',
        border: selectedRoleCard === persona.id ? `2px solid ${accent}` : '1px solid #E2E8F0',
        cursor: 'pointer',
        boxShadow: selectedRoleCard === persona.id ? `0 4px 12px ${accent}22` : '0 1px 2px rgba(0,0,0,0.03)',
        transition: 'all 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ fontSize: '0.83rem', fontWeight: 800, color: '#0F172A' }}>{persona.name}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{sub}</div>
          </div>
        </div>
        <span style={{ fontSize: '0.62rem', color: accent, fontWeight: 700, background: badgeBg, padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
          {badge}
        </span>
      </div>
    </div>
  );

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Rings */}
      <div 
        style={{
          position: 'absolute',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(218, 41, 28, 0.16) 0%, transparent 70%)',
          top: '-15%',
          right: '-10%',
          pointerEvents: 'none'
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, transparent 70%)',
          bottom: '-15%',
          left: '-10%',
          pointerEvents: 'none'
        }} 
      />

      <div 
        style={{
          width: '100%',
          maxWidth: '1060px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          zIndex: 10,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Left Panel: Demo Personas Select */}
        <div 
          style={{
            background: '#F8FAFC',
            padding: '2rem 2rem 1.25rem',
            borderRight: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            maxHeight: '90vh'
          }}
        >
          <div>
            {/* Header Brand */}
            <div style={{ marginBottom: '1.25rem' }}>
              <CumminsLogo height={38} showWordmark={true} />
              <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                Packaging Consumption & EU PPWR Compliance Platform
              </div>
            </div>

            {/* Persona Selection Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Demo Users — Select to Launch
              </span>
              <span style={{ fontSize: '0.65rem', color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, border: '1px solid #A7F3D0' }}>
                1-Click Sign In
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

              {/* Super Admin */}
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: '2px' }}>
                Platform Administration
              </div>
              <PersonaCard
                persona={superAdmin}
                accent="#DA291C"
                icon={<Crown size={13} color="#FBBF24" />}
                badge="ALL SITES"
                badgeBg="#FEE2E2"
                sub="Super Admin • All 3 Factories • Full Config Access"
              />

              {/* Pune Factory */}
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: '6px', paddingBottom: '2px', borderTop: '1px solid #E2E8F0' }}>
                🏭 Pune Factory — Approach A (Inventory)
              </div>
              <PersonaCard
                persona={puneMgr}
                accent="#0284C7"
                icon={<Building2 size={13} color="#0284C7" />}
                badge="MANAGER"
                badgeBg="#F0F9FF"
                sub="Factory Manager • Dashboard + Records + Inventory"
              />
              <PersonaCard
                persona={puneOpr}
                accent="#0284C7"
                icon={<Database size={13} color="#0284C7" />}
                badge="DATA ENTRY"
                badgeBg="#F0F9FF"
                sub="Operator • Submit batch deductions only"
              />

              {/* Phaltan Factory */}
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: '6px', paddingBottom: '2px', borderTop: '1px solid #E2E8F0' }}>
                🏭 Phaltan Factory — Approach B (Calculated)
              </div>
              <PersonaCard
                persona={phaltanMgr}
                accent="#7C3AED"
                icon={<Building2 size={13} color="#7C3AED" />}
                badge="MANAGER"
                badgeBg="#FAF5FF"
                sub="Factory Manager • Dashboard + Records + BOM"
              />
              <PersonaCard
                persona={phaltanOpr}
                accent="#7C3AED"
                icon={<Calculator size={13} color="#7C3AED" />}
                badge="DATA ENTRY"
                badgeBg="#FAF5FF"
                sub="Operator • Run BOM calculations only"
              />

              {/* Jamshedpur Factory */}
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: '6px', paddingBottom: '2px', borderTop: '1px solid #E2E8F0' }}>
                🏭 Jamshedpur Factory — Approach C (User Input)
              </div>
              <PersonaCard
                persona={jamshedpurMgr}
                accent="#059669"
                icon={<Building2 size={13} color="#059669" />}
                badge="MANAGER"
                badgeBg="#ECFDF5"
                sub="Factory Manager • Dashboard + Records + Logs"
              />
              <PersonaCard
                persona={jamshedpurOpr}
                accent="#059669"
                icon={<Edit3 size={13} color="#059669" />}
                badge="DATA ENTRY"
                badgeBg="#ECFDF5"
                sub="Operator • Packing station logger only"
              />

            </div>
          </div>

          {/* Plant Deployment Footer */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe2 size={13} color="#0284C7" />
              <span>3 Plants · 6 Factory Users</span>
            </div>
            <span>Enterprise Demo Mode</span>
          </div>
        </div>

        {/* Right Panel: Credentials Form */}
        <div 
          style={{
            padding: '2.5rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: '#FFFFFF'
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DA291C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Packaging Compliance Portal
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
              Sign In to Station
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
              Select a demo user on the left or sign in below:
            </p>
          </div>

          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="email"
                  className="form-input font-mono"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', fontSize: '0.88rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <span style={{ fontSize: '0.72rem', color: '#0284C7', cursor: 'pointer' }}>Reset Key</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="password"
                  className="form-input font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', fontSize: '0.88rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                justifyContent: 'center',
                height: '44px',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                boxShadow: '0 4px 12px rgba(218, 41, 28, 0.25)'
              }}
            >
              <span>Sign In</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Quick Notice */}
          <div style={{ marginTop: '1.75rem', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#DA291C" style={{ flexShrink: 0 }} />
            <span>
              <strong>Note:</strong> Factory user will automatically load their factory's pre-configured approach.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
