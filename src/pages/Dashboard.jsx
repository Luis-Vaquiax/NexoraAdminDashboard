import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import StatCard from "../components/StatCard"
import SalesChart from "../components/SalesChart"
import {
  FiShoppingCart, FiShoppingBag, FiUsers,
  FiBox, FiClipboard, FiArrowRight,
} from "react-icons/fi"

function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    ventas: 0,
    pedidos: 0,
    usuarios: 0,
    productos: 0,
    recientes: [],
    ventasDiarias: [],
  })

  const formatMoney = (value) =>
    `Q${Number(value || 0).toLocaleString("es-GT")}`

  const formatDate = (date) => {
    if (!date) return "Sin fecha"
    return new Date(date).toLocaleString("es-GT", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  const loadDashboardStats = async (desde = "", hasta = "") => {
    try {
      let url = "http://localhost:4000/api/dashboard/stats"
      if (desde && hasta) url += `?desde=${desde}&hasta=${hasta}`
      const response = await fetch(url)
      const data = await response.json()
      setStats({
        ventas:        data.ventas        || 0,
        pedidos:       data.pedidos       || 0,
        usuarios:      data.usuarios      || 0,
        productos:     data.productos     || 0,
        recientes:     data.recientes     || [],
        ventasDiarias: data.ventasDiarias || [],
      })
    } catch (error) {
      console.error("Error cargando dashboard:", error)
    }
  }

  useEffect(() => { loadDashboardStats() }, [])

  return (
    <div className="flex bg-[#f1f5fb] min-h-screen">
      <Sidebar />

      <main className="flex-1 px-8 py-7">
        <Topbar
          onFilterDates={({ desde, hasta }) => loadDashboardStats(desde, hasta)}
        />

        {/* ── Welcome ── */}
        <section className="mt-8 mb-7">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Panel principal
          </p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            ¡Bienvenido, Admin!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Aquí tienes un resumen real de tu tienda.
          </p>
        </section>

        {/* ── Stat cards ── */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Ventas: suma pedidos online + ventas físicas (viene del backend) */}
          <div onClick={() => navigate("/ventas")} className="cursor-pointer">
            <StatCard
              title="Ventas totales"
              value={formatMoney(stats.ventas)}
              icon={<FiShoppingCart />}
              color="bg-indigo-600 text-white"
            />
          </div>

          <div onClick={() => navigate("/pedidos")} className="cursor-pointer">
            <StatCard
              title="Pedidos"
              value={stats.pedidos}
              icon={<FiShoppingBag />}
              color="bg-green-500 text-white"
            />
          </div>

          <div onClick={() => navigate("/usuarios")} className="cursor-pointer">
            <StatCard
              title="Usuarios"
              value={stats.usuarios}
              icon={<FiUsers />}
              color="bg-violet-500 text-white"
            />
          </div>

          <div onClick={() => navigate("/productos")} className="cursor-pointer">
            <StatCard
              title="Productos"
              value={stats.productos}
              icon={<FiBox />}
              color="bg-orange-400 text-white"
            />
          </div>
        </section>

        {/* ── Chart ── */}
        <SalesChart data={stats.ventasDiarias} />

        {/* ── Recent orders ── */}
        <section className="bg-white rounded-[24px] p-6 mt-5 border border-[#eaecf4]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
                <FiClipboard />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                  Actividad
                </p>
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight leading-tight">
                  Pedidos recientes
                </h2>
              </div>
            </div>
            <button
              onClick={() => navigate("/pedidos")}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Ver todos <FiArrowRight size={13} />
            </button>
          </div>

          {stats.recientes.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              No hay pedidos en este rango de fechas.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Pedido", "Cliente", "Total", "Fecha"].map((h) => (
                    <th key={h} className="pb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recientes.map((pedido) => (
                  <tr key={pedido.Id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 text-sm font-bold text-indigo-600">#{pedido.Id}</td>
                    <td className="py-4 text-sm text-gray-700 font-medium">{pedido.Name} {pedido.LastName}</td>
                    <td className="py-4 text-sm font-bold text-gray-900">{formatMoney(pedido.Total)}</td>
                    <td className="py-4 text-[12px] text-gray-400">{formatDate(pedido.FechaPedido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard