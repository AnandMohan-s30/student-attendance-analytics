import { useEffect, useState } from 'react';
import { subjectsAPI } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';

const EMPTY = { subject_code: '', subject_name: '', semester: '', faculty_name: '' };

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    subjectsAPI.getAll()
      .then(r => setSubjects(r.data))
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFormError(''); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s.id);
    setForm({ subject_code: s.subject_code, subject_name: s.subject_name, semester: s.semester || '', faculty_name: s.faculty_name || '' });
    setFormError(''); setShowModal(true);
  };

  const save = async () => {
    if (!form.subject_code.trim() || !form.subject_name.trim()) { setFormError('Subject code and name are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) await subjectsAPI.update(editing, form);
      else await subjectsAPI.create(form);
      setShowModal(false); load();
    } catch (e) {
      setFormError(e.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const del = async (id, name) => {
    if (!window.confirm(`Delete subject "${name}"?`)) return;
    try { await subjectsAPI.delete(id); load(); }
    catch { setError('Delete failed'); }
  };

  const filtered = subjects.filter(s =>
    s.subject_name.toLowerCase().includes(search.toLowerCase()) ||
    s.subject_code.toLowerCase().includes(search.toLowerCase()) ||
    (s.faculty_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search subjects…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Subject</button>
      </div>

      {error && <ErrorMsg message={error} />}
      {loading ? <Spinner /> : (
        filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No subjects found.</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Faculty</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{s.subject_code}</td>
                    <td className="px-4 py-3 font-medium">{s.subject_name}</td>
                    <td className="px-4 py-3">{s.semester}</td>
                    <td className="px-4 py-3 text-gray-500">{s.faculty_name}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(s)} className="text-green-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => del(s.id, s.subject_name)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Subject' : 'Add Subject'}</h3>
            {formError && <ErrorMsg message={formError} />}
            <div className="space-y-3 mt-3">
              {[
                { label: 'Subject Code *', key: 'subject_code' },
                { label: 'Subject Name *', key: 'subject_name' },
                { label: 'Semester', key: 'semester', type: 'number' },
                { label: 'Faculty Name', key: 'faculty_name' },
              ].map(({ label, key, type = 'text' }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 font-medium">{label}</label>
                  <input
                    type={type}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
