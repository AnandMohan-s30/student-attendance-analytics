import { useEffect, useState } from 'react';
import { studentsAPI, subjectsAPI, attendanceAPI } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';

const today = () => new Date().toISOString().split('T')[0];

export default function Attendance() {
  const [tab, setTab] = useState('mark'); // 'mark' | 'history'
  // Mark attendance state
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selSubject, setSelSubject] = useState('');
  const [selDate, setSelDate] = useState(today());
  const [statusMap, setStatusMap] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');
  // History state
  const [history, setHistory] = useState([]);
  const [histDate, setHistDate] = useState('');
  const [histSubject, setHistSubject] = useState('');
  const [histStudent, setHistStudent] = useState('');
  const [loadingHist, setLoadingHist] = useState(false);
  const [histError, setHistError] = useState('');

  useEffect(() => {
    subjectsAPI.getAll().then(r => setSubjects(r.data)).catch(() => {});
    studentsAPI.getAll().then(r => setStudents(r.data)).catch(() => {});
  }, []);

  // When subject+date changes, load existing attendance to pre-fill
  useEffect(() => {
    if (!selSubject || !selDate) return;
    setLoadingStudents(true);
    attendanceAPI.getAll({ subject_id: selSubject, date: selDate })
      .then(r => {
        const map = {};
        // default all to Present
        students.forEach(s => { map[s.id] = 'Present'; });
        // override with saved
        r.data.forEach(a => { map[a.student_id] = a.status; });
        setStatusMap(map);
      })
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, [selSubject, selDate, students.length]);

  const markAll = (status) => {
    const map = {};
    students.forEach(s => { map[s.id] = status; });
    setStatusMap(map);
  };

  const saveAttendance = async () => {
    if (!selSubject || !selDate) { setSaveErr('Please select subject and date'); return; }
    setSaving(true); setSaveMsg(''); setSaveErr('');
    const records = students.map(s => ({
      student_id: s.id,
      subject_id: selSubject,
      attendance_date: selDate,
      status: statusMap[s.id] || 'Present',
    }));
    try {
      await attendanceAPI.create(records);
      setSaveMsg('Attendance saved successfully!');
    } catch (e) {
      setSaveErr(e.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const loadHistory = () => {
    setLoadingHist(true); setHistError('');
    const params = {};
    if (histDate) params.date = histDate;
    if (histSubject) params.subject_id = histSubject;
    if (histStudent) params.student_id = histStudent;
    attendanceAPI.getAll(params)
      .then(r => setHistory(r.data))
      .catch(() => setHistError('Failed to load history'))
      .finally(() => setLoadingHist(false));
  };

  useEffect(() => { if (tab === 'history') loadHistory(); }, [tab]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['mark', 'history'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'mark' ? 'Mark Attendance' : 'Attendance History'}
          </button>
        ))}
      </div>

      {tab === 'mark' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Date</label>
                <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Subject</label>
                <select value={selSubject} onChange={e => setSelSubject(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_code} – {s.subject_name}</option>)}
                </select>
              </div>
            </div>

            {selSubject && selDate && (
              <>
                <div className="flex gap-3 mb-4">
                  <button onClick={() => markAll('Present')} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200">Mark All Present</button>
                  <button onClick={() => markAll('Absent')} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200">Mark All Absent</button>
                </div>
                {loadingStudents ? <Spinner /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-gray-500">
                          <th className="px-4 py-2">Roll No</th>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Branch</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(s => (
                          <tr key={s.id} className="border-t">
                            <td className="px-4 py-2 font-mono text-xs">{s.roll_no}</td>
                            <td className="px-4 py-2 font-medium">{s.name}</td>
                            <td className="px-4 py-2 text-gray-500">{s.branch}</td>
                            <td className="px-4 py-2">
                              <div className="flex gap-3">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="radio" name={`status-${s.id}`} value="Present" checked={statusMap[s.id] === 'Present'} onChange={() => setStatusMap(m => ({ ...m, [s.id]: 'Present' }))} className="accent-green-600" />
                                  <span className="text-green-700 text-xs font-medium">Present</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="radio" name={`status-${s.id}`} value="Absent" checked={statusMap[s.id] === 'Absent'} onChange={() => setStatusMap(m => ({ ...m, [s.id]: 'Absent' }))} className="accent-red-600" />
                                  <span className="text-red-600 text-xs font-medium">Absent</span>
                                </label>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {saveMsg && <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">{saveMsg}</div>}
                {saveErr && <ErrorMsg message={saveErr} />}
                <div className="mt-4">
                  <button onClick={saveAttendance} disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                    {saving ? 'Saving…' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Date</label>
                <input type="date" value={histDate} onChange={e => setHistDate(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Subject</label>
                <select value={histSubject} onChange={e => setHistSubject(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_code}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Student</label>
                <select value={histStudent} onChange={e => setHistStudent(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">All Students</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={loadHistory} className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Filter</button>
              </div>
            </div>

            {histError && <ErrorMsg message={histError} />}
            {loadingHist ? <Spinner /> : (
              history.length === 0 ? <p className="text-center text-gray-400 py-8">No records found.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-500">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Roll No</th>
                        <th className="px-4 py-2">Student</th>
                        <th className="px-4 py-2">Subject</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(a => (
                        <tr key={a.id} className="border-t">
                          <td className="px-4 py-2 text-gray-500">{a.attendance_date?.split('T')[0] || a.attendance_date}</td>
                          <td className="px-4 py-2 font-mono text-xs">{a.roll_no}</td>
                          <td className="px-4 py-2 font-medium">{a.student_name}</td>
                          <td className="px-4 py-2 text-gray-500">{a.subject_code}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
