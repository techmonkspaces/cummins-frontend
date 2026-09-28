import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { CumminsLogo } from '../layout/CumminsLogo';
import { UserPersona } from '../../types';
import { MOCK_PERSONAS } from '../../data/mockData';

interface LoginViewProps {
  onLogin: (persona: UserPersona) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('PERSONA-ADMIN');
  const [email, setEmail] = useState('admin@cummins.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const personaId = e.target.value;
    setSelectedPersonaId(personaId);
    const found = MOCK_PERSONAS.find(p => p.id === personaId);
    if (found) {
      setEmail(found.email);
      setPassword('••••••••••••');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = MOCK_PERSONAS.find(p => p.email.toLowerCase() === email.toLowerCase())
      || MOCK_PERSONAS.find(p => p.id === selectedPersonaId)
      || MOCK_PERSONAS[0];
    onLogin(matched);
  };

  const handleQuickLaunch = () => {
    const matched = MOCK_PERSONAS.find(p => p.id === selectedPersonaId) || MOCK_PERSONAS[0];
    onLogin(matched);
  };

  return (
    <div className="login-page-container">
      {/* Background Accent Gradients */}
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      {/* Main Centered Minimalist Login Card */}
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <CumminsLogo height={40} showWordmark={true} />
          <div className="login-app-badge">EU PPWR Compliance Station</div>
          <h1 className="login-title">Sign In to Station</h1>
          <p className="login-subtitle">
            Enter your credentials or select a demo preset to explore.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@cummins.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Password</label>
              <span className="form-link-muted">Reset Key</span>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                className="form-input font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-submit-btn"
          >
            <span>Sign In</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>Demo Preset Selection</span>
        </div>

        {/* Demo Preset Dropdown Section */}
        <div className="demo-preset-box">
          <div className="demo-preset-header">
            <span className="demo-preset-title">
              <Sparkles size={14} className="text-red" />
              <span>Select Demo Persona:</span>
            </span>
          </div>

          <div className="demo-preset-controls">
            <select
              className="form-select demo-select"
              value={selectedPersonaId}
              onChange={handleDropdownChange}
            >
              <optgroup label="Platform Administration">
                <option value="PERSONA-ADMIN">Admin User (Super Admin — All Sites)</option>
              </optgroup>
              <optgroup label="Pune Plant (Approach A — Inventory)">
                <option value="PERSONA-PUNE-MGR">Rahul Sharma (Pune Factory Manager)</option>
                <option value="PERSONA-PUNE-OPR">Priya Desai (Pune Data Entry Operator)</option>
              </optgroup>
              <optgroup label="Phaltan Plant (Approach B — Calculated)">
                <option value="PERSONA-PHALTAN-MGR">Amit Kumar (Phaltan Factory Manager)</option>
                <option value="PERSONA-PHALTAN-OPR">Sneha Patil (Phaltan Data Entry Operator)</option>
              </optgroup>
              <optgroup label="Jamshedpur Plant (Approach C — User Input)">
                <option value="PERSONA-JAMSHEDPUR-MGR">Vikas Singh (Jamshedpur Factory Manager)</option>
                <option value="PERSONA-JAMSHEDPUR-OPR">Deepak Verma (Jamshedpur Data Entry Operator)</option>
              </optgroup>
            </select>


          </div>


        </div>


      </div>
    </div>
  );
};
