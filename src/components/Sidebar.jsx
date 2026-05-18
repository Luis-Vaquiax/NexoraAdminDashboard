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
} from "react-icons/fi"

const menu = [
  { name: "Dashboard", path: "/", icon: <FiGrid /> },
  { name: "Productos", path: "/productos", icon: <FiBox /> },
  { name: "Categorías", path: "/categorias", icon: <FiFolder /> },
  { name: "Marcas", path: "/marcas", icon: <FiTag /> },
  { name: "Pedidos", path: "/pedidos", icon: <FiCalendar /> },
  { name: "Clientes", path: "/clientes", icon: <FiUsers /> },
  { name: "Ofertas", path: "/ofertas", icon: <FiTag /> },
  { name: "Configuración", path: "/configuracion", icon: <FiSettings /> },
]

function Sidebar() {
  return (
    <aside className="w- [280px] bg-white min-h-screen px-5 py-8 border-r border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 text-blue-600 mb-12">
          <FiShoppingBag className="text-4xl" />
          <h1 className="text-4xl font-bold">Nexora</h1>
        </div>

        <nav className="space-y-4">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-xl text-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-900 hover:bg-slate-100"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-4 text-red-500 font-semibold px-5 py-4 hover:bg-red-50 rounded-xl">
        <FiLogOut className="text-2xl" />
        Cerrar sesión
      </button>
    </aside>
  )
}

export default Sidebar