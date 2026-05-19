import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiBox,
  FiChevronRight,
} from "react-icons/fi"

import {
  getProducts,
  getCategories,
  getBrands,
  getSubcategoriesByCategory,
} from "../services/productService"

function Products() {
  const [activeTab, setActiveTab] = useState("stock")
  const [editingId, setEditingId] = useState(null)
  const [searchParams] = useSearchParams()

  // Filtro recibido desde Categorías: /productos?categoria=1
  const categoriaFiltro = searchParams.get("categoria")

  // Estados principales
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  // Ahora sí se calcula después de crear categories
  const categoriaActual = categories.find(
    (cat) => String(cat.Id) === String(categoriaFiltro)
  )

  const filteredProducts = products.filter((product) => {

  const texto = `
    ${product.Nombre}
    ${product.Categoria}
    ${product.Marca}
  `.toLowerCase()

  return texto.includes(search.toLowerCase())
})

  const emptyForm = {
    nombre: "",
    descripcion: "",
    precio: "",
    pesoEnLibras: "",
    stock: "",
    imagen: null,
    categoriaId: "",
    subcategoriaId: "",
    marcaId: "",
    activo: true,
  }

  const [form, setForm] = useState(emptyForm)

  // Carga productos, categorías y marcas desde SQL Server por medio de la API
  const loadInitialData = async () => {
    try {
      const productosDB = await getProducts()
      const categoriasDB = await getCategories()
      const marcasDB = await getBrands()

      const productosFiltrados = categoriaFiltro
        ? productosDB.filter(
            (p) => String(p.CategoriaId) === String(categoriaFiltro)
          )
        : productosDB

      setProducts(productosFiltrados)
      setCategories(categoriasDB)
      setBrands(marcasDB)
    } catch (error) {
      console.error("Error cargando datos:", error)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [categoriaFiltro])

  // Carga subcategorías cuando se selecciona una categoría en el formulario
  useEffect(() => {
    const loadSubcategories = async () => {
      if (!form.categoriaId) {
        setSubcategories([])
        return
      }

      const data = await getSubcategoriesByCategory(form.categoriaId)
      setSubcategories(data)
    }

    loadSubcategories()
  }, [form.categoriaId])

  // Maneja cambios de inputs, selects y checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "categoriaId" ? { subcategoriaId: "" } : {}),
    })
  }

  // Guarda producto nuevo o actualiza uno existente
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("nombre", form.nombre)
      formData.append("descripcion", form.descripcion)
      formData.append("precio", form.precio)
      formData.append("pesoEnLibras", form.pesoEnLibras)
      formData.append("stock", form.stock)
      formData.append("activo", form.activo)
      formData.append("categoriaId", form.categoriaId)
      formData.append("marcaId", form.marcaId)

      if (form.imagen) {
        formData.append("imagen", form.imagen)
      }

      const url = editingId
        ? `http://localhost:4000/api/productos/${editingId}`
        : "http://localhost:4000/api/productos"

      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || "Error al guardar producto")
        return
      }

      alert(
        editingId
          ? "Producto actualizado correctamente"
          : "Producto agregado correctamente"
      )

      setForm(emptyForm)
      setEditingId(null)
      await loadInitialData()
      setActiveTab("stock")
    } catch (error) {
      console.error(error)
      alert("Error al guardar producto")
    } finally {
      setLoading(false)
    }
  }

  // Carga producto seleccionado para editarlo
  const editProduct = (product) => {
    setEditingId(product.Id)

    setForm({
      nombre: product.Nombre,
      descripcion: product.Descripcion,
      precio: product.Precio,
      pesoEnLibras: product.PesoEnLibras,
      stock: product.Stock,
      imagen: null,
      categoriaId: product.CategoriaId,
      subcategoriaId: "",
      marcaId: product.MarcaId,
      activo: product.Activo,
    })

    setActiveTab("add")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
    setActiveTab("stock")
  }

  // Elimina producto desde SQL Server
  const deleteProduct = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este producto?")
    if (!confirmar) return

    try {
      await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: "DELETE",
      })

      setProducts(products.filter((product) => product.Id !== id))
      alert("Producto eliminado correctamente")
    } catch (error) {
      console.error(error)
      alert("Error eliminando producto")
    }
  }

  // Convierte ruta local de la API en URL completa
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/80"

    if (imageUrl.startsWith("/uploads")) {
      return `http://localhost:4000${imageUrl}`
    }

    return imageUrl
  }

  return (
    <div className="flex bg-[#f8faff] min-h-screen">
      <Sidebar />

      <main className="flex-1 px-7 py-7">
        <Topbar />

        {/* Breadcrumb cuando viene desde categorías */}
        {categoriaFiltro && categoriaActual && (
          <section className="flex items-center gap-3 text-slate-500 font-medium mt-6">
            <span>Inicio</span>
            <FiChevronRight />
            <span>Categorías</span>
            <FiChevronRight />
            <span className="text-blue-600 font-bold">
              {categoriaActual.Nombre}
            </span>
          </section>
        )}

        {/* Encabezado */}
        <section className="mt-10">
          <h1 className="text-4xl font-black text-slate-900">
            {categoriaFiltro && categoriaActual
              ? `Productos de ${categoriaActual.Nombre}`
              : "Productos"}
          </h1>

          <p className="text-slate-500 mt-2">
            Administra el stock y agrega nuevos productos para la tienda.
          </p>

          {categoriaFiltro && (
            <button
              onClick={() => {
                window.location.href = "/productos"
              }}
              className="mt-5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 py-3 rounded-2xl transition"
            >
              Ver todos los productos
            </button>
          )}
        </section>

        {/* Tabs */}
        <section className="bg-white rounded-2xl p-4 mt-8 shadow-sm border border-slate-100 flex gap-4 w-fit">
          <button
            onClick={() => {
              setActiveTab("stock")
              setEditingId(null)
              setForm(emptyForm)
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "stock"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Stock Disponible
          </button>

          <button
            onClick={() => {
              setActiveTab("add")
              setEditingId(null)
              setForm(emptyForm)
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "add"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Agregar Nuevo Producto
          </button>
        </section>

        {/* Buscador */}
<section className="mt-8">

  <input
    type="text"
    placeholder="Buscar producto, marca o categoría..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
      w-full
      bg-white
      border
      border-slate-200
      rounded-2xl
      px-6
      py-4
      text-slate-700
      shadow-sm
      focus:outline-none
      focus:ring-4
      focus:ring-blue-100
      focus:border-blue-400
      transition
    "
  />

</section>

        {/* Tabla de stock */}
        {activeTab === "stock" && (
          <section className="bg-white rounded-[30px] p-8 mt-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                <FiBox />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Stock Disponible
                </h2>
                <p className="text-slate-500 mt-1">
                  Visualiza y administra productos desde SQL Server.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-5">Imagen</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.Id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="py-5">
                        <img
                          src={getImageUrl(product.ImageUrl)}
                          alt={product.Nombre}
                          className="w-16 h-16 rounded-2xl object-cover bg-slate-100"
                        />
                      </td>

                      <td>
                        <p className="font-bold text-slate-900">
                          {product.Nombre}
                        </p>
                        <p className="text-sm text-slate-500">
                          {product.Descripcion}
                        </p>
                      </td>

                      <td>{product.Categoria}</td>
                      <td>{product.Marca}</td>

                      <td className="font-bold text-blue-600">
                        Q{product.Precio}
                      </td>

                      <td>{product.Stock}</td>

                      <td>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            product.Activo
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.Activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td>
                        <div className="flex gap-3">
                          <button
                            onClick={() => editProduct(product)}
                            className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => deleteProduct(product.Id)}
                            className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:scale-105 transition"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <p className="text-center text-slate-500 py-10">
                  No hay productos registrados todavía.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Formulario de agregar / editar */}
        {activeTab === "add" && (
          <section className="bg-white rounded-[30px] p-10 mt-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    editingId
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {editingId ? <FiEdit /> : <FiPlus />}
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editingId ? "Editar Producto" : "Agregar Nuevo Producto"}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {editingId
                      ? "Modifica la información del producto seleccionado."
                      : "Completa la información del producto."}
                  </p>
                </div>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid grid-cols-2 gap-8">
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                  className="input-admin"
                />

                <input
                  name="precio"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="Precio Q"
                  type="number"
                  required
                  className="input-admin"
                />

                <input
                  name="pesoEnLibras"
                  value={form.pesoEnLibras}
                  onChange={handleChange}
                  placeholder="Peso en libras"
                  type="number"
                  step="0.01"
                  className="input-admin"
                />

                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock disponible"
                  type="number"
                  required
                  className="input-admin"
                />

                <select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleChange}
                  required
                  className="input-admin"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.Id} value={cat.Id}>
                      {cat.Nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="subcategoriaId"
                  value={form.subcategoriaId}
                  onChange={handleChange}
                  disabled={!form.categoriaId}
                  className="input-admin"
                >
                  <option value="">Seleccionar subcategoría</option>
                  {subcategories.map((sub) => (
                    <option key={sub.Id} value={sub.Id}>
                      {sub.Nombre}
                    </option>
                  ))}
                </select>

                <select
                  name="marcaId"
                  value={form.marcaId}
                  onChange={handleChange}
                  required
                  className="input-admin"
                >
                  <option value="">Seleccionar marca</option>
                  {brands.map((brand) => (
                    <option key={brand.Id} value={brand.Id}>
                      {brand.Nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      imagen: e.target.files[0],
                    })
                  }
                  className="input-admin"
                />

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                  required
                  className="input-admin col-span-2 h-40 resize-none"
                />
              </div>

              <div className="flex items-center justify-between mt-10">
                <label className="flex items-center gap-3 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                    className="w-5 h-5 accent-blue-600"
                  />
                  Producto activo
                </label>

                <button
                  disabled={loading}
                  className={`
                    ${
                      editingId
                        ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                    }
                    disabled:opacity-60
                    transition-all
                    duration-300
                    text-white
                    font-bold
                    px-10
                    py-4
                    rounded-2xl
                    shadow-lg
                  `}
                >
                  {loading
                    ? "Guardando..."
                    : editingId
                    ? "Guardar Cambios"
                    : "Guardar Producto"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  )
}

export default Products