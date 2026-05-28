import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

import {
  FiEye,
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiMapPin,
  FiCreditCard,
  FiUser,
} from "react-icons/fi"

const estados = [
  {
    name: "Recibido",
    icon: FiCheckCircle,
    color: "bg-blue-600 text-white",
  },
  {
    name: "Preparando",
    icon: FiPackage,
    color: "bg-purple-600 text-white",
  },
  {
    name: "Enviado",
    icon: FiTruck,
    color: "bg-indigo-600 text-white",
  },
  {
    name: "Entregado",
    icon: FiCheckCircle,
    color: "bg-green-600 text-white",
  },
  {
    name: "Cancelado",
    icon: FiXCircle,
    color: "bg-red-500 text-white",
  },
]

function Orders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadOrders = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        "http://localhost:4000/api/pedidos/admin/todos"
      )

      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando pedidos:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (id, estadoPedido) => {
    try {
      await fetch(`http://localhost:4000/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estadoPedido }),
      })

      setSelectedOrder((prev) =>
        prev ? { ...prev, EstadoPedido: estadoPedido } : prev
      )

      await loadOrders()
    } catch (error) {
      console.error("Error actualizando estado:", error)
      alert("No se pudo actualizar el estado del pedido.")
    }
  }

  const getEstadoStyle = (estado) => {
    if (estado === "Entregado") return "bg-green-100 text-green-700"
    if (estado === "Enviado") return "bg-indigo-100 text-indigo-700"
    if (estado === "Preparando") return "bg-purple-100 text-purple-700"
    if (estado === "Recibido") return "bg-blue-100 text-blue-700"
    if (estado === "Cancelado") return "bg-red-100 text-red-700"

    return "bg-slate-100 text-slate-600"
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6ff] text-[#071735]">
      <Sidebar />

      <main className="flex-1 px-8 py-7">
        <Topbar />

        {!selectedOrder ? (
          <>
            <section className="mt-8">
              <span className="badge-blue">
                <FiPackage />
                Gestión de pedidos
              </span>

              <h1 className="title-main mt-3">Pedidos</h1>

              <p className="mt-3 text-[15px] font-semibold text-slate-500">
                Administra y revisa el detalle de los pedidos realizados.
              </p>
            </section>

            <section className="card-premium mt-8 p-7">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="title-section">Lista de pedidos</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Total registrados: {orders.length}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left">
                  <thead>
                    <tr className="table-header">
                      <th className="px-4 py-4">Pedido</th>
                      <th className="px-4 py-4">Cliente</th>
                      <th className="px-4 py-4">Total</th>
                      <th className="px-4 py-4">Método</th>
                      <th className="px-4 py-4">Dirección</th>
                      <th className="px-4 py-4">Estado</th>
                      <th className="px-4 py-4 text-center">Acción</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.Id} className="table-row">
                        <td className="px-4 py-5 font-black text-blue-600">
                          #{order.Id}
                        </td>

                        <td className="px-4 py-5">
                          <p className="font-extrabold text-[#071735]">
                            {order.Name} {order.LastName}
                          </p>
                        </td>

                        <td className="px-4 py-5 font-extrabold">
                          Q{Number(order.Total || 0).toLocaleString("es-GT")}
                        </td>

                        <td className="px-4 py-5 font-bold text-slate-600">
                          {order.MetodoPago || "No definido"}
                        </td>

                        <td className="px-4 py-5 font-bold text-slate-600">
                          {order.Municipio || ""}, {order.Departamento || ""}
                        </td>

                        <td className="px-4 py-5">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-extrabold ${getEstadoStyle(
                              order.EstadoPedido || "Pendiente"
                            )}`}
                          >
                            {order.EstadoPedido || "Pendiente"}
                          </span>
                        </td>

                        <td className="px-4 py-5">
                          <div className="flex justify-center">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                            >
                              <FiEye />
                              Ver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && orders.length === 0 && (
                  <p className="py-10 text-center font-bold text-slate-500">
                    No hay pedidos registrados todavía.
                  </p>
                )}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="mt-8">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-secondary mb-6"
              >
                <FiArrowLeft />
                Volver a pedidos
              </button>

              <span className="badge-blue">
                <FiPackage />
                Detalle del pedido
              </span>

              <h1 className="title-main mt-3">Pedido #{selectedOrder.Id}</h1>

              <p className="mt-3 text-[15px] font-semibold text-slate-500">
                Revisa la información del pedido y actualiza su estado.
              </p>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="card-premium p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <FiUser className="text-3xl" />
                </div>

                <p className="mt-6 text-sm font-bold text-slate-500">
                  Cliente
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#071735]">
                  {selectedOrder.Name} {selectedOrder.LastName}
                </h2>
              </div>

              <div className="card-premium p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <FiCreditCard className="text-3xl" />
                </div>

                <p className="mt-6 text-sm font-bold text-slate-500">
                  Total del pedido
                </p>

                <h2 className="mt-1 text-2xl font-black text-[#071735]">
                  Q{Number(selectedOrder.Total || 0).toLocaleString("es-GT")}
                </h2>

                <p className="mt-2 text-sm font-bold text-slate-500">
                  Método: {selectedOrder.MetodoPago || "No definido"}
                </p>
              </div>

              <div className="card-premium p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <FiMapPin className="text-3xl" />
                </div>

                <p className="mt-6 text-sm font-bold text-slate-500">
                  Dirección
                </p>

                <h2 className="mt-1 text-xl font-black text-[#071735]">
                  {selectedOrder.Municipio || ""},{" "}
                  {selectedOrder.Departamento || ""}
                </h2>
              </div>
            </section>

            <section className="card-premium mt-8 p-8">
              <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="title-section">Estado del pedido</h2>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Estado actual:
                    <span
                      className={`ml-2 rounded-full px-4 py-2 text-xs font-extrabold ${getEstadoStyle(
                        selectedOrder.EstadoPedido || "Pendiente"
                      )}`}
                    >
                      {selectedOrder.EstadoPedido || "Pendiente"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                {estados.map((estado) => {
                  const Icon = estado.icon
                  const active = selectedOrder.EstadoPedido === estado.name

                  return (
                    <button
                      key={estado.name}
                      onClick={() => updateStatus(selectedOrder.Id, estado.name)}
                      className={`rounded-2xl border p-5 text-left transition hover:scale-[1.02] ${
                        active
                          ? estado.color
                          : "border-slate-200 bg-[#f8faff] text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Icon className="mb-4 text-3xl" />

                      <p className="text-sm font-black">
                        Marcar como {estado.name}
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="card-premium mt-8 p-8">
              <h2 className="title-section">Resumen del pedido</h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#f8faff] p-5">
                  <p className="text-sm font-bold text-slate-500">
                    Código del pedido
                  </p>
                  <p className="mt-1 text-xl font-black text-[#071735]">
                    #{selectedOrder.Id}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8faff] p-5">
                  <p className="text-sm font-bold text-slate-500">
                    Estado actual
                  </p>
                  <p className="mt-1 text-xl font-black text-[#071735]">
                    {selectedOrder.EstadoPedido || "Pendiente"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8faff] p-5">
                  <p className="text-sm font-bold text-slate-500">
                    Método de pago
                  </p>
                  <p className="mt-1 text-xl font-black text-[#071735]">
                    {selectedOrder.MetodoPago || "No definido"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8faff] p-5">
                  <p className="text-sm font-bold text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-black text-[#071735]">
                    Q{Number(selectedOrder.Total || 0).toLocaleString("es-GT")}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Orders