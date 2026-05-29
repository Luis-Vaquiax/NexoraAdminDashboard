import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { FiTag, FiArrowRight, FiBox, FiSearch } from "react-icons/fi"

function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const loadBrands = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/marcas")
      const data = await response.json()
      setBrands(data)
    } catch (error) {
      console.error("Error cargando marcas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const filteredBrands = brands.filter((brand) =>
    brand.Nombre.toLowerCase().includes(search.toLowerCase())
  )

  const totalProducts = brands.reduce(
    (acc, brand) => acc + Number(brand.TotalProductos || 0),
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.10),transparent_60%)] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/50 mb-2">
              Nexora · Marcas
            </p>
            <h1 className="text-[2.6rem] font-black leading-[1.05] tracking-tight mb-2">
              Marcas Nexora
            </h1>
            <p className="text-sm text-blue-100/80 max-w-sm leading-relaxed">
              Administra y visualiza las marcas disponibles en tu tienda.
            </p>
          </div>

          <div className="relative z-10 flex gap-3 flex-shrink-0">
            {[
              { n: loading ? "—" : brands.length, label: "Marcas" },
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

        {/* ── Search ── */}
        <div className="mt-6 relative">
          <FiSearch
            size={15}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full bg-white border border-[#eaecf4]
              rounded-2xl pl-11 pr-5 py-3.5
              text-sm text-gray-700 placeholder-gray-400
              outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50
              transition shadow-sm
            "
          />
        </div>

        {/* ── Section header ── */}
        <div className="flex items-center gap-3 mt-6 mb-5">
          <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
            Todas las marcas
          </span>
          <div className="flex-1 h-px bg-[#dde3f0]" />
          {!loading && (
            <span className="text-[12px] text-gray-400">
              {filteredBrands.length} resultados
            </span>
          )}
        </div>

        {/* ── Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-[24px] bg-gray-200 animate-pulse" />
            ))
          ) : filteredBrands.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-gray-400 text-sm">
              No se encontraron marcas para "{search}"
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <div
                key={brand.Id}
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
                    <FiTag />
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {Number(brand.TotalProductos || 0)} productos
                  </span>
                </div>

                {/* Name + desc */}
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mb-1">
                  {brand.Nombre}
                </h2>
                <p className="text-[13px] text-gray-400 leading-relaxed flex-1">
                  {brand.Descripcion || "Marca tecnológica disponible en Nexora."}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <FiBox size={13} />
                    Inventario conectado
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = `/productos?marca=${brand.Id}`
                    }}
                    className="
                      bg-indigo-600 hover:bg-indigo-700
                      text-white text-[13px] font-semibold
                      px-4 py-2 rounded-xl flex items-center gap-1.5
                      transition-all duration-150 hover:gap-2.5
                    "
                  >
                    Ver productos
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

export default Brands