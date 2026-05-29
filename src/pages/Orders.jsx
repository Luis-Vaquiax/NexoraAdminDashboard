import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import {
  FiEye, FiArrowLeft, FiPackage, FiTruck,
  FiCheckCircle, FiXCircle, FiMapPin, FiCreditCard, FiUser,
} from "react-icons/fi"

const estadoOrden = ["Recibido", "Preparando", "Enviado", "Entregado", "Cancelado"]

const estados = [
  { name: "Recibido",   icon: FiCheckCircle, color: "bg-blue-600 text-white"   },
  { name: "Preparando", icon: FiPackage,     color: "bg-violet-500 text-white"  },
  { name: "Enviado",    icon: FiTruck,       color: "bg-indigo-600 text-white"  },
  { name: "Entregado",  icon: FiCheckCircle, color: "bg-green-500 text-white"   },
  { name: "Cancelado",  icon: FiXCircle,     color: "bg-red-500 text-white"     },
]

const estadoBadge = {
  Entregado:  "bg-green-50 text-green-600",
  Enviado:    "bg-indigo-50 text-indigo-600",
  Preparando: "bg-violet-50 text-violet-600",
  Recibido:   "bg-blue-50 text-blue-600",
  Cancelado:  "bg-red-50 text-red-500",
}

function InfoCard({ icon: Icon, label, title, sub }) {
  return (
    <div className="bg-white rounded-[20px] p-5 border border-[#eaecf4]">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base mb-4">
        <Icon />
      </div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
      <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mt-0.5">{title}</h2>
      {sub && <p className="text-[12px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Orders() {
  const [orders, setOrders]               = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading]             = useState(false)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res  = await fetch("http://localhost:4000/api/pedidos/admin/todos")
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch { setOrders([]) }
    finally  { setLoading(false) }
  }

  useEffect(() => { loadOrders() }, [])

  const updateStatus = async (id, estadoPedido) => {
    try {
      await fetch(`http://localhost:4000/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estadoPedido }),
      })
      setSelectedOrder((prev) => prev ? { ...prev, EstadoPedido: estadoPedido } : prev)
      await loadOrders()
    } catch { alert("No se pudo actualizar el estado.") }
  }

  const badge = (estado) =>
    estadoBadge[estado] || "bg-gray-100 text-gray-600"

  return (
    <div className="flex bg-[#f1f5fb] min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-7">
        <Topbar />

        {!selectedOrder ? (
          <>
            {/* Header */}
            <section className="mt-8 mb-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Nexora · Gestión</p>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pedidos</h1>
              <p className="text-sm text-gray-400 mt-1">Administra y revisa el detalle de los pedidos realizados.</p>
            </section>

            {/* Table card */}
            <section className="bg-white rounded-[24px] border border-[#eaecf4] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Lista de pedidos</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Total: {orders.length} registros</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Pedido","Cliente","Total","Método","Dirección","Estado",""].map((h) => (
                        <th key={h} className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.Id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4 text-sm font-bold text-indigo-600">#{order.Id}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">{order.Name} {order.LastName}</td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-900">Q{Number(order.Total||0).toLocaleString("es-GT")}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{order.MetodoPago || "—"}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{order.Municipio}, {order.Departamento}</td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${badge(order.EstadoPedido || "Pendiente")}`}>
                            {order.EstadoPedido || "Pendiente"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold px-4 py-2 rounded-xl transition"
                          >
                            <FiEye size={13} /> Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && orders.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-12">No hay pedidos registrados todavía.</p>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Back */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-8 mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-gray-800 transition"
            >
              <FiArrowLeft size={14} /> Volver a pedidos
            </button>

            <section className="mb-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Nexora · Pedido</p>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pedido #{selectedOrder.Id}</h1>
              <p className="text-sm text-gray-400 mt-1">Revisa la información y actualiza el estado.</p>
            </section>

            {/* Info cards */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-5">
              <InfoCard
                icon={FiUser}
                label="Cliente"
                title={`${selectedOrder.Name} ${selectedOrder.LastName}`}
              />
              <InfoCard
                icon={FiCreditCard}
                label="Total del pedido"
                title={`Q${Number(selectedOrder.Total||0).toLocaleString("es-GT")}`}
                sub={`Método: ${selectedOrder.MetodoPago || "No definido"}`}
              />
              <InfoCard
                icon={FiMapPin}
                label="Dirección"
                title={`${selectedOrder.Municipio || ""}, ${selectedOrder.Departamento || ""}`}
              />
            </div>

            {/* Status update */}
            <section className="bg-white rounded-[24px] p-6 border border-[#eaecf4] mb-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Flujo de pedido</p>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Estado del pedido</h2>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${badge(selectedOrder.EstadoPedido || "Pendiente")}`}>
                  {selectedOrder.EstadoPedido || "Pendiente"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {estados.map((estado) => {
                  const Icon = estado.icon
                  const active = selectedOrder.EstadoPedido === estado.name

                  const currentIndex = estadoOrden.indexOf(selectedOrder.EstadoPedido)
                  const thisIndex    = estadoOrden.indexOf(estado.name)

                  // Bloquear si: es un estado anterior al actual, o el pedido ya está en estado final
                  const isPast   = thisIndex < currentIndex
                  const isFinal  = selectedOrder.EstadoPedido === "Entregado" || selectedOrder.EstadoPedido === "Cancelado"
                  const isDisabled = isPast || (isFinal && !active)

                  return (
                    <button
                      key={estado.name}
                      onClick={() => !isDisabled && updateStatus(selectedOrder.Id, estado.name)}
                      disabled={isDisabled}
                      title={isDisabled ? "No puedes regresar a un estado anterior" : undefined}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? `${estado.color} hover:scale-[1.02]`
                          : isDisabled
                          ? "border-[#eaecf4] bg-[#f1f5fb] text-gray-300 cursor-not-allowed opacity-40"
                          : "border-[#eaecf4] bg-[#f1f5fb] text-gray-600 hover:bg-white hover:scale-[1.02]"
                      }`}
                    >
                      <Icon className="mb-3 text-xl" />
                      <p className="text-[12px] font-bold leading-tight">Marcar como<br />{estado.name}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Summary */}
            <section className="bg-white rounded-[24px] p-6 border border-[#eaecf4]">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Información</p>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-5">Resumen del pedido</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Código",      value: `#${selectedOrder.Id}` },
                  { label: "Estado",      value: selectedOrder.EstadoPedido || "Pendiente" },
                  { label: "Método pago", value: selectedOrder.MetodoPago || "No definido" },
                  { label: "Total",       value: `Q${Number(selectedOrder.Total||0).toLocaleString("es-GT")}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#f1f5fb] rounded-xl p-4">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-base font-extrabold text-gray-900 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Orders