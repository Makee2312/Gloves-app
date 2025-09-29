export default function DashboardUpdates() {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 mt-4">
      <div className="bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-xl p-4 text-center">
        <h3 className="text-2xl font-bold">4</h3>
        <p className="text-xs mt-1">Total batches</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center">
        <h3 className="text-2xl font-bold">1</h3>
        <p className="text-xs mt-1">Completed</p>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-4 text-center">
        <h3 className="text-2xl font-bold">1</h3>
        <p className="text-xs mt-1">Failed</p>
      </div>
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-4 text-center">
        <h3 className="text-2xl font-bold">1</h3>
        <p className="text-xs mt-1">In progress</p>
      </div>
    </div>
  );
}
