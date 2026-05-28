import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

function Sales() {
  return (
    <div className="flex bg-[#f8faff] min-h-screen">
      <Sidebar />

      <main className="flex-1 px-7 py-7">
        <Topbar />

        <section className="-mt-12">
          <h1 className="text-4xl font-black text-slate-900">
            Ventas
          </h1>

          <p className="text-slate-500 text-lg mt-3">
            Aquí se mostrarán las ventas reales de Nexora.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-8 mt-12 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black">
            Historial de ventas
          </h2>

          <p className="text-slate-500 mt-4">
            Página de ventas funcionando correctamente.
          </p>
        </section>
      </main>
    </div>
  )
}

export default Sales