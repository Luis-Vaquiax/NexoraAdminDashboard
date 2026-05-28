import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { FiTag, FiArrowRight, FiBox } from "react-icons/fi"

function Brands() {
  const [brands, setBrands] = useState([])
  const [search, setSearch] = useState("")

  const loadBrands = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/marcas")
      const data = await response.json()
      setBrands(data)
    } catch (error) {
      console.error("Error cargando marcas:", error)
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
    <div className="flex bg-[#f8faff] min-h-screen">
      <Sidebar />

      <main className="flex-1 px-7 py-7">
        <Topbar />

        <section className="mt-8 rounded-[35px] p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-2xl">
          <h1 className="text-5xl font-black">Marcas Nexora</h1>

          <p className="mt-4 text-blue-100">
            Administra y visualiza las marcas disponibles en tu tienda.
          </p>

          <div className="flex gap-10 mt-8">
            <div>
              <p className="text-4xl font-black">{brands.length}</p>
              <span className="text-blue-100">Marcas</span>
            </div>

            <div>
              <p className="text-4xl font-black">{totalProducts}</p>
              <span className="text-blue-100">Productos</span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <input
            type="text"
            placeholder="Buscar marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
          {filteredBrands.map((brand) => (
            <div
              key={brand.Id}
              className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">
                  <FiTag />
                </div>

                <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-semibold text-slate-600">
                  {Number(brand.TotalProductos || 0)} productos
                </div>
              </div>

              <h2 className="text-3xl font-black text-slate-900 mt-7">
                {brand.Nombre}
              </h2>

              <p className="text-slate-500 mt-3">
                {brand.Descripcion || "Marca tecnológica disponible en Nexora."}
              </p>

              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <FiBox />
                  Inventario conectado
                </div>

                <button
                  onClick={() => {
                    window.location.href = `/productos?marca=${brand.Id}`
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl flex items-center gap-2 transition"
                >
                  Ver productos
                  <FiArrowRight />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Brands