import React from 'react';

export function StatCard({ title, value, icon: Icon, color = '#6366f1', sub }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ background: color + '20', borderRadius: 10, padding: 12 }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>}
      </div>
    </div>
  );
}

export function Badge({ text, color = '#6366f1' }) {
  return (
    <span style={{
      background: color + '20', color, padding: '2px 10px',
      borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block'
    }}>{text}</span>
  );
}

export function Btn({ onClick, children, variant = 'primary', size = 'md', disabled }) {
  const colors = {
    primary: { bg: '#6366f1', color: '#fff' },
    danger: { bg: '#ef4444', color: '#fff' },
    secondary: { bg: '#f1f5f9', color: '#334155' },
    success: { bg: '#22c55e', color: '#fff' },
  };
  const c = colors[variant];
  const pad = size === 'sm' ? '6px 12px' : '10px 18px';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: c.bg, color: c.color, border: 'none', borderRadius: 8,
      padding: pad, fontSize: size === 'sm' ? 12 : 14, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 6
    }}>{children}</button>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{
        width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
        borderRadius: 8, fontSize: 14, outline: 'none', ...props.style
      }} />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{
        width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
        borderRadius: 8, fontSize: 14, background: '#fff', ...props.style
      }}>{children}</select>
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>}
      <textarea {...props} style={{
        width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
        borderRadius: 8, fontSize: 14, resize: 'vertical', minHeight: 80, ...props.style
      }} />
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', ...style }}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>{title}</h1>
        {subtitle && <p style={{ color: '#64748b', marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
