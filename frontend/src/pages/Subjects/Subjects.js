import React, { useState, useEffect } from 'react';
import { subjectsAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Input, Select, Card, Badge } from '../../components/UI/Components';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';

const empty = { subject_name: '', semester: 1, credits: 3 };

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try { const r = await subjectsAPI.getAll(); setSubjects(r.data); }
    catch { toast.error('Failed to load subjects'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setSelected(null); setForm(empty); setShowModal(true); };
  const openEdit = (s) => { setSelected(s); setForm({ subject_name: s.subject_name, semester: s.semester, credits: s.credits }); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (selected) { await subjectsAPI.update(selected.subject_id, form); toast.success('Subject updated!'); }
      else { await subjectsAPI.create(form); toast.success('Subject added!'); }
      fetch(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete "${s.subject_name}"? This will fail if it has assignments.`)) return;
    try { await subjectsAPI.delete(s.subject_id); toast.success('Subject deleted'); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const semColor = (sem) => ['#6366f1','#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#84cc16'][sem % 8];

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Subjects" subtitle={`${subjects.length} subjects`}
        action={<Btn onClick={openAdd}><Plus size={16} />Add Subject</Btn>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {subjects.map(s => (
          <Card key={s.subject_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ background: semColor(s.semester) + '20', borderRadius: 10, padding: 10 }}>
                <BookOpen size={22} color={semColor(s.semester)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.subject_name}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Badge text={`Sem ${s.semester}`} color={semColor(s.semester)} />
              <Badge text={`${s.credits} Credits`} color="#64748b" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => openEdit(s)} variant="secondary" size="sm"><Pencil size={14} />Edit</Btn>
              <Btn onClick={() => handleDelete(s)} variant="danger" size="sm"><Trash2 size={14} />Delete</Btn>
            </div>
          </Card>
        ))}
        {subjects.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}><p>No subjects yet</p></div>}
      </div>

      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSave}>
          <Input label="Subject Name *" value={form.subject_name} onChange={e => setForm({ ...form, subject_name: e.target.value })} required placeholder="e.g. Data Structures" />
          <Select label="Semester *" value={form.semester} onChange={e => setForm({ ...form, semester: parseInt(e.target.value) })}>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </Select>
          <Select label="Credits *" value={form.credits} onChange={e => setForm({ ...form, credits: parseInt(e.target.value) })}>
            {[1,2,3,4,5].map(c => <option key={c} value={c}>{c} Credits</option>)}
          </Select>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update Subject' : 'Add Subject'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
