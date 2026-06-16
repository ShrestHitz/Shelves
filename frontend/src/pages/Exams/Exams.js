import React, { useState, useEffect } from 'react';
import { examsAPI, subjectsAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Input, Select, Card, Badge } from '../../components/UI/Components';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';

const empty = { exam_name: '', exam_date: '', max_marks: 100, subject_id: '' };

export default function Exams() {
  const [items, setItems] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try { const [e, s] = await Promise.all([examsAPI.getAll(), subjectsAPI.getAll()]); setItems(e.data); setSubjects(s.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setSelected(null); setForm({ ...empty, subject_id: subjects[0]?.subject_id || '' }); setShowModal(true); };
  const openEdit = (i) => { setSelected(i); setForm({ exam_name: i.exam_name, exam_date: i.exam_date, max_marks: i.max_marks, subject_id: i.subject_id }); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (selected) { await examsAPI.update(selected.exam_id, form); toast.success('Exam updated!'); }
      else { await examsAPI.create(form); toast.success('Exam added!'); }
      fetchAll(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!window.confirm(`Delete "${i.exam_name}"?`)) return;
    try { await examsAPI.delete(i.exam_id); toast.success('Deleted'); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const isUpcoming = (d) => new Date(d) >= new Date();

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Exams" subtitle={`${items.length} exams`}
        action={<Btn onClick={openAdd}><Plus size={16} />Add Exam</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {items.map(i => (
          <Card key={i.exam_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ background: '#eef2ff', borderRadius: 10, padding: 10 }}>
                <Calendar size={22} color="#6366f1" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{i.exam_name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{i.subject_name}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Badge text={i.exam_date} color="#6366f1" />
              <Badge text={`Max: ${i.max_marks}`} color="#64748b" />
              <Badge text={isUpcoming(i.exam_date) ? 'Upcoming' : 'Past'} color={isUpcoming(i.exam_date) ? '#22c55e' : '#94a3b8'} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => openEdit(i)} variant="secondary" size="sm"><Pencil size={14} />Edit</Btn>
              <Btn onClick={() => handleDelete(i)} variant="danger" size="sm"><Trash2 size={14} />Delete</Btn>
            </div>
          </Card>
        ))}
        {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}><p>No exams yet</p></div>}
      </div>
      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Exam' : 'Add Exam'}>
        <form onSubmit={handleSave}>
          <Input label="Exam Name *" value={form.exam_name} onChange={e => setForm({ ...form, exam_name: e.target.value })} required placeholder="e.g. Mid Semester Exam" />
          <Select label="Subject *" value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} required>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
          </Select>
          <Input label="Exam Date *" type="date" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} required />
          <Input label="Max Marks *" type="number" value={form.max_marks} onChange={e => setForm({ ...form, max_marks: e.target.value })} required min={1} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update' : 'Add Exam'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
