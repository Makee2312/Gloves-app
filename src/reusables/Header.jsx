export default function Header() {
  return (
    <div className="">
      <div className="sticky top-0 z-50 flex justify-between px-4 py-2 bg-blue-800">
        <p className="text-white text-lg font-bold">Glove Manufacturing</p>
        <p className="text-red-500 flex items-center gap-1 text-sm mt-1">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span> Offline
        </p>
      </div>
      <div className="px-4 py-1 bg-blue-100">
        <p className="text-gray-500 text-sm">Welcome back</p>
        <h2 className="text-lg font-bold">Test User</h2>
      </div>
    </div>
  );
}
