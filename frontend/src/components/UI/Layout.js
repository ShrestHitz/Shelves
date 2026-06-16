import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  FileText, Calendar, Megaphone, MessageSquare, LogOut, Menu, X, GraduationCap
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/materials', label: 'Materials', icon: FileText },
  { to: '/exams', label: 'Exams', icon: Calendar },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/community', label: 'Community', icon: MessageSquare },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: open ? 240 : 64, background: '#1e1b4b', color: '#fff',
        transition: 'width 0.2s', display: 'flex', flexDirection: 'column',
        flexShrink: 0, overflow: 'hidden'
      }}>
        <div style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #312e81' }}>
          <GraduationCap size={28} color="#a5b4fc" />
          {open && <span style={{ fontWeight: 700, fontSize: 18, color: '#a5b4fc', whiteSpace: 'nowrap' }}>Shelves</span>}
        </div>

        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
              color: isActive ? '#a5b4fc' : '#c7d2fe', textDecoration: 'none',
              background: isActive ? '#312e81' : 'transparent',
              borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
              transition: 'all 0.15s', whiteSpace: 'nowrap'
            })}>
              <Icon size={20} style={{ flexShrink: 0 }} />
              {open && <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid #312e81', padding: 12 }}>
          {open && <div style={{ fontSize: 12, color: '#818cf8', marginBottom: 8, paddingLeft: 4 }}>
            {user?.name} ({user?.role})
          </div>}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '8px 12px', background: 'none', border: 'none', color: '#fca5a5',
            borderRadius: 6, fontSize: 14, cursor: 'pointer'
          }}>
            <LogOut size={18} />
            {open && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16
        }}>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>Academic Management System</h1>
          <div style={{ marginLeft: 'auto', fontSize: 14, color: '#64748b' }}>
            Welcome, <strong>{user?.name}</strong>
          </div>
        </header>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
