import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

function Orders() {
  return (
    <div className="flex bg-[#f8faff] min-h-screen">
      <Sidebar />
      <main className="flex-1 px-7 py-7">
        <Topbar />
        <h1 className="text-4xl font-bold mt-8">Productos</h1>
        <p className="text-slate-600 mt-2">Aquí agregaremos, editaremos y eliminaremos productos.</p>
      </main>
    </div>
  )
}

export default Orders