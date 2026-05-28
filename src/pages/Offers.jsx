import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiTag,
} from "react-icons/fi"

function Offers() {
  const [products, setProducts] = useState([])
  const [offers, setOffers] = useState([])
  const [editingOffer, setEditingOffer] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    productoId: "",
    porcentajeDescuento: "",
    fechaFin: "",
    activa: true,
  })

  const formatMoney = (value) =>
    `Q ${Number(value || 0).toLocaleString("es-GT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const loadProducts = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/productos")
      const data = await response.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando productos:", error)
    }
  }

  const loadOffers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/ofertas/admin")
      const data = await response.json()
      setOffers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando ofertas:", error)
    }
  }

  useEffect(() => {
    loadProducts()
    loadOffers()
  }, [])

  const resetForm = () => {
    setForm({
      productoId: "",
      porcentajeDescuento: "",
      fechaFin: "",
      activa: true,
    })

    setEditingOffer(null)
    setShowForm(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingOffer
        ? `http://localhost:4000/api/ofertas/${editingOffer.Id}`
        : "http://localhost:4000/api/ofertas"

      const method = editingOffer ? "PUT" : "POST"

      const body = editingOffer
        ? {
            porcentajeDescuento: Number(form.porcentajeDescuento),
            fechaFin: form.fechaFin,
            activa: form.activa,
          }
        : {
            productoId: Number(form.productoId),
            porcentajeDescuento: Number(form.porcentajeDescuento),
            fechaFin: form.fechaFin,
          }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Error API oferta:", data)
        alert(data.message || "Error guardando oferta")
        return
      }

      alert(data.message || "Oferta guardada correctamente")

      await loadOffers()
      resetForm()
    } catch (error) {
      console.error("Error general:", error)
      alert("Error conectando con el servidor")
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setShowForm(true)

    setForm({
      productoId: offer.ProductoId,
      porcentajeDescuento: offer.PorcentajeDescuento,
      fechaFin: offer.FechaFin
        ? new Date(offer.FechaFin).toISOString().slice(0, 16)
        : "",
      activa: offer.Activa,
    })
  }

  const handleDelete = async (id) => {
    const confirmar = confirm("¿Eliminar esta oferta?")

    if (!confirmar) return

    try {
      const response = await fetch(`http://localhost:4000/api/ofertas/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Error eliminando oferta")
        return
      }

      await loadOffers()
    } catch (error) {
      console.error("Error eliminando oferta:", error)
      alert("Error eliminando oferta")
    }
  }

  return (
    <div className="flex bg-[#f8faff] min-h-screen">
      <Sidebar />

      <main className="flex-1 px-7 py-7">
        <Topbar />

        <section className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              Ofertas
            </h1>

            <p className="text-slate-600 mt-2">
              Crea descuentos reales para productos registrados.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            <FiPlus />
            Nueva oferta
          </button>
        </section>

        {showForm && (
          <section className="bg-white rounded-3xl p-8 mt-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">
                {editingOffer ? "Editar oferta" : "Nueva oferta"}
              </h2>

              <button
                onClick={resetForm}
                className="bg-slate-100 hover:bg-slate-200 w-11 h-11 rounded-xl flex items-center justify-center"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-5">
              <select
                name="productoId"
                value={form.productoId}
                onChange={handleChange}
                disabled={!!editingOffer}
                className="input-admin"
                required
              >
                <option value="">Selecciona producto</option>

                {products.map((product) => (
                  <option key={product.Id} value={product.Id}>
                    {product.Nombre} - {formatMoney(product.Precio)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="porcentajeDescuento"
                value={form.porcentajeDescuento}
                onChange={handleChange}
                placeholder="% descuento"
                min="1"
                max="100"
                className="input-admin"
                required
              />

              <input
                type="datetime-local"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleChange}
                className="input-admin"
                required
              />

              {editingOffer && (
                <label className="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 py-4 font-bold text-slate-600">
                  <input
                    type="checkbox"
                    name="activa"
                    checked={form.activa}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  Oferta activa
                </label>
              )}

              <button
                type="submit"
                className="md:col-span-4 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3"
              >
                <FiSave />
                {editingOffer ? "Guardar cambios" : "Crear oferta"}
              </button>
            </form>
          </section>
        )}

        <section className="bg-white rounded-3xl p-8 mt-8 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-black mb-6">
            Ofertas registradas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-4">Producto</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                  <th>Precio oferta</th>
                  <th>Finaliza</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.Id} className="border-b border-slate-100">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FiTag />
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">
                            {offer.Producto}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID producto #{offer.ProductoId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>{formatMoney(offer.Precio)}</td>

                    <td>
                      <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-bold">
                        {offer.PorcentajeDescuento}%
                      </span>
                    </td>

                    <td className="font-black text-green-600">
                      {formatMoney(offer.PrecioOferta)}
                    </td>

                    <td>
                      {offer.FechaFin
                        ? new Date(offer.FechaFin).toLocaleString("es-GT")
                        : "Sin fecha"}
                    </td>

                    <td>
                      <span
                        className={`px-4 py-2 rounded-xl font-bold ${
                          offer.Activa
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {offer.Activa ? "Activa" : "Inactiva"}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => handleDelete(offer.Id)}
                          className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {offers.length === 0 && (
              <p className="text-center text-slate-500 py-10">
                No hay ofertas registradas.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Offers