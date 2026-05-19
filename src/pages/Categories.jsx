import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

import {
  FiGrid,
  FiArrowRight,
  FiBox,
} from "react-icons/fi"

export default function Categories() {

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar categorías desde la API
  const loadCategories = async () => {

    try {

      const response = await fetch(
        "http://localhost:4000/api/categorias"
      )

      const data = await response.json()

      setCategories(data)

    } catch (error) {

      console.error(
        "Error cargando categorías:",
        error
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="flex bg-[#f6f8ff] min-h-screen">

      <Sidebar />

      <main className="flex-1 px-8 py-7">

        <Topbar />

        {/* Banner superior */}
        <section className="
          mt-8
          rounded-[35px]
          p-10
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-violet-600
          text-white
          shadow-2xl
        ">

          <div className="max-w-3xl">

            <h1 className="text-5xl font-black leading-tight">
              Explora las Categorías
            </h1>

            <p className="mt-4 text-lg text-blue-100">
              Organiza y administra todos los productos
              tecnológicos disponibles en Nexora.
            </p>

            <div className="flex gap-8 mt-8">

              <div>
                <p className="text-4xl font-black">
                  {categories.length}
                </p>

                <span className="text-blue-100">
                  Categorías
                </span>
              </div>

              <div>
                <p className="text-4xl font-black">
                  {categories.reduce(
  (acc, cat) => acc + Number(cat.TotalProductos || 0),
  0
)}
                </p>

                <span className="text-blue-100">
                  Productos
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* Grid de categorías */}
        <section className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
          mt-10
        ">

          {loading ? (

            <p>Cargando categorías...</p>

          ) : (

            categories.map((category) => (

              <div
                key={category.Id}
                className="
                  bg-white
                  rounded-[30px]
                  p-8
                  shadow-sm
                  border
                  border-slate-100
                  hover:shadow-2xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                {/* Header */}
                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <div className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                    text-3xl
                  ">
                    <FiGrid />
                  </div>

                  <div className="
                    bg-slate-100
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    text-slate-600
                  ">
                    {Number(category.TotalProductos || 0)} productos
                  </div>

                </div>

                {/* Nombre */}
                <h2 className="
                  text-3xl
                  font-black
                  text-slate-900
                  mt-7
                ">
                  {category.Nombre}
                </h2>

                {/* Descripción */}
                <p className="
                  text-slate-500
                  mt-3
                  leading-relaxed
                ">
                  {category.Descripcion ||
                    "Categoría tecnológica disponible en Nexora."
                  }
                </p>

                {/* Subcategorías */}
                <div className="
                  flex
                  flex-wrap
                  gap-3
                  mt-6
                ">

                  <span className="
                    bg-blue-50
                    text-blue-600
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                  ">
                    {category.TotalSubcategorias}
                    {" "}
                    subcategorías
                  </span>

                </div>

                {/* Footer */}
                <div className="
                  flex
                  items-center
                  justify-between
                  mt-8
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-slate-500
                    text-sm
                  ">
                    <FiBox />
                    Inventario conectado
                  </div>

                 <button
  onClick={() => {
    window.location.href =
      `/productos?categoria=${category.Id}`
  }}
  className="
    bg-blue-600
    hover:bg-blue-700
    text-white
    font-semibold
    px-5
    py-3
    rounded-2xl
    flex
    items-center
    gap-2
    transition
  "
>
  Ver categoría
  <FiArrowRight />
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