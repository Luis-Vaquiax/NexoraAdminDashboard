import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiTag } from "react-icons/fi"

function Offers() {
  const [products, setProducts]       = useState([])
  const [offers, setOffers]           = useState([])
  const [editingOffer, setEditingOffer] = useState(null)
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState({ productoId: "", porcentajeDescuento: "", fechaFin: "", activa: true })

  const formatMoney = (v) => `Q ${Number(v||0).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const loadProducts = async () => {
    try { const r = await fetch("http://localhost:4000/api/productos"); const d = await r.json(); setProducts(Array.isArray(d) ? d : []) }
    catch { console.error("Error cargando productos") }
  }
  const loadOffers = async () => {
    try { const r = await fetch("http://localhost:4000/api/ofertas/admin"); const d = await r.json(); setOffers(Array.isArray(d) ? d : []) }
    catch { console.error("Error cargando ofertas") }
  }

  useEffect(() => { loadProducts(); loadOffers() }, [])

  const resetForm = () => { setForm({ productoId: "", porcentajeDescuento: "", fechaFin: "", activa: true }); setEditingOffer(null); setShowForm(false) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url    = editingOffer ? `http://localhost:4000/api/ofertas/${editingOffer.Id}` : "http://localhost:4000/api/ofertas"
      const method = editingOffer ? "PUT" : "POST"
      const body   = editingOffer
        ? { porcentajeDescuento: Number(form.porcentajeDescuento), fechaFin: form.fechaFin, activa: form.activa }
        : { productoId: Number(form.productoId), porcentajeDescuento: Number(form.porcentajeDescuento), fechaFin: form.fechaFin }
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { alert(data.message || "Error guardando oferta"); return }
      alert(data.message || "Oferta guardada correctamente")
      await loadOffers(); resetForm()
    } catch { alert("Error conectando con el servidor") }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer); setShowForm(true)
    setForm({ productoId: offer.ProductoId, porcentajeDescuento: offer.PorcentajeDescuento, fechaFin: offer.FechaFin ? new Date(offer.FechaFin).toISOString().slice(0,16) : "", activa: offer.Activa })
  }

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta oferta?")) return
    try {
      const res  = await fetch(`http://localhost:4000/api/ofertas/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) { alert(data.message || "Error eliminando oferta"); return }
      await loadOffers()
    } catch { alert("Error eliminando oferta") }
  }

  const inputCls = "bg-[#f1f5fb] border border-[#eaecf4] rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition w-full"

  return (
    <div className="flex bg-[#f1f5fb] min-h-screen">
      <Sidebar />
      <main className="flex-1 px-8 py-7">
        <Topbar />

        {/* Header */}
        <section className="mt-8 mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Nexora · Catálogo</p>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ofertas</h1>
            <p className="text-sm text-gray-400 mt-1">Crea descuentos reales para productos registrados.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex-shrink-0"
          >
            <FiPlus size={14} /> Nueva oferta
          </button>
        </section>

        {/* Form */}
        {showForm && (
          <section className="bg-white rounded-[24px] p-6 mb-5 border border-[#eaecf4]">
            <div className="flex justify-between items-center mb-5">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                  {editingOffer ? "Modificar" : "Crear nueva"}
                </p>
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                  {editingOffer ? "Editar oferta" : "Nueva oferta"}
                </h2>
              </div>
              <button onClick={resetForm} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">
                <FiX size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-3">
              <select name="productoId" value={form.productoId} onChange={handleChange} disabled={!!editingOffer} className={inputCls} required>
                <option value="">Selecciona producto</option>
                {products.map((p) => <option key={p.Id} value={p.Id}>{p.Nombre} — {formatMoney(p.Precio)}</option>)}
              </select>
              <input type="number" name="porcentajeDescuento" value={form.porcentajeDescuento} onChange={handleChange} placeholder="% descuento" min="1" max="100" className={inputCls} required />
              <input type="datetime-local" name="fechaFin" value={form.fechaFin} onChange={handleChange} className={inputCls} required />
              {editingOffer && (
                <label className="flex items-center gap-2.5 bg-[#f1f5fb] rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 cursor-pointer">
                  <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} className="accent-indigo-600 w-4 h-4" />
                  Oferta activa
                </label>
              )}
              <button type="submit" className="md:col-span-4 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition">
                <FiSave size={14} />
                {editingOffer ? "Guardar cambios" : "Crear oferta"}
              </button>
            </form>
          </section>
        )}

        {/* Table */}
        <section className="bg-white rounded-[24px] border border-[#eaecf4] overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Ofertas registradas</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">{offers.length} ofertas en total</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Producto","Precio","Descuento","Precio oferta","Finaliza","Estado","Acciones"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.Id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm flex-shrink-0">
                          <FiTag />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{offer.Producto}</p>
                          <p className="text-[11px] text-gray-400">ID #{offer.ProductoId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{formatMoney(offer.Precio)}</td>
                    <td className="px-5 py-4">
                      <span className="bg-indigo-50 text-indigo-600 text-[11px] font-bold px-3 py-1.5 rounded-full">
                        {offer.PorcentajeDescuento}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-black text-green-600">{formatMoney(offer.PrecioOferta)}</td>
                    <td className="px-5 py-4 text-[12px] text-gray-400">
                      {offer.FechaFin ? new Date(offer.FechaFin).toLocaleString("es-GT") : "Sin fecha"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${offer.Activa ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {offer.Activa ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(offer)} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-100 transition">
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(offer.Id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {offers.length === 0 && <p className="text-center text-gray-400 text-sm py-12">No hay ofertas registradas.</p>}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Offers