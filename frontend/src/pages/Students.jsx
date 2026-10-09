import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import { pctBadge } from '../utils/attendance';

const EMPTY = { roll_no: '', name: '', email: '', branch: '', semester: '', section: '' };

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
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
    studentsAPI.getAll()
      .then(r => setStudents(r.data))
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setFormError(''); setShowModal(true); };
  const openEdit = (s) => { setEditing(s.id); setForm({ roll_no: s.roll_no, name: s.name, email: s.email || '', branch: s.branch || '', semester: s.semester || '', section: s.section || '' }); setFormError(''); setShowModal(true); };

  const save = async () => {
    if (!form.roll_no.trim() || !form.name.trim()) { setFormError('Roll number and name are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) await studentsAPI.update(editing, form);
      else await studentsAPI.create(form);
      setShowModal(false);
      load();
    } catch (e) {
      setFormError(e.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const del = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This will also delete their attendance records.`)) return;
    try { await studentsAPI.delete(id); load(); }
    catch { setError('Delete failed'); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
    (s.branch || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Search by name, roll no, branch…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Student</button>
      </div>

      {error && <ErrorMsg message={error} />}
      {loading ? <Spinner /> : (
        filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No students found.</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Sem</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-right">Attendance</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{s.roll_no}</td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.branch}</td>
                    <td className="px-4 py-3">{s.semester}</td>
                    <td className="px-4 py-3">{s.section}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.email}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${pctBadge(s.attendance_percentage)}`}>
                        {s.attendance_percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => navigate(`/students/${s.id}`)} className="text-blue-600 hover:underline text-xs">View</button>
                      <button onClick={() => openEdit(s)} className="text-green-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => del(s.id, s.name)} className="text-red-500 hover:underline text-xs">Delete</button>
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
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Student' : 'Add Student'}</h3>
            {formError && <ErrorMsg message={formError} />}
            <div className="space-y-3 mt-3">
              {[
                { label: 'Roll Number *', key: 'roll_no', type: 'text' },
                { label: 'Full Name *', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Branch', key: 'branch', type: 'text' },
                { label: 'Semester', key: 'semester', type: 'number' },
                { label: 'Section', key: 'section', type: 'text' },
              ].map(({ label, key, type }) => (
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
