import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { FiGrid, FiArrowRight, FiBox } from "react-icons/fi"

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categorias")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error cargando categorías:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const totalProducts = categories.reduce(
    (acc, cat) => acc + Number(cat.TotalProductos || 0),
    0
  )

  return (
    <div className="flex bg-[#f1f5fb] min-h-screen">
      <Sidebar />

      <main className="flex-1 px-8 py-7">
        <Topbar />

        {/* ── Hero ── */}
        <section
          className="
            mt-8 rounded-[28px] p-10
            bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600
            text-white flex items-end justify-between gap-6 relative overflow-hidden
          "
        >
          {/* Subtle highlight overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.10),transparent_60%)] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/50 mb-2">
              Nexora · Catálogo
            </p>
            <h1 className="text-[2.6rem] font-black leading-[1.05] tracking-tight mb-2">
              Explora las Categorías
            </h1>
            <p className="text-sm text-blue-100/80 max-w-sm leading-relaxed">
              Organiza y administra todos los productos tecnológicos disponibles en Nexora.
            </p>
          </div>

          <div className="relative z-10 flex gap-3 flex-shrink-0">
            {[
              { n: loading ? "—" : categories.length, label: "Categorías" },
              { n: loading ? "—" : totalProducts, label: "Productos" },
            ].map(({ n, label }) => (
              <div
                key={label}
                className="
                  bg-white/10 border border-white/20 rounded-2xl
                  px-6 py-4 text-center min-w-[96px] backdrop-blur-sm
                "
              >
                <p className="text-3xl font-black leading-none tracking-tight">{n}</p>
                <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1 font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section header ── */}
        <div className="flex items-center gap-3 mt-8 mb-5">
          <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
            Todas las categorías
          </span>
          <div className="flex-1 h-px bg-[#dde3f0]" />
          {!loading && (
            <span className="text-[12px] text-gray-400">{categories.length} resultados</span>
          )}
        </div>

        {/* ── Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            // Skeleton cards
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-[24px] bg-gray-200 animate-pulse"
              />
            ))
          ) : (
            categories.map((category) => (
              <div
                key={category.Id}
                className="
                  bg-white rounded-[24px] p-6 border border-[#eaecf4]
                  flex flex-col
                  hover:shadow-[0_16px_48px_rgba(79,70,229,0.12)]
                  hover:-translate-y-1 transition-all duration-200
                "
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-[14px] bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                    <FiGrid />
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {Number(category.TotalProductos || 0)} productos
                  </span>
                </div>

                {/* Name + desc */}
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mb-1">
                  {category.Nombre}
                </h2>
                <p className="text-[13px] text-gray-400 leading-relaxed flex-1">
                  {category.Descripcion || "Categoría tecnológica disponible en Nexora."}
                </p>

                {/* Subcategorías chip */}
                <div className="mt-4">
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {category.TotalSubcategorias} subcategorías
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <FiBox size={13} />
                    Inventario conectado
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = `/productos?categoria=${category.Id}`
                    }}
                    className="
                      bg-indigo-600 hover:bg-indigo-700
                      text-white text-[13px] font-semibold
                      px-4 py-2 rounded-xl flex items-center gap-1.5
                      transition-all duration-150 hover:gap-2.5
                    "
                  >
                    Ver categoría
                    <FiArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  )
}