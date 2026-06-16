import React, { useState, useEffect } from 'react';
import { StatCard, Card } from '../../components/UI/Components';
import { studentsAPI, subjectsAPI, assignmentsAPI, examsAPI, announcementsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, ClipboardList, Calendar, Megaphone, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, subjects: 0, assignments: 0, exams: 0 });
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentsAPI.getAll(), subjectsAPI.getAll(),
      assignmentsAPI.getAll(), examsAPI.getAll(), announcementsAPI.getAll()
    ]).then(([s, sub, a, e, ann]) => {
      setStats({
        students: s.data.length,
        subjects: sub.data.length,
        assignments: a.data.length,
        exams: e.data.length
      });
      setAssignments(a.data.slice(0, 5));
      setAnnouncements(ann.data.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => s === 'Completed' ? '#22c55e' : s === 'Overdue' ? '#ef4444' : '#f59e0b';

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>Welcome back, {user?.name} 👋</h1>
        <p style={{ color: '#64748b', marginTop: 4 }}>Here's what's happening in your academic system</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="Total Students" value={stats.students} icon={Users} color="#6366f1" />
        <StatCard title="Subjects" value={stats.subjects} icon={BookOpen} color="#3b82f6" />
        <StatCard title="Assignments" value={stats.assignments} icon={ClipboardList} color="#f59e0b" />
        <StatCard title="Exams" value={stats.exams} icon={Calendar} color="#22c55e" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Recent Assignments</h2>
          {assignments.length === 0 && <p style={{ color: '#94a3b8' }}>No assignments yet</p>}
          {assignments.map(a => (
            <div key={a.assignment_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.subject_name} · Due {a.due_date}</div>
              </div>
              <span style={{ background: statusColor(a.status) + '20', color: statusColor(a.status), padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{a.status}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Recent Announcements</h2>
          {announcements.length === 0 && <p style={{ color: '#94a3b8' }}>No announcements yet</p>}
          {announcements.map(a => (
            <div key={a.announcement_id} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{a.message?.substring(0, 60)}... · {a.date}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
