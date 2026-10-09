import { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import KpiCard from '../components/KpiCard';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import { pctBadge, pctStatus } from '../utils/attendance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [topBottom, setTopBottom] = useState({ top5: [], bottom5: [] });
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      analyticsAPI.overview(),
      analyticsAPI.distribution(),
      analyticsAPI.subjectOverview(),
      analyticsAPI.monthly(),
      analyticsAPI.topBottom(),
      analyticsAPI.defaulters(),
    ])
      .then(([ov, dist, subj, mo, tb, def]) => {
        setOverview(ov.data);
        const d = dist.data;
        setDistribution([
          { name: 'Above 90%', value: Number(d.above_90) || 0 },
          { name: '75–90%', value: Number(d.between_75_90) || 0 },
          { name: '60–75%', value: Number(d.between_60_75) || 0 },
          { name: 'Below 60%', value: Number(d.below_60) || 0 },
        ]);
        setSubjects(subj.data);
        setMonthly(mo.data);
        setTopBottom(tb.data);
        setDefaulters(def.data);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Students" value={overview?.total_students ?? 0} color="blue" />
        <KpiCard label="Total Subjects" value={overview?.total_subjects ?? 0} color="blue" />
        <KpiCard label="Average Attendance" value={`${overview?.avg_attendance ?? 0}%`} color="green" />
        <KpiCard label="Students Below 75%" value={overview?.below_75 ?? 0} color="red" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribution Pie */}
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

        {/* Subject wise */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Subject-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={subjects} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject_code" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="avg_percentage" fill="#3b82f6" name="Avg %" radius={[3, 3, 0, 0]} />
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

      {/* Top/Bottom 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Top 5 Students</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Name</th><th className="pb-2">Branch</th><th className="pb-2 text-right">%</th></tr></thead>
            <tbody>
              {topBottom.top5.map(s => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{s.name}</td>
                  <td className="py-2 text-gray-500">{s.branch}</td>
                  <td className="py-2 text-right"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{s.percentage}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Bottom 5 Students</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Name</th><th className="pb-2">Branch</th><th className="pb-2 text-right">%</th></tr></thead>
            <tbody>
              {topBottom.bottom5.map(s => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{s.name}</td>
                  <td className="py-2 text-gray-500">{s.branch}</td>
                  <td className="py-2 text-right"><span className={`px-2 py-0.5 rounded text-xs font-medium ${pctBadge(s.percentage)}`}>{s.percentage}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defaulters table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Students Below 75% Attendance</h3>
        {defaulters.length === 0 ? (
          <p className="text-sm text-gray-400">No defaulters found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-3 py-2">Roll No</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Branch</th>
                  <th className="px-3 py-2">Semester</th>
                  <th className="px-3 py-2">Section</th>
                  <th className="px-3 py-2 text-right">Attendance</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2 font-mono text-xs">{s.roll_no}</td>
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-gray-500">{s.branch}</td>
                    <td className="px-3 py-2">{s.semester}</td>
                    <td className="px-3 py-2">{s.section}</td>
                    <td className="px-3 py-2 text-right"><span className={`px-2 py-0.5 rounded text-xs font-medium ${pctBadge(s.percentage)}`}>{s.percentage}%</span></td>
                    <td className="px-3 py-2 text-right text-xs font-medium">{pctStatus(s.percentage)}</td>
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
