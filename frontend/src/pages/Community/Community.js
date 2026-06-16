import React, { useState, useEffect } from 'react';
import { communityAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Textarea, Card } from '../../components/UI/Components';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try { const r = await communityAPI.getAll(); setItems(r.data); }
    catch { toast.error('Failed to load posts'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setSelected(null); setContent(''); setShowModal(true); };
  const openEdit = (i) => { setSelected(i); setContent(i.content); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); setContent(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error('Content cannot be empty');
    setSaving(true);
    try {
      if (selected) {
        await communityAPI.update(selected.post_id, { content });
        toast.success('Post updated!');
      } else {
        await communityAPI.create({ content, student_id: user?.id || null });
        toast.success('Post added!');
      }
      fetchAll(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!window.confirm('Delete this post?')) return;
    try { await communityAPI.delete(i.post_id); toast.success('Post deleted'); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Community" subtitle={`${items.length} posts`}
        action={<Btn onClick={openAdd}><Plus size={16} />New Post</Btn>} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(i => (
          <Card key={i.post_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: '#eef2ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#6366f1', fontSize: 16, flexShrink: 0
                }}>
                  {(i.student_name || 'A')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#6366f1', marginBottom: 4 }}>
                    {i.student_name || 'Anonymous'}
                  </div>
                  <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{i.content}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>📅 {i.post_date}</div>
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
            <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No posts yet. Start the conversation!</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Post' : 'New Community Post'}>
        <form onSubmit={handleSave}>
          <Textarea
            label="What's on your mind? *"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            placeholder="Share something with your community..."
            style={{ minHeight: 140 }}
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update Post' : 'Post'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
