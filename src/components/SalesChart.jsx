import { useState } from "react"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts"

const FILTERS = [
  { key: "dia",    label: "Diario"   },
  { key: "semana", label: "Semanal"  },
  { key: "mes",    label: "Mensual"  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
        Q{Number(payload[0].value).toLocaleString("es-GT")}
      </p>
    </div>
  )
}

const CustomDot = ({ cx, cy, value }) => {
  if (!value) return null
  return <circle cx={cx} cy={cy} r={5} fill="#fff" stroke="#4f46e5" strokeWidth={2.5} />
}

function allDaysOfMonth(year, month) {
  const days = []
  const total = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= total; d++) days.push(new Date(year, month, d))
  return days
}

function fmtDay(date) {
  return date.toLocaleDateString("es-GT", { day: "numeric", month: "short" })
}

function toDay(data) {
  const ref   = data.length ? new Date(data[0].Fecha) : new Date()
  const year  = ref.getFullYear()
  const month = ref.getMonth()
  const salesMap = {}
  data.forEach((item) => {
    const d   = new Date(item.Fecha)
    const key = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    salesMap[key] = (salesMap[key] || 0) + Number(item.TotalVentas || 0)
  })
  return allDaysOfMonth(year, month).map((date) => {
    const key = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    return { fecha: fmtDay(date), ventas: salesMap[key] ?? 0, tieneVentas: !!salesMap[key] }
  })
}

function toWeek(data) {
  const map = {}
  data.forEach((item) => {
    const date = new Date(item.Fecha)
    const day  = date.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    const mon  = new Date(date)
    mon.setDate(date.getDate() + diff)
    const key = fmtDay(mon)
    if (!map[key]) map[key] = { fecha: key, ventas: 0, tieneVentas: false }
    map[key].ventas     += Number(item.TotalVentas || 0)
    map[key].tieneVentas = true
  })
  return Object.values(map)
}

function toMonth(data) {
  const map = {}
  data.forEach((item) => {
    const key = new Date(item.Fecha).toLocaleDateString("es-GT", { month: "short", year: "numeric" })
    if (!map[key]) map[key] = { fecha: key, ventas: 0, tieneVentas: false }
    map[key].ventas     += Number(item.TotalVentas || 0)
    map[key].tieneVentas = true
  })
  return Object.values(map)
}

function niceYTicks(maxVal, steps = 5) {
  if (maxVal === 0) return [0, 500, 1000, 1500, 2000]
  const raw  = maxVal * 1.25
  const mag  = Math.pow(10, Math.floor(Math.log10(raw / steps)))
  const nice = [1, 2, 2.5, 5, 10].find((n) => n * mag * steps >= raw) ?? 10
  const step = nice * mag
  const top  = Math.ceil(raw / step) * step
  return Array.from({ length: steps + 1 }, (_, i) => Math.round(step * i)).filter(
    (v) => v <= top + step * 0.01
  )
}

function SalesChart({ data = [] }) {
  const [filter, setFilter] = useState("dia")

  const chartData = (() => {
    if (!data.length) return []
    if (filter === "dia")    return toDay(data)
    if (filter === "semana") return toWeek(data)
    if (filter === "mes")    return toMonth(data)
    return []
  })()

  const maxV  = Math.max(...chartData.map((d) => d.ventas), 0)
  const ticks = niceYTicks(maxV)
  const yTop  = ticks[ticks.length - 1]
  const n     = chartData.length
  const xInterval = n <= 7 ? 0 : n <= 15 ? 1 : n <= 31 ? 4 : 6

  return (
    <section className="bg-white rounded-[24px] p-6 mt-5 border border-[#eaecf4]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
            Resumen
          </p>
          <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Ventas</h2>
        </div>

        <div className="flex gap-1 bg-gray-100 border border-[#eaecf4] rounded-xl p-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-lg transition-all duration-150 ${
                filter === key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-gray-400 text-sm">
          No hay ventas en este rango.
        </div>
      ) : (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0}    />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.15)" />

              <XAxis
                dataKey="fecha"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
                dy={8} interval={xInterval}
              />

              <YAxis
                axisLine={false} tickLine={false}
                domain={[0, yTop]} ticks={ticks}
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
                width={52}
                tickFormatter={(v) =>
                  v === 0 ? "Q0" : v >= 1000 ? `Q${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `Q${v}`
                }
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#4f46e5", strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone" dataKey="ventas"
                stroke="#4f46e5" strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={<CustomDot />}
                activeDot={{ r: 7, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2.5 }}
                animationDuration={350}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default SalesChart