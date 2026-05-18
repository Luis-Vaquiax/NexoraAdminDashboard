function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-8 h- [155px] flex items-center gap-7 shadow-sm border border-slate-100">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl ${color}`}>
        {icon}
      </div>

      <div>
        <p className="text-slate-600 font-medium text-lg">{title}</p>
        <h2 className="text-3xl font-bold text-slate-950 mt-2">{value}</h2>
      </div>
    </div>
  )
}

export default StatCard