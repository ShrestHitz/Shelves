import React, { useState, useEffect } from 'react';
import { materialsAPI, subjectsAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Input, Select, Card, Badge } from '../../components/UI/Components';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';

const empty = { title: '', type: 'PDF', upload_date: new Date().toISOString().split('T')[0], subject_id: '' };
const typeColor = { PDF: '#ef4444', PPT: '#f59e0b', Video: '#3b82f6', Other: '#64748b' };

export default function Materials() {
  const [items, setItems] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try { const [m, s] = await Promise.all([materialsAPI.getAll(), subjectsAPI.getAll()]); setItems(m.data); setSubjects(s.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setSelected(null); setForm({ ...empty, subject_id: subjects[0]?.subject_id || '' }); setShowModal(true); };
  const openEdit = (i) => { setSelected(i); setForm({ title: i.title, type: i.type, upload_date: i.upload_date, subject_id: i.subject_id }); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (selected) { await materialsAPI.update(selected.material_id, form); toast.success('Material updated!'); }
      else { await materialsAPI.create(form); toast.success('Material added!'); }
      fetchAll(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!window.confirm(`Delete "${i.title}"?`)) return;
    try { await materialsAPI.delete(i.material_id); toast.success('Deleted'); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Learning Materials" subtitle={`${items.length} materials`}
        action={<Btn onClick={openAdd}><Plus size={16} />Add Material</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {items.map(i => (
          <Card key={i.material_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ background: (typeColor[i.type] || '#64748b') + '20', borderRadius: 10, padding: 10 }}>
                <FileText size={22} color={typeColor[i.type] || '#64748b'} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{i.title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{i.subject_name}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Badge text={i.type} color={typeColor[i.type] || '#64748b'} />
              <Badge text={i.upload_date} color="#64748b" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => openEdit(i)} variant="secondary" size="sm"><Pencil size={14} />Edit</Btn>
              <Btn onClick={() => handleDelete(i)} variant="danger" size="sm"><Trash2 size={14} />Delete</Btn>
            </div>
          </Card>
        ))}
        {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}><p>No materials yet</p></div>}
      </div>
      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Material' : 'Add Material'}>
        <form onSubmit={handleSave}>
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Material title" />
          <Select label="Type *" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {['PDF', 'PPT', 'Video', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select label="Subject *" value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} required>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
          </Select>
          <Input label="Upload Date" type="date" value={form.upload_date} onChange={e => setForm({ ...form, upload_date: e.target.value })} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update' : 'Add Material'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
