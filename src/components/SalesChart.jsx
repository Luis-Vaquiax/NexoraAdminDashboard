import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

function SalesChart({ data = [] }) {
  const chartData = data.map((item) => ({
    fecha: new Date(item.Fecha).toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
    }),
    ventas: Number(item.TotalVentas || 0),
    pedidos: Number(item.TotalPedidos || 0),
  }))

  return (
    <section className="bg-white rounded-2xl p-8 mt-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          Ventas diarias
        </h2>

        <select className="border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold">
          <option>Diario</option>
        </select>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-slate-400">
          No hay ventas registradas en este rango.
        </div>
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="fecha" />

              <YAxis
                tickFormatter={(value) => `Q${value}`}
              />

              <Tooltip
                formatter={(value, name) => [
                  name === "ventas" ? `Q${value}` : value,
                  name === "ventas" ? "Ventas" : "Pedidos",
                ]}
              />

              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default SalesChart