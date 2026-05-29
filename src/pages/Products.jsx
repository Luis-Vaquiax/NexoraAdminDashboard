import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import {
  FiEdit, FiTrash2, FiPlus, FiBox,
  FiChevronRight, FiSearch, FiSave, FiX,
} from "react-icons/fi"
import {
  getProducts, getCategories, getBrands, getSubcategoriesByCategory,
} from "../services/productService"

// ── Helpers ────────────────────────────────────────────────────────
const getImageUrl = (url) => {
  if (!url) return null
  return url.startsWith("/uploads") ? `http://localhost:4000${url}` : url
}

// ── Sub-components ────────────────────────────────────────────────
function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
      ${active
        ? "bg-green-50 text-green-800 border border-green-100"
        : "bg-red-50 text-red-700 border border-red-100"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-red-400"}`} />
      {active ? "Activo" : "Inactivo"}
    </span>
  )
}

function ProductImage({ src, alt }) {
  return src ? (
    <img src={src} alt={alt}
      className="w-11 h-11 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
  ) : (
    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
      <FiBox className="text-blue-400 text-lg" />
    </div>
  )
}

// ── Formulario ─────────────────────────────────────────────────────
function ProductForm({ form, handleChange, setForm, categories, subcategories, brands, editingId, loading, onCancel }) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-6 mt-6 shadow-sm">
      {/* Header del form */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${editingId ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
            {editingId ? <FiEdit className="text-base" /> : <FiPlus className="text-base" />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {editingId ? "Editar producto" : "Agregar nuevo producto"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingId ? "Modifica la información del producto." : "Completa la información del producto."}
            </p>
          </div>
        </div>
        {editingId && (
          <button type="button" onClick={onCancel}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600
              bg-slate-100 rounded-xl hover:bg-slate-200 transition">
            <FiX className="text-xs" /> Cancelar edición
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nombre" value={form.nombre} onChange={handleChange}
          placeholder="Nombre del producto" required className="input-admin" />
        <input name="precio" value={form.precio} onChange={handleChange}
          placeholder="Precio Q" type="number" required className="input-admin" />
        <input name="pesoEnLibras" value={form.pesoEnLibras} onChange={handleChange}
          placeholder="Peso en libras" type="number" step="0.01" className="input-admin" />
        <input name="stock" value={form.stock} onChange={handleChange}
          placeholder="Stock disponible" type="number" required className="input-admin" />

        <select name="categoriaId" value={form.categoriaId} onChange={handleChange}
          required className="input-admin">
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => <option key={c.Id} value={c.Id}>{c.Nombre}</option>)}
        </select>

        <select name="subcategoriaId" value={form.subcategoriaId} onChange={handleChange}
          disabled={!form.categoriaId} className="input-admin">
          <option value="">Seleccionar subcategoría</option>
          {subcategories.map((s) => <option key={s.Id} value={s.Id}>{s.Nombre}</option>)}
        </select>

        <select name="marcaId" value={form.marcaId} onChange={handleChange}
          required className="input-admin">
          <option value="">Seleccionar marca</option>
          {brands.map((b) => <option key={b.Id} value={b.Id}>{b.Nombre}</option>)}
        </select>

        <input type="file" name="imagen" accept="image/*"
          onChange={(e) => setForm((f) => ({ ...f, imagen: e.target.files[0] }))}
          className="input-admin" />

        <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
          placeholder="Descripción del producto" required
          className="input-admin col-span-full h-28 resize-none" />
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
          <input type="checkbox" name="activo" checked={form.activo}
            onChange={handleChange} className="w-4 h-4 accent-blue-600 rounded" />
          Producto activo
        </label>

        <button disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl
            transition disabled:opacity-60
            ${editingId ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}>
          <FiSave className="text-sm" />
          {loading ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar producto"}
        </button>
      </div>
    </section>
  )
}

// ── Tabla de stock ─────────────────────────────────────────────────
function StockTable({ products, onEdit, onDelete, loading }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100">
            {["Imagen", "Producto", "Categoría", "Marca", "Precio", "Stock", "Estado", ""].map((h, i) => (
              <th key={i} className="px-3 pb-3 text-[11px] font-semibold text-slate-400
                uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((p) => (
            <tr key={p.Id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-3 py-3.5">
                <ProductImage src={getImageUrl(p.ImageUrl)} alt={p.Nombre} />
              </td>
              <td className="px-3 py-3.5">
                <p className="text-sm font-semibold text-slate-900 leading-snug">{p.Nombre}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.Descripcion}</p>
              </td>
              <td className="px-3 py-3.5 text-sm text-slate-500">{p.Categoria}</td>
              <td className="px-3 py-3.5 text-sm text-slate-500">{p.Marca}</td>
              <td className="px-3 py-3.5">
                <span className="text-sm font-semibold text-blue-600">Q{p.Precio}</span>
              </td>
              <td className="px-3 py-3.5">
                <span className={`text-sm font-semibold ${p.Stock <= 0 ? "text-red-500" : "text-slate-700"}`}>
                  {p.Stock}
                </span>
              </td>
              <td className="px-3 py-3.5"><StatusBadge active={p.Activo} /></td>
              <td className="px-3 py-3.5">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                    aria-label="Editar producto">
                    <FiEdit className="text-sm" />
                  </button>
                  <button onClick={() => onDelete(p.Id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      bg-red-50 text-red-600 hover:bg-red-100 transition"
                    aria-label="Eliminar producto">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <p className="text-center text-sm text-slate-400 py-10">Cargando productos...</p>
      )}
      {!loading && products.length === 0 && (
        <div className="py-14 text-center">
          <FiBox className="text-3xl text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No hay productos registrados todavía.</p>
        </div>
      )}
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────────
const FORM_DEFAULT = {
  nombre: "", descripcion: "", precio: "", pesoEnLibras: "",
  stock: "", imagen: null, categoriaId: "", subcategoriaId: "",
  marcaId: "", activo: true,
}

function Products() {
  const [activeTab, setActiveTab]       = useState("stock")
  const [editingId, setEditingId]       = useState(null)
  const [searchParams]                  = useSearchParams()
  const categoriaFiltro                 = searchParams.get("categoria")

  const [products, setProducts]         = useState([])
  const [categories, setCategories]     = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands]             = useState([])
  const [loading, setLoading]           = useState(false)
  const [search, setSearch]             = useState("")
  const [form, setForm]                 = useState(FORM_DEFAULT)

  const categoriaActual = categories.find(
    (c) => String(c.Id) === String(categoriaFiltro)
  )

  const filteredProducts = products.filter((p) =>
    `${p.Nombre} ${p.Categoria} ${p.Marca}`.toLowerCase()
      .includes(search.toLowerCase())
  )

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [prods, cats, mrcas] = await Promise.all([
        getProducts(), getCategories(), getBrands(),
      ])
      setProducts(
        categoriaFiltro
          ? prods.filter((p) => String(p.CategoriaId) === String(categoriaFiltro))
          : prods
      )
      setCategories(cats)
      setBrands(mrcas)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadInitialData() }, [categoriaFiltro])

  useEffect(() => {
    if (!form.categoriaId) { setSubcategories([]); return }
    getSubcategoriesByCategory(form.categoriaId).then(setSubcategories)
  }, [form.categoriaId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "categoriaId" ? { subcategoriaId: "" } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === "imagen" && v) fd.append("imagen", v)
        else if (k !== "imagen") fd.append(k, v)
      })
      const url    = editingId ? `http://localhost:4000/api/productos/${editingId}` : "http://localhost:4000/api/productos"
      const method = editingId ? "PUT" : "POST"
      const res    = await fetch(url, { method, body: fd })
      const data   = await res.json()
      if (!res.ok) { alert(data.message || "Error al guardar"); return }
      alert(editingId ? "Producto actualizado" : "Producto creado")
      setForm(FORM_DEFAULT); setEditingId(null)
      await loadInitialData(); setActiveTab("stock")
    } catch { alert("Error al guardar producto") }
    finally { setLoading(false) }
  }

  const editProduct = (p) => {
    setEditingId(p.Id)
    setForm({
      nombre: p.Nombre, descripcion: p.Descripcion, precio: p.Precio,
      pesoEnLibras: p.PesoEnLibras, stock: p.Stock, imagen: null,
      categoriaId: p.CategoriaId, subcategoriaId: "", marcaId: p.MarcaId, activo: p.Activo,
    })
    setActiveTab("add")
  }

  const cancelEdit = () => { setEditingId(null); setForm(FORM_DEFAULT); setActiveTab("stock") }

  const deleteProduct = async (id) => {
    if (!window.confirm("¿Deseas eliminar este producto?")) return
    try {
      await fetch(`http://localhost:4000/api/productos/${id}`, { method: "DELETE" })
      setProducts((ps) => ps.filter((p) => p.Id !== id))
    } catch { alert("Error eliminando producto") }
  }

  const goToTab = (tab) => {
    setActiveTab(tab)
    if (tab === "stock") cancelEdit()
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-8 py-7">
        <Topbar />

        {/* Breadcrumb */}
        {categoriaFiltro && categoriaActual && (
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-6">
            <span>Inicio</span>
            <FiChevronRight className="text-xs" />
            <span>Categorías</span>
            <FiChevronRight className="text-xs" />
            <span className="text-blue-600 font-semibold">{categoriaActual.Nombre}</span>
          </nav>
        )}

        {/* Encabezado */}
        <section className="mt-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700
              bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
              <FiBox className="text-xs" />
              {categoriaFiltro && categoriaActual
                ? `Categoría: ${categoriaActual.Nombre}`
                : "Gestión de productos"}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {categoriaFiltro && categoriaActual
                ? `Productos de ${categoriaActual.Nombre}`
                : "Productos"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Administra el stock y agrega nuevos productos para la tienda.
            </p>
            {categoriaFiltro && (
              <button onClick={() => { window.location.href = "/productos" }}
                className="mt-3 text-xs font-semibold text-blue-600 bg-blue-50 border
                  border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                ← Ver todos los productos
              </button>
            )}
          </div>

          {/* Tabs + Buscador */}
          <div className="flex flex-col gap-3 w-full xl:w-auto xl:items-end">
            <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
              {[
                { key: "stock", label: "Stock disponible" },
                { key: "add",   label: editingId ? "Editando producto" : "Agregar producto" },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => goToTab(key)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === key
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:text-slate-700"
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200
              rounded-xl px-4 py-2.5 w-full xl:w-[340px] shadow-sm">
              <FiSearch className="text-slate-400 flex-shrink-0 text-sm" />
              <input type="text" placeholder="Buscar producto, marca o categoría..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400" />
              {search && (
                <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                  <FiX className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Tabla */}
        {activeTab === "stock" && (
          <section className="bg-white border border-slate-100 rounded-2xl p-6 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiBox className="text-blue-600 text-base" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Stock disponible</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button onClick={() => goToTab("add")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                  bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                <FiPlus className="text-sm" /> Nuevo producto
              </button>
            </div>

            <StockTable
              products={filteredProducts}
              onEdit={editProduct}
              onDelete={deleteProduct}
              loading={loading}
            />
          </section>
        )}

        {/* Formulario */}
        {activeTab === "add" && (
          <form onSubmit={handleSubmit}>
            <ProductForm
              form={form}
              handleChange={handleChange}
              setForm={setForm}
              categories={categories}
              subcategories={subcategories}
              brands={brands}
              editingId={editingId}
              loading={loading}
              onCancel={cancelEdit}
            />
          </form>
        )}
      </main>
    </div>
  )
}

export default Products