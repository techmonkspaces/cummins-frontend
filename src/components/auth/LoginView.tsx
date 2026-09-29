import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles
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

  return (
    <div className="login-page-container">
      {/* Main Centered Minimalist Login Card */}
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <CumminsLogo height={34} showWordmark={true} />
          <div className="login-app-badge">EU PPWR Packaging Compliance Station</div>
          <h1 className="login-title">Sign In to Station</h1>
          <p className="login-subtitle">
            Select your role to access plant packaging records and analytics
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={15} className="input-icon" />
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
              <span className="form-link-muted">Demo Access</span>
            </div>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
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
            className="btn btn-primary btn-md login-submit-btn"
          >
            <span>Enter Station</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo Preset Dropdown Section — Placed Below the Sign In Button */}
        <div className="demo-preset-box">
          <div className="demo-preset-title">
            <Sparkles size={13} className="text-red" />
            <span>Choose Your Role & Location:</span>
          </div>

          <select
            className="form-select demo-select"
            value={selectedPersonaId}
            onChange={handleDropdownChange}
          >
            {MOCK_PERSONAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.dropdownLabel || p.name}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
