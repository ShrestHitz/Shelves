import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api';
import Modal from '../../components/UI/Modal';
import { PageHeader, Btn, Input, Select, Card, Badge } from '../../components/UI/Components';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'IT', 'ME', 'CE'];
const empty = { name: '', email: '', password: '', branch: 'CSE', year: 1 };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try { const r = await studentsAPI.getAll(); setStudents(r.data); }
    catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);
  useEffect(() => {
    let f = students;
    if (search) f = f.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
    if (filterBranch) f = f.filter(s => s.branch === filterBranch);
    setFiltered(f);
  }, [students, search, filterBranch]);

  const openAdd = () => { setSelected(null); setForm(empty); setShowModal(true); };
  const openEdit = (s) => { setSelected(s); setForm({ name: s.name, email: s.email, password: '', branch: s.branch, year: s.year }); setShowModal(true); };
  const close = () => { setShowModal(false); setSelected(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selected) { await studentsAPI.update(selected.student_id, form); toast.success('Student updated!'); }
      else { await studentsAPI.create(form); toast.success('Student added!'); }
      fetch(); close();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete ${s.name}?`)) return;
    try { await studentsAPI.delete(s.student_id); toast.success('Student deleted'); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const branchColor = { CSE: '#6366f1', ECE: '#3b82f6', EEE: '#f59e0b', IT: '#22c55e', ME: '#ef4444', CE: '#8b5cf6' };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>;

  return (
    <div>
      <PageHeader title="Students" subtitle={`${filtered.length} students`}
        action={<Btn onClick={openAdd}><Plus size={16} />Add Student</Btn>} />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
              style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
          </div>
          <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, background: '#fff' }}>
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(s => (
          <Card key={s.student_id} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366f1', fontSize: 18 }}>
                {s.name[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Badge text={s.branch} color={branchColor[s.branch] || '#6366f1'} />
              <Badge text={`Year ${s.year}`} color="#64748b" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => openEdit(s)} variant="secondary" size="sm"><Pencil size={14} />Edit</Btn>
              <Btn onClick={() => handleDelete(s)} variant="danger" size="sm"><Trash2 size={14} />Delete</Btn>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <Users size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>No students found</p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={close} title={selected ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSave}>
          <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Enter full name" />
          <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="Enter email" />
          <Input label={selected ? "Password (leave blank to keep)" : "Password *"} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!selected} placeholder="Enter password" />
          <Select label="Branch *" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
          <Select label="Year *" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}>
            {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
          </Select>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Btn onClick={close} variant="secondary" type="button">Cancel</Btn>
            <Btn type="submit" disabled={saving}>{saving ? 'Saving...' : selected ? 'Update Student' : 'Add Student'}</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}
