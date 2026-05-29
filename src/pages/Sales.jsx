import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import {
  FiShoppingBag, FiDollarSign, FiUsers,
  FiPlus, FiX, FiTrash2, FiPrinter, FiSearch,
  FiRefreshCw,
} from "react-icons/fi"

const API_URL = "http://localhost:4000/api"

const fmtQ    = (n) => `Q${Number(n || 0).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-GT") : "—"

function MetricCard({ icon: Icon, value, label, iconBg, iconColor, badge, badgeClass }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 flex-1">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`text-base ${iconColor}`} />
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md ${badgeClass}`}>{badge}</span>
      </div>
      <p className="text-[11px] font-medium text-slate-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  )
}

// Badge por tipo de venta
function TipoBadge({ tipo }) {
  if (tipo === "ONLINE")
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">Online</span>
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Tienda</span>
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"

function Sales() {
  const [sales, setSales]                         = useState([])
  const [products, setProducts]                   = useState([])
  const [showModal, setShowModal]                 = useState(false)
  const [loading, setLoading]                     = useState(false)
  const [searchProduct, setSearchProduct]         = useState("")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity]                   = useState(1)
  const [client, setClient]                       = useState({ nombre: "", apellido: "", email: "", telefono: "" })
  const [items, setItems]                         = useState([])

  const loadSales = async () => {
    try {
      setLoading(true)
      const r = await fetch(`${API_URL}/ventas`)
      const d = await r.json()
      setSales(Array.isArray(d) ? d : [])
    } catch { setSales([]) } finally { setLoading(false) }
  }

  const loadProducts = async () => {
    try {
      const r = await fetch(`${API_URL}/ventas/productos`)
      const d = await r.json()
      setProducts(Array.isArray(d) ? d : [])
    } catch { setProducts([]) }
  }

  useEffect(() => { loadSales(); loadProducts() }, [])

  const total       = useMemo(() => items.reduce((acc, i) => acc + i.subtotal, 0), [items])

  // ── Métricas unificadas ───────────────────────────────────────────
  const totalIngresos  = useMemo(() => sales.reduce((acc, s) => acc + Number(s.TotalPagar || 0), 0), [sales])
  const totalTienda    = useMemo(() => sales.filter(s => s.TipoVenta !== "ONLINE").length, [sales])
  const totalOnline    = useMemo(() => sales.filter(s => s.TipoVenta === "ONLINE").length, [sales])
  const uniqueClientes = useMemo(() => new Set(sales.map(s => s.Email)).size, [sales])

  const filteredProducts = useMemo(() =>
    products.filter((p) =>
      `${p.Nombre} ${p.Marca} ${p.Categoria}`.toLowerCase().includes(searchProduct.toLowerCase())
    ), [products, searchProduct])

  const addProduct = () => {
    const product = products.find((p) => String(p.Id) === String(selectedProductId))
    if (!product) { alert("Selecciona un producto"); return }
    const cantidad = Number(quantity)
    if (cantidad <= 0) { alert("La cantidad debe ser mayor a 0"); return }
    if (cantidad > Number(product.Stock || 0)) { alert(`Stock insuficiente. Disponible: ${product.Stock}`); return }
    const exists = items.find((i) => i.productoId === product.Id)
    if (exists) {
      const nueva = exists.cantidad + cantidad
      if (nueva > Number(product.Stock || 0)) { alert(`Stock insuficiente. Disponible: ${product.Stock}`); return }
      setItems(items.map((i) => i.productoId === product.Id
        ? { ...i, cantidad: nueva, subtotal: nueva * i.precio } : i))
    } else {
      setItems([...items, {
        productoId: product.Id, nombre: product.Nombre, marca: product.Marca,
        categoria: product.Categoria, stock: product.Stock,
        cantidad, precio: Number(product.Precio), subtotal: cantidad * Number(product.Precio),
      }])
    }
    setSelectedProductId(""); setQuantity(1); setSearchProduct("")
  }

  const removeItem = (id) => setItems(items.filter((i) => i.productoId !== id))

  const resetSale = () => {
    setClient({ nombre: "", apellido: "", email: "", telefono: "" })
    setItems([]); setSelectedProductId(""); setQuantity(1); setSearchProduct(""); setShowModal(false)
  }

  const generarFacturaPDF = (ventaId = "VENTA") => {
    const doc = new jsPDF()
    const fecha = new Date().toLocaleString("es-GT")
    doc.setFillColor(30, 58, 95); doc.rect(0, 0, 210, 32, "F")
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold")
    doc.text("NEXORA", 15, 18); doc.setFontSize(10); doc.text("Factura de venta física", 15, 26)
    doc.setTextColor(15, 23, 42); doc.setFontSize(15); doc.text(`Factura No. ${ventaId}`, 140, 45)
    doc.setFontSize(10); doc.text(`Fecha: ${fecha}`, 140, 53); doc.text("Método: Tienda física", 140, 61)
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.text("Datos del cliente", 15, 48)
    doc.setFontSize(10); doc.setFont("helvetica", "normal")
    doc.text(`Cliente: ${client.nombre} ${client.apellido}`, 15, 57)
    doc.text(`Correo: ${client.email || "N/A"}`, 15, 65)
    doc.text(`Teléfono: ${client.telefono || "N/A"}`, 15, 73)
    doc.setFillColor(245, 247, 255); doc.rect(15, 90, 180, 10, "F")
    doc.setFont("helvetica", "bold")
    doc.text("Producto", 18, 97); doc.text("Cant.", 112, 97); doc.text("Precio", 135, 97); doc.text("Subtotal", 165, 97)
    let y = 110
    items.forEach((item) => {
      doc.setFont("helvetica", "normal")
      doc.text(String(item.nombre).slice(0, 42), 18, y)
      doc.text(String(item.cantidad), 115, y)
      doc.text(`Q ${Number(item.precio).toFixed(2)}`, 135, y)
      doc.text(`Q ${Number(item.subtotal).toFixed(2)}`, 165, y); y += 9
    })
    doc.line(15, y + 4, 195, y + 4)
    doc.setFont("helvetica", "bold"); doc.setFontSize(14)
    doc.text("TOTAL:", 135, y + 16); doc.text(`Q ${Number(total).toFixed(2)}`, 165, y + 16)
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139)
    doc.text("Gracias por comprar en Nexora.", 15, 285)
    doc.save(`Factura_Nexora_${ventaId}.pdf`)
  }

  const saveSale = async () => {
    if (!client.nombre.trim()) { alert("Ingresa el nombre del cliente"); return }
    if (items.length === 0) { alert("Agrega al menos un producto"); return }
    try {
      const response = await fetch(`${API_URL}/ventas/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: client,
          productos: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
        }),
      })
      const data = await response.json()
      if (!response.ok) { alert(data.message || "Error registrando venta"); return }
      generarFacturaPDF(data.ventaId)
      alert("Venta registrada correctamente")
      await loadSales(); await loadProducts(); resetSale()
    } catch { alert("Error conectando con el servidor") }
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 px-7 py-6 max-w-[1400px]">
        <Topbar />

        {/* Encabezado */}
        <section className="mt-8 flex items-end justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2.5 py-0.5">
              <FiShoppingBag className="text-[10px]" /> Gestión de ventas
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Ventas</h1>
            <p className="mt-1 text-xs text-slate-400">Control y administración de ventas Nexora.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadSales}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <FiRefreshCw className={`text-[11px] ${loading ? "animate-spin" : ""}`} /> Actualizar
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <FiPlus className="text-[11px]" /> Nueva venta física
            </button>
          </div>
        </section>

        {/* Métricas — ahora reflejan pedidos + tienda */}
        <section className="flex gap-4 mb-5">
          <MetricCard icon={FiShoppingBag} value={sales.length} label="Transacciones totales"
            iconBg="bg-blue-50" iconColor="text-blue-600" badge="Total" badgeClass="bg-slate-100 text-slate-500" />
          <MetricCard icon={FiDollarSign} value={fmtQ(totalIngresos)} label="Ingresos generados"
            iconBg="bg-emerald-50" iconColor="text-emerald-600" badge="Ingresos" badgeClass="bg-emerald-50 text-emerald-700 border border-emerald-100" />
          <MetricCard icon={FiUsers} value={uniqueClientes} label="Clientes únicos"
            iconBg="bg-violet-50" iconColor="text-violet-600" badge="Clientes" badgeClass="bg-violet-50 text-violet-700 border border-violet-100" />
        </section>

        {/* Sub-métricas tienda vs online */}
        <section className="flex gap-3 mb-5">
          <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Tienda</span>
            <span className="text-sm font-bold text-slate-800">{totalTienda} ventas físicas</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">Online</span>
            <span className="text-sm font-bold text-slate-800">{totalOnline} pedidos online</span>
          </div>
        </section>

        {/* Tabla historial */}
        <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Historial de ventas</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Ventas físicas y pedidos online unificados.</p>
            </div>
            <span className="text-[11px] text-slate-400">{sales.length} registros</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {["ID", "Cliente", "Correo", "Tipo", "Fecha", "Total"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, idx) => (
                  <tr key={`${sale.TipoVenta}-${sale.Id}-${idx}`} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-blue-600">#{sale.Id}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-slate-800">{sale.Name} {sale.LastName}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{sale.Email}</td>
                    <td className="px-4 py-3"><TipoBadge tipo={sale.TipoVenta} /></td>
                    <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(sale.Fecha)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-600">{fmtQ(sale.TotalPagar)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && sales.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">No hay ventas registradas todavía.</div>
            )}
            {loading && (
              <div className="py-12 text-center text-xs text-slate-400">Cargando ventas...</div>
            )}
          </div>
        </section>
      </main>

      {/* ── MODAL NUEVA VENTA ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start px-6 py-5 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 mb-2">
                  Nueva operación
                </span>
                <h2 className="text-sm font-bold text-slate-900">Nueva venta física</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Registra una venta directa y genera la factura en PDF.</p>
              </div>
              <button onClick={resetSale} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition">
                <FiX size={13} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Datos del cliente */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Datos del cliente</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[["nombre","Nombre *"],["apellido","Apellido"],["email","Correo"],["telefono","Teléfono"]].map(([name, placeholder]) => (
                    <input key={name} name={name} value={client[name]}
                      onChange={(e) => setClient({ ...client, [e.target.name]: e.target.value })}
                      placeholder={placeholder} className={inputCls} />
                  ))}
                </div>
              </div>

              {/* Agregar producto */}
              <div className="bg-white border border-slate-100 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Agregar producto</p>
                <div className="grid grid-cols-[1fr_2fr_80px_110px] gap-3">
                  <div className="relative">
                    <FiSearch size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)}
                      placeholder="Buscar..." className={`${inputCls} pl-8`} />
                  </div>
                  <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className={inputCls}>
                    <option value="">Seleccionar producto</option>
                    {filteredProducts.map((p) => (
                      <option key={p.Id} value={p.Id}>
                        {p.Nombre} | {p.Marca} | Stock: {p.Stock} | Q{p.Precio}
                      </option>
                    ))}
                  </select>
                  <input type="number" min="1" value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Cant." className={inputCls} />
                  <button onClick={addProduct}
                    className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition">
                    <FiPlus size={12} /> Agregar
                  </button>
                </div>
              </div>

              {/* Detalle */}
              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Detalle de venta</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Producto","Marca","Stock disp.","Cant.","Precio unit.","Subtotal",""].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.productoId} className="border-b border-slate-50 hover:bg-slate-50/60">
                          <td className="px-4 py-3 text-xs font-semibold text-slate-800">{item.nombre}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{item.marca}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{item.stock}</td>
                          <td className="px-4 py-3 text-xs text-slate-700">{item.cantidad}</td>
                          <td className="px-4 py-3 text-xs text-slate-700">{fmtQ(item.precio)}</td>
                          <td className="px-4 py-3 text-xs font-bold text-emerald-600">{fmtQ(item.subtotal)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => removeItem(item.productoId)}
                              className="w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 flex items-center justify-center transition">
                              <FiTrash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {items.length === 0 && (
                    <div className="py-10 text-center text-xs text-slate-400">No hay productos agregados todavía.</div>
                  )}
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/60">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total a cobrar</p>
                    <p className="text-xl font-bold text-emerald-600 tracking-tight mt-0.5">{fmtQ(total)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={resetSale}
                      className="px-4 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                      Cancelar
                    </button>
                    <button onClick={saveSale}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                      <FiPrinter size={12} /> Registrar y generar factura
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sales