import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "1 May", ventas: 950 },
  { day: "2 May", ventas: 1250 },
  { day: "3 May", ventas: 800 },
  { day: "4 May", ventas: 1150 },
  { day: "5 May", ventas: 1400 },
  { day: "6 May", ventas: 1300 },
  { day: "7 May", ventas: 950 },
  { day: "8 May", ventas: 600 },
  { day: "9 May", ventas: 550 },
]

function SalesChart() {
  return (
    <div className="bg-white rounded-2xl p-8 mt-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-950">Ventas</h2>

        <select className="border border-slate-200 rounded-xl px-5 py-3 outline-none font-semibold">
          <option>Diario</option>
          <option>Semanal</option>
          <option>Mensual</option>
        </select>
      </div>

      <div className="h- [300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ventasColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis
              tickFormatter={(value) =>
                value === 0 ? "Q0" : value >= 1000 ? `Q${value / 1000}k` : `Q${value}`
              }
            />
            <Tooltip formatter={(value) => [`Q${value}`, "Ventas"]} />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#0b63ff"
              strokeWidth={3}
              fill="url(#ventasColor)"
              dot={{ r: 6, fill: "#0b63ff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SalesChart