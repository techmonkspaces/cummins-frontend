import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Building2, 
  Crown, 
  CheckCircle2, 
  UserPlus, 
  Filter,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import { MOCK_USERS_LIST, MOCK_PERSONAS } from '../../data/mockData';
import { UserPersona } from '../../types';

interface UsersListViewProps {
  onImpersonateUser?: (persona: UserPersona) => void;
}

export const UsersListView: React.FC<UsersListViewProps> = ({ onImpersonateUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Super Admin' | 'Factory User'>('ALL');

  const filteredUsers = MOCK_USERS_LIST.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.factory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ background: '#FEE2E2', color: '#DA291C', padding: '5px', borderRadius: '6px' }}>
              <Users size={20} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
              User Access & Permissions Management
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Role-based enterprise access control: Super Admin holds global authority, while Factory Users are strictly scoped to their assigned plant.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => alert('Add User Modal is a demonstration placeholder. In production, this syncs with Cummins Corporate Microsoft Entra ID.')}
          >
            <UserPlus size={16} />
            <span>Invite User</span>
          </button>
        </div>
      </div>

      {/* Highlights / Summary Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Active Users</span>
            <Crown size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            54 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>Across 3 Sites</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Super Administrators</span>
            <ShieldCheck size={18} color="#DA291C" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DA291C', marginTop: '6px' }}>
            1 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>Global Scope</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Factory Users</span>
            <Building2 size={18} color="#0284C7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284C7', marginTop: '6px' }}>
            53 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>Plant Restricted</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div 
        style={{
          background: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or factory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="#64748B" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Filter Role:</span>
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            style={{ width: '160px', height: '40px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Factory User">Factory User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Name & Email</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Assigned Factory</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Department</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Demo Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const matchingPersona = MOCK_PERSONAS.find(p => p.email.toLowerCase() === user.email.toLowerCase());
              const isSuper = user.role === 'Super Admin';

              return (
                <tr 
                  key={user.id} 
                  style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: isSuper ? '#DA291C' : '#0284C7',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isSuper ? '#FEE2E2' : '#F0F9FF',
                        color: isSuper ? '#DA291C' : '#0284C7',
                        border: isSuper ? '1px solid #FECACA' : '1px solid #BAE6FD'
                      }}
                    >
                      {isSuper ? <Crown size={12} /> : <Building2 size={12} />}
                      {user.role}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span 
                      style={{
                        fontWeight: 600,
                        color: isSuper ? '#059669' : '#0F172A',
                        fontSize: '0.85rem'
                      }}
                    >
                      {user.factory}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#475569' }}>
                    {user.department}
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#059669',
                        background: '#ECFDF5',
                        padding: '2px 8px',
                        borderRadius: '999px'
                      }}
                    >
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {matchingPersona && onImpersonateUser && (
                      <button
                        onClick={() => onImpersonateUser(matchingPersona)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        <span>Login as {user.name.split(' ')[0]}</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
