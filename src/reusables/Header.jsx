export default function Header({ isDashboard }) {
  return (
    <div className="sticky top-0  z-50 flex justify-between px-4 py-2 bg-blue-800">
      <p className="text-white text-lg font-bold">Glove Manufacturing</p>
      <p className="text-red-500 flex items-center gap-1 text-sm mt-1">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span> Offline
      </p>
    </div>
  );
}
