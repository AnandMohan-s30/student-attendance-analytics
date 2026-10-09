export function pctColor(pct) {
  if (pct >= 75) return 'text-green-600';
  if (pct >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function pctBadge(pct) {
  if (pct >= 75) return 'bg-green-100 text-green-700';
  if (pct >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

export function pctStatus(pct) {
  if (pct >= 75) return 'Good';
  if (pct >= 60) return 'Warning';
  return 'Critical';
}

export function pctStatusColor(pct) {
  if (pct >= 75) return 'bg-green-100 text-green-800 border border-green-200';
  if (pct >= 60) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
  return 'bg-red-100 text-red-800 border border-red-200';
}
