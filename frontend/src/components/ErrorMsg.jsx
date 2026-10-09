export default function ErrorMsg({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
      {message || 'An error occurred. Please try again.'}
    </div>
  );
}
