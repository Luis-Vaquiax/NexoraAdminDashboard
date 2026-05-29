function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-[20px] p-6 flex items-center gap-5 border border-[#eaecf4] hover:shadow-[0_8px_32px_rgba(79,70,229,0.08)] transition-all duration-200">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">{value}</h2>
      </div>
    </div>
  )
}

export default StatCard