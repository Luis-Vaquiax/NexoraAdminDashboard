import { NavLink } from "react-router-dom"

import {
  FiGrid,
  FiBox,
  FiFolder,
  FiTag,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi"

// Menú principal del Dashboard Admin
const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: <FiGrid />,
  },
  {
    name: "Productos",
    path: "/productos",
    icon: <FiBox />,
  },
  {
    name: "Categorías",
    path: "/categorias",
    icon: <FiFolder />,
  },
  {
    name: "Marcas",
    path: "/marcas",
    icon: <FiTag />,
  },
  {
    name: "Pedidos",
    path: "/pedidos",
    icon: <FiCalendar />,
  },

  // Nueva sección para ventas
  {
    name: "Ventas",
    path: "/ventas",
    icon: <FiDollarSign />,
  },

  {
    name: "Usuarios",
    path: "/usuarios",
    icon: <FiUsers />,
  },
  {
    name: "Ofertas",
    path: "/ofertas",
    icon: <FiTag />,
  },
  {
    name: "Configuración",
    path: "/configuracion",
    icon: <FiSettings />,
  },
]

function Sidebar() {
  const admin =
    JSON.parse(localStorage.getItem("admin_user")) || {}

  // Cerrar sesión del administrador
  const handleLogout = () => {
    localStorage.removeItem("adminLogged")
    localStorage.removeItem("admin_user")
    localStorage.removeItem("nexora_token")

    window.location.href = "/login"
  }

  return (
    <aside className="w-[280px] bg-white min-h-screen px-5 py-8 border-r border-slate-100 flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 text-blue-600 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <FiShoppingBag className="text-3xl" />
          </div>

          <div>
            <h1 className="text-4xl font-black">
              Nexora
            </h1>

            <p className="text-slate-400 text-sm">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Información del admin logueado */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg">
            {admin.name || "Admin"}
          </h2>

          <p className="text-slate-500 text-sm">
            {admin.role || "Administrador"}
          </p>
        </div>

        {/* Menú */}
        <nav className="space-y-4">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl text-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <span className="text-2xl">
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 text-red-500 font-semibold px-5 py-4 hover:bg-red-50 rounded-2xl transition"
      >
        <FiLogOut className="text-2xl" />
        Cerrar sesión
      </button>
    </aside>
  )
}

export default Sidebar