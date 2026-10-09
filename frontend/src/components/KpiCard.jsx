export default function KpiCard({ label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'border-l-blue-500 bg-white',
    green: 'border-l-green-500 bg-white',
    yellow: 'border-l-yellow-500 bg-white',
    red: 'border-l-red-500 bg-white',
  };
  return (
    <div className={`rounded-lg border-l-4 shadow-sm p-5 ${colors[color]}`}>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
