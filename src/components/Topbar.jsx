import { useState } from "react"

import {
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSearch,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi"

function Topbar({
  onFilterDates,
}) {

  const admin =
    JSON.parse(
      localStorage.getItem(
        "admin_user"
      )
    ) || {}

  const [search, setSearch] =
    useState("")

  const [showDates, setShowDates] =
    useState(false)

  const [desde, setDesde] =
    useState("")

  const [hasta, setHasta] =
    useState("")

  // Buscar
  const handleSearch = (e) => {

    if (
      e.key === "Enter" &&
      search.trim() !== ""
    ) {

      window.location.href =
        `/buscar?q=${encodeURIComponent(
          search
        )}`

    }

  }

  // Aplicar filtro fechas
  const applyDates = () => {

    if (!desde || !hasta) {
      alert(
        "Selecciona ambas fechas"
      )
      return
    }

    onFilterDates({
      desde,
      hasta,
    })

    setShowDates(false)

  }

  // Logout
  const logout = () => {

    localStorage.removeItem(
      "adminLogged"
    )

    localStorage.removeItem(
      "admin_user"
    )

    localStorage.removeItem(
      "nexora_token"
    )

    window.location.href =
      "/login"

  }

  return (
    <>
      <div className="flex items-center justify-between">

        {/* MENU */}
        <button className="text-3xl text-slate-900">
          <FiMenu />
        </button>

        <div className="flex items-center gap-8">

          {/* SEARCH */}
          <div className="w-[420px] h-[60px] bg-white border border-slate-200 rounded-2xl flex items-center overflow-hidden shadow-sm">

            <div className="px-5 text-2xl text-slate-500">
              <FiSearch />
            </div>

            <input
              type="text"
              placeholder="Buscar productos, marcas, pedidos..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              onKeyDown={
                handleSearch
              }
              className="flex-1 outline-none h-full text-slate-700"
            />

            <button className="w-[70px] h-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-2xl transition">
              <FiSearch />
            </button>

          </div>

          {/* NOTIFICACIONES */}
          <button className="text-3xl text-slate-700 relative">

            <FiBell />

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>

          </button>

          {/* PERFIL */}
          <div className="relative group">

            <button className="flex items-center gap-4">

              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name || "Admin"}`}
                className="w-14 h-14 rounded-full bg-slate-100 border"
              />

              <div className="text-left">

                <p className="text-sm text-slate-400">
                  Bienvenido
                </p>

                <h3 className="font-black text-slate-900">
                  {admin.name || "Admin"}
                </h3>

              </div>

              <FiChevronDown />

            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-20 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 hidden group-hover:block z-50">

              <div className="flex items-center gap-4 border-b pb-5">

                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name || "Admin"}`}
                  className="w-16 h-16 rounded-full bg-slate-100 border"
                />

                <div>

                  <h2 className="font-black text-slate-900 text-xl">
                    {admin.name}{" "}
                    {admin.lastName}
                  </h2>

                  <p className="text-slate-500 text-sm">
                    {admin.email}
                  </p>

                  <p className="text-blue-600 font-bold text-sm mt-1">
                    {admin.role}
                  </p>

                </div>

              </div>

              <button
                onClick={logout}
                className="mt-5 w-full bg-red-50 hover:bg-red-100 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition"
              >

                <FiLogOut />

                Cerrar sesión

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* FECHAS */}
      <div className="flex justify-end mt-10 relative">

        <button

          onClick={() =>
            setShowDates(
              !showDates
            )
          }

          className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex items-center gap-4 font-semibold text-slate-900 shadow-sm"

        >

          <FiCalendar className="text-xl" />

          Filtrar por fechas

          <FiChevronDown />

        </button>

        {/* Modal fechas */}
        {showDates && (

          <div className="absolute top-20 right-0 w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50">

            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Filtrar Dashboard
            </h2>

            <div className="space-y-5">

              <div>

                <label className="block text-sm font-bold mb-2">
                  Desde
                </label>

                <input
                  type="date"
                  value={desde}
                  onChange={(e) =>
                    setDesde(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                />

              </div>

              <div>

                <label className="block text-sm font-bold mb-2">
                  Hasta
                </label>

                <input
                  type="date"
                  value={hasta}
                  onChange={(e) =>
                    setHasta(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                />

              </div>

              <button

                onClick={applyDates}

                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition"

              >

                Aplicar filtro

              </button>

            </div>

          </div>

        )}

      </div>
    </>
  )
}

export default Topbar