import { FiBell, FiChevronDown, FiMenu, FiSearch, FiCalendar } from "react-icons/fi"

function Topbar() {
  return (
    <>
      <div className="flex items-center justify-between">
        <button className="text-3xl text-slate-900">
          <FiMenu />
        </button>

        <div className="flex items-center gap-8">
          <div className="w- [300px] h- [55px] bg-white border border-slate-200 rounded-xl flex items-center gap-4 px-5">
            <FiSearch className="text-2xl text-slate-900" />
            <input
              type="text"
              placeholder="Buscar..."
              className="outline-none w-full text-slate-600"
            />
          </div>

          <button className="text-3xl text-slate-900">
            <FiBell />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              className="w-14 h-14 rounded-full bg-slate-100"
            />
            <div>
              <h3 className="font-bold text-slate-900">Admin</h3>
              <p className="text-sm text-slate-500">Administrador</p>
            </div>
            <FiChevronDown className="text-xl" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex items-center gap-4 font-semibold text-slate-900">
          <FiCalendar className="text-xl" />
          Del 01 al 31 de mayo 2026
          <FiChevronDown />
        </button>
      </div>
    </>
  )
}

export default Topbar