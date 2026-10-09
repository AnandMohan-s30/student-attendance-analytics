import { useEffect, useState } from 'react';
import { analyticsAPI, subjectsAPI, studentsAPI } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import { pctBadge, pctStatus } from '../utils/attendance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [subjects, setSubjects] = useState([]);
  const [defaulters, setDefaulters] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ semester: '', section: '', subject_id: '' });

  useEffect(() => {
    subjectsAPI.getAll().then(r => setSubjects(r.data)).catch(() => {});
    Promise.all([
      analyticsAPI.subjectOverview(),
      analyticsAPI.monthly(),
      analyticsAPI.distribution(),
      analyticsAPI.defaulters(),
    ]).then(([subj, mo, dist, def]) => {
      setSubjectData(subj.data);
      setMonthly(mo.data);
      const d = dist.data;
      setDistribution([
        { name: 'Above 90%', value: Number(d.above_90) || 0 },
        { name: '75–90%', value: Number(d.between_75_90) || 0 },
        { name: '60–75%', value: Number(d.between_60_75) || 0 },
        { name: 'Below 60%', value: Number(d.below_60) || 0 },
      ]);
      setDefaulters(def.data);
    }).catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));

    // load all students with percentages
    studentsAPI.getAll().then(r => setAllStudents(r.data)).catch(() => {});
  }, []);

  const applyFilters = () => {
    analyticsAPI.defaulters(filters).then(r => setDefaulters(r.data)).catch(() => {});
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  const ranked = [...allStudents].sort((a, b) => b.attendance_percentage - a.attendance_percentage);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-500">Semester</label>
            <input type="number" placeholder="e.g. 5" value={filters.semester}
              onChange={e => setFilters(f => ({ ...f, semester: e.target.value }))}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Section</label>
            <input type="text" placeholder="e.g. A" value={filters.section}
              onChange={e => setFilters(f => ({ ...f, section: e.target.value }))}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Subject</label>
            <select value={filters.subject_id} onChange={e => setFilters(f => ({ ...f, subject_id: e.target.value }))}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_code}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={applyFilters} className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">Apply</button>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {distribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Subject Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={subjectData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject_code" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="avg_percentage" fill="#7c5cd8" name="Avg %" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Monthly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthly} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Line type="monotone" dataKey="percentage" stroke="#3b82f6" name="Attendance %" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Student ranking */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Student Attendance Ranking</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Roll No</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Branch</th>
                <th className="px-3 py-2">Sem</th>
                <th className="px-3 py-2">Section</th>
                <th className="px-3 py-2 text-right">Attendance</th>
                <th className="px-3 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, i) => (
                <tr key={s.id} className="border-t">
                  <td className="px-3 py-2 text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-3 py-2 font-mono text-xs">{s.roll_no}</td>
                  <td className="px-3 py-2 font-medium">{s.name}</td>
                  <td className="px-3 py-2 text-gray-500">{s.branch}</td>
                  <td className="px-3 py-2">{s.semester}</td>
                  <td className="px-3 py-2">{s.section}</td>
                  <td className="px-3 py-2 text-right"><span className={`px-2 py-0.5 rounded text-xs font-medium ${pctBadge(s.attendance_percentage)}`}>{s.attendance_percentage}%</span></td>
                  <td className="px-3 py-2 text-right text-xs font-medium text-gray-600">{pctStatus(s.attendance_percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defaulters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Defaulters (Below 75%) — {defaulters.length} students</h3>
        {defaulters.length === 0 ? <p className="text-sm text-gray-400">No defaulters for selected filters.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-3 py-2">Roll No</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Branch</th>
                  <th className="px-3 py-2">Section</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Present</th>
                  <th className="px-3 py-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2 font-mono text-xs">{s.roll_no}</td>
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-gray-500">{s.branch}</td>
                    <td className="px-3 py-2">{s.section}</td>
                    <td className="px-3 py-2">{s.total_classes}</td>
                    <td className="px-3 py-2">{s.present}</td>
                    <td className="px-3 py-2 text-right"><span className={`px-2 py-0.5 rounded text-xs font-medium ${pctBadge(s.percentage)}`}>{s.percentage}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
