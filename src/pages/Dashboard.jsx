import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import StatCard from "../components/StatCard"
import SalesChart from "../components/SalesChart"
import { FiShoppingCart, FiShoppingBag, FiUsers, FiBox, FiClipboard } from "react-icons/fi"

function Dashboard() {
  return (
    <div className="flex bg-[#f8faff] min-h-screen text-slate-950">
      <Sidebar />

      <main className="flex-1 px-7 py-7">
        <Topbar />

        <section className="-mt-12">
          <h1 className="text-4xl font-bold">¡Bienvenido, Admin! 👋</h1>
          <p className="text-slate-600 text-lg mt-3">
            Aquí tienes un resumen de tu tienda.
          </p>
        </section>

        <section className="grid grid-cols-4 gap-6 mt-12">
          <StatCard title="Ventas totales" value="Q8,950" icon={<FiShoppingCart />} color="bg-blue-600" />
          <StatCard title="Pedidos" value="9" icon={<FiShoppingBag />} color="bg-green-500" />
          <StatCard title="Clientes" value="9" icon={<FiUsers />} color="bg-purple-600" />
          <StatCard title="Productos" value="56" icon={<FiBox />} color="bg-orange-500" />
        </section>

        <SalesChart />

        <section className="bg-white rounded-2xl p-8 mt-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
              <FiClipboard />
            </div>
            <h2 className="text-2xl font-bold">Pedidos recientes</h2>
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
              <tr className="border-b border-slate-200">
                <td className="py-5 font-bold">#1053</td>
                <td>Ana Torres</td>
                <td>Q1,400</td>
                <td>09/05/2026&nbsp;&nbsp;11:45</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-5 font-bold">#1052</td>
                <td>Juan Pérez</td>
                <td>Q950</td>
                <td>09/05/2026&nbsp;&nbsp;09:30</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-5 font-bold">#1051</td>
                <td>María Gómez</td>
                <td>Q800</td>
                <td>08/05/2026&nbsp;&nbsp;16:20</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center mt-6">
            <button className="text-blue-600 font-bold">Ver todos los pedidos</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard