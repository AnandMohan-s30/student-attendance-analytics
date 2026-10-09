import { useLocation } from 'react-router-dom';

const titles = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/subjects': 'Subjects',
  '/attendance': 'Attendance',
  '/analytics': 'Analytics',
};

export default function Header() {
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const title = titles[base] || 'Student Details';
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </header>
  );
}
