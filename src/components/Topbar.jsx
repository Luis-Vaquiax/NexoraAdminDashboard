import { useState } from "react"
import { FiBell, FiChevronDown, FiMenu, FiSearch, FiLogOut } from "react-icons/fi"

function Topbar({ onFilterDates }) {
  const admin = JSON.parse(localStorage.getItem("admin_user")) || {}
  const [search, setSearch]     = useState("")
  const [showDates, setShowDates] = useState(false)
  const [desde, setDesde]       = useState("")
  const [hasta, setHasta]       = useState("")

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      window.location.href = `/buscar?q=${encodeURIComponent(search)}`
    }
  }

  const applyDates = () => {
    if (!desde || !hasta) { alert("Selecciona ambas fechas"); return }
    onFilterDates?.({ desde, hasta })
    setShowDates(false)
  }

  const logout = () => {
    localStorage.removeItem("adminLogged")
    localStorage.removeItem("admin_user")
    localStorage.removeItem("nexora_token")
    window.location.href = "/login"
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Menu */}
      <button className="text-2xl text-gray-700 hover:text-gray-900 transition">
        <FiMenu />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        {/* Search */}
        <div className="flex items-center bg-white border border-[#eaecf4] rounded-2xl overflow-hidden shadow-sm h-11 w-[380px]">
          <span className="px-4 text-gray-400 text-base flex-shrink-0">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Buscar productos, marcas, pedidos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 h-full"
          />
          <button
            onClick={() => search.trim() && (window.location.href = `/buscar?q=${encodeURIComponent(search)}`)}
            className="w-14 h-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-base transition flex-shrink-0"
          >
            <FiSearch />
          </button>
        </div>

        {/* Notificaciones */}
        <button className="relative text-xl text-gray-600 hover:text-gray-900 transition">
          <FiBell />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Perfil */}
        <div className="relative group">
          <button className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name || "Admin"}`}
              className="w-10 h-10 rounded-full bg-gray-100 border border-[#eaecf4]"
            />
            <div className="text-left hidden sm:block">
              <p className="text-[11px] text-gray-400 font-medium">Bienvenido</p>
              <h3 className="text-sm font-extrabold text-gray-900 leading-tight">
                {admin.name || "Admin"}
              </h3>
            </div>
            <FiChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Dropdown */}
          <div className="
            absolute right-0 top-14 w-72 bg-white rounded-[20px]
            shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-[#eaecf4]
            p-5 hidden group-hover:block z-50
          ">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name || "Admin"}`}
                className="w-12 h-12 rounded-full bg-gray-100 border border-[#eaecf4]"
              />
              <div>
                <h2 className="font-extrabold text-gray-900 text-base leading-tight">
                  {admin.name} {admin.lastName}
                </h2>
                <p className="text-[12px] text-gray-400 mt-0.5">{admin.email}</p>
                <p className="text-[12px] text-indigo-600 font-semibold mt-0.5">{admin.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="
                mt-4 w-full bg-red-50 hover:bg-red-100 text-red-500
                py-3 rounded-xl flex items-center justify-center gap-2
                text-sm font-semibold transition
              "
            >
              <FiLogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar