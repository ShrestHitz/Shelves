import React, { useState, useEffect } from 'react';
import { assignmentsAPI, subjectsAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Input, Select, Card, Badge, Textarea } from '../../components/UI/Components';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';

const empty = { title: '', description: '', due_date: '', status: 'Pending', subject_id: '' };

export default function Assignments() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try {
      const [a, s] = await Promise.all([assignmentsAPI.getAll(), subjectsAPI.getAll()]);
      setItems(a.data); setSubjects(s.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    let f = items;
    if (filterStatus) f = f.filter(i => i.status === filterStatus);
    if (filterSubject) f = f.filter(i => i.subject_id === parseInt(filterSubject));
    setFiltered(f);
  }, [items, filterStatus, filterSubject]);

  const openAdd = () => { setSelected(null); setForm({ ...empty, subject_id: subjects[0]?.subject_id || '' }); setShowModal(true); };
  const openEdit = (i) => { setSelected(i); setForm({ title: i.title, description: i.description || '', due_date: i.due_date, status: i.status, subject_id: i.subject_id }); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (selected) { await assignmentsAPI.update(selected.assignment_id, form); toast.success('Assignment updated!'); }
      else { await assignmentsAPI.create(form); toast.success('Assignment added!'); }
      fetchAll(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!window.confirm(`Delete "${i.title}"?`)) return;
    try { await assignmentsAPI.delete(i.assignment_id); toast.success('Deleted'); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const statusColor = { Completed: '#22c55e', Pending: '#f59e0b', Overdue: '#ef4444' };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Assignments" subtitle={`${filtered.length} assignments`}
        action={<Btn onClick={openAdd}><Plus size={16} />Add Assignment</Btn>} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(i => (
          <Card key={i.assignment_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>{i.title}</h3>
              <Badge text={i.status} color={statusColor[i.status] || '#64748b'} />
            </div>
            {i.description && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{i.description}</p>}
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
              📚 {i.subject_name} · 📅 Due: {i.due_date}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => openEdit(i)} variant="secondary" size="sm"><Pencil size={14} />Edit</Btn>
              <Btn onClick={() => handleDelete(i)} variant="danger" size="sm"><Trash2 size={14} />Delete</Btn>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}><ClipboardList size={48} style={{ opacity: 0.3, marginBottom: 8 }} /><p>No assignments found</p></div>}
      </div>

      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Assignment' : 'Add Assignment'}>
        <form onSubmit={handleSave}>
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Assignment title" />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Assignment details" />
          <Select label="Subject *" value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} required>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
          </Select>
          <Input label="Due Date *" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} required />
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </Select>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update' : 'Add Assignment'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
