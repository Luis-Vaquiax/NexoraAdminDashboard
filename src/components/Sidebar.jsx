import { NavLink } from "react-router-dom"
import {
  FiGrid, FiBox, FiFolder, FiTag, FiCalendar,
  FiUsers, FiSettings, FiLogOut, FiShoppingBag, FiDollarSign,
} from "react-icons/fi"

const menu = [
  { name: "Dashboard",    path: "/",             icon: <FiGrid /> },
  { name: "Productos",    path: "/productos",    icon: <FiBox /> },
  { name: "Categorías",   path: "/categorias",   icon: <FiFolder /> },
  { name: "Marcas",       path: "/marcas",       icon: <FiTag /> },
  { name: "Pedidos",      path: "/pedidos",      icon: <FiCalendar /> },
  { name: "Ventas",       path: "/ventas",       icon: <FiDollarSign /> },
  { name: "Usuarios",     path: "/usuarios",     icon: <FiUsers /> },
  { name: "Ofertas",      path: "/ofertas",      icon: <FiTag /> },
]

function Sidebar() {
  const admin = JSON.parse(localStorage.getItem("admin_user")) || {}

  const handleLogout = () => {
    localStorage.removeItem("adminLogged")
    localStorage.removeItem("admin_user")
    localStorage.removeItem("nexora_token")
    window.location.href = "/login"
  }

  return (
    <aside className="w-[260px] bg-white sticky top-0 h-screen overflow-y-auto flex-shrink-0
      px-4 py-7 border-r border-slate-100 flex flex-col justify-between">

      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <FiShoppingBag className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-600 leading-none">Nexora</h1>
            <p className="text-xs text-slate-400 mt-0.5">Admin Dashboard</p>
          </div>
        </div>

        {/* Info admin */}
        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6 border border-slate-100">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {admin.name || "Admin"}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {admin.role || "Administrador"}
          </p>
        </div>

        {/* Menú */}
        <nav className="space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500
          hover:bg-red-50 rounded-xl transition w-full"
      >
        <FiLogOut className="text-base flex-shrink-0" />
        Cerrar sesión
      </button>
    </aside>
  )
}

export default Sidebar