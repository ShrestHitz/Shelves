import React, { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Input, Textarea, Card, Badge } from '../../components/UI/Components';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react';

const empty = { title: '', message: '', date: new Date().toISOString().split('T')[0] };

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try { const r = await announcementsAPI.getAll(); setItems(r.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setSelected(null); setForm(empty); setShowModal(true); };
  const openEdit = (i) => { setSelected(i); setForm({ title: i.title, message: i.message, date: i.date }); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (selected) { await announcementsAPI.update(selected.announcement_id, form); toast.success('Announcement updated!'); }
      else { await announcementsAPI.create(form); toast.success('Announcement added!'); }
      fetchAll(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!window.confirm(`Delete "${i.title}"?`)) return;
    try { await announcementsAPI.delete(i.announcement_id); toast.success('Deleted'); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Announcements" subtitle={`${items.length} announcements`}
        action={<Btn onClick={openAdd}><Plus size={16} />Add Announcement</Btn>} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(i => (
          <Card key={i.announcement_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
                <div style={{ background: '#fef3c7', borderRadius: 10, padding: 10, flexShrink: 0 }}>
                  <Megaphone size={22} color="#f59e0b" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{i.title}</div>
                  <div style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>{i.message}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    📅 {i.date} {i.admin_name && `· Posted by ${i.admin_name}`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 16, flexShrink: 0 }}>
                <Btn onClick={() => openEdit(i)} variant="secondary" size="sm"><Pencil size={14} />Edit</Btn>
                <Btn onClick={() => handleDelete(i)} variant="danger" size="sm"><Trash2 size={14} />Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <Megaphone size={48} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No announcements yet</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Announcement' : 'New Announcement'}>
        <form onSubmit={handleSave}>
          <Input label="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Announcement title" />
          <Textarea label="Message *" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required placeholder="Announcement content" style={{ minHeight: 120 }} />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update' : 'Post Announcement'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
