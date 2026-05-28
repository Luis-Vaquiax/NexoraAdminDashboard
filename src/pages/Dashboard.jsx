import { useEffect, useState } from "react"

import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import StatCard from "../components/StatCard"
import SalesChart from "../components/SalesChart"

import {
  FiShoppingCart,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiClipboard,
} from "react-icons/fi"

function Dashboard() {
  const [stats, setStats] = useState({
    ventas: 0,
    pedidos: 0,
    usuarios: 0,
    productos: 0,
    recientes: [],
    ventasDiarias: [],
  })

  const formatMoney = (value) => {
    return `Q${Number(value || 0).toLocaleString("es-GT")}`
  }

  const formatDate = (date) => {
    if (!date) return "Sin fecha"

    return new Date(date).toLocaleString("es-GT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Carga estadísticas generales o filtradas por fechas
  const loadDashboardStats = async (desde = "", hasta = "") => {
    try {
      let url = "http://localhost:4000/api/dashboard/stats"

      if (desde && hasta) {
        url += `?desde=${desde}&hasta=${hasta}`
      }

      const response = await fetch(url)
      const data = await response.json()

      setStats({
        ventas: data.ventas || 0,
        pedidos: data.pedidos || 0,
        usuarios: data.usuarios || 0,
        productos: data.productos || 0,
        recientes: data.recientes || [],
        ventasDiarias: data.ventasDiarias || [],
      })
    } catch (error) {
      console.error("Error cargando dashboard:", error)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  return (
    <div className="flex bg-[#f8faff] min-h-screen text-slate-950">
      <Sidebar />

      <main className="flex-1 px-7 py-7">
        <Topbar
          onFilterDates={({ desde, hasta }) => {
            loadDashboardStats(desde, hasta)
          }}
        />

        <section className="-mt-12">
          <h1 className="text-4xl font-bold">
            ¡Bienvenido, Admin!
          </h1>

          <p className="text-slate-600 text-lg mt-3">
            Aquí tienes un resumen real de tu tienda.
          </p>
        </section>

        <section className="grid grid-cols-4 gap-6 mt-12">
          <StatCard
            title="Ventas totales"
            value={formatMoney(stats.ventas)}
            icon={<FiShoppingCart />}
            color="bg-blue-600"
          />

          <StatCard
            title="Pedidos"
            value={stats.pedidos}
            icon={<FiShoppingBag />}
            color="bg-green-500"
          />

          <StatCard
            title="Usuarios"
            value={stats.usuarios}
            icon={<FiUsers />}
            color="bg-purple-600"
          />

          <StatCard
            title="Productos"
            value={stats.productos}
            icon={<FiBox />}
            color="bg-orange-500"
          />
        </section>

        <SalesChart data={stats.ventasDiarias} />

        <section className="bg-white rounded-2xl p-8 mt-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
              <FiClipboard />
            </div>

            <h2 className="text-2xl font-bold">
              Pedidos recientes
            </h2>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4">Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {stats.recientes.map((pedido) => (
                <tr
                  key={pedido.Id}
                  className="border-b border-slate-200"
                >
                  <td className="py-5 font-bold">
                    #{pedido.Id}
                  </td>

                  <td>
                    {pedido.Name} {pedido.LastName}
                  </td>

                  <td>
                    {formatMoney(pedido.Total)}
                  </td>

                  <td>
                    {formatDate(pedido.FechaPedido)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {stats.recientes.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No hay pedidos registrados en este rango de fechas.
            </p>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => {
                window.location.href = "/pedidos"
              }}
              className="text-blue-600 font-bold"
            >
              Ver todos los pedidos
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard