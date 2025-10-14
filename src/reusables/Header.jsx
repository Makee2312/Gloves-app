import glove from "../glove_192.jpg";
export default function Header({ isDashboard }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 shadow-md">
      {/* Left: App Title */}
      <div className="flex items-center gap-2">
        <img
          src={glove}
          alt="Logo"
          className="w-8 h-8 rounded-full border border-white/40"
        />
        <h1 className="text-white text-lg sm:text-xl font-semibold tracking-wide">
          Glove Manufacturing
        </h1>
      </div>

      {/* Right: Status + Optional Profile */}
      <div className="flex items-center gap-4">
        {/* Network status */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-red-200 font-medium">Offline</span>
        </div>

        {/* Optional: User info (visible on dashboard only) */}
        {isDashboard && (
          <div className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
            <img src={glove} alt="User" className="w-7 h-7 rounded-full" />
            <span>Test User</span>
          </div>
        )}
      </div>
    </header>
  );
}
