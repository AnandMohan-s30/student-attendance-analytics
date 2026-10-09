import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMsg from '../components/ErrorMsg';
import { pctBadge, pctStatusColor, pctStatus } from '../utils/attendance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsAPI.student(id)
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load student data'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMsg message={error} />;

  const { student, overall, subjectWise, monthly, history } = data;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/students')} className="text-blue-600 text-sm hover:underline">← Back to Students</button>

      {/* Student Info */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{student.roll_no} · {student.branch} · Sem {student.semester} · Sec {student.section}</p>
            {student.email && <p className="text-sm text-gray-400 mt-0.5">{student.email}</p>}
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${pctStatusColor(overall?.percentage || 0)}`}>
            {pctStatus(overall?.percentage || 0)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: 'Overall %', value: `${overall?.percentage || 0}%` },
            { label: 'Total Classes', value: overall?.total || 0 },
            { label: 'Present', value: overall?.present || 0 },
            { label: 'Absent', value: overall?.absent || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject wise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Subject-wise Attendance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectWise} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject_code" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percentage" fill="#3b82f6" name="%" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} name="%" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Subject Details</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Present</th>
              <th className="px-3 py-2">Absent</th>
              <th className="px-3 py-2 text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {subjectWise.map(s => (
              <tr key={s.subject_id} className="border-t">
                <td className="px-3 py-2 font-medium">{s.subject_name} <span className="text-xs text-gray-400">({s.subject_code})</span></td>
                <td className="px-3 py-2">{s.total_classes}</td>
                <td className="px-3 py-2 text-green-600">{s.present}</td>
                <td className="px-3 py-2 text-red-500">{s.absent}</td>
                <td className="px-3 py-2 text-right"><span className={`px-2 py-0.5 rounded text-xs font-medium ${pctBadge(s.percentage)}`}>{s.percentage}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Recent Attendance History</h3>
        {history.length === 0 ? <p className="text-sm text-gray-400">No attendance records.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} className="border-t">
                    <td className="px-3 py-2 text-gray-500">{h.attendance_date?.split('T')[0] || h.attendance_date}</td>
                    <td className="px-3 py-2">{h.subject_name} <span className="text-xs text-gray-400">({h.subject_code})</span></td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${h.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {h.status}
                      </span>
                    </td>
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
