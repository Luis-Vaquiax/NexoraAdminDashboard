import { useEffect, useMemo, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import {
  FiUsers, FiMail, FiPhone, FiCalendar, FiShield,
  FiEdit2, FiTrash2, FiSearch, FiX, FiSave,
  FiRefreshCw, FiPlus,
} from "react-icons/fi"

// ── Helpers ────────────────────────────────────────────────────────
const getInitials = (u) =>
  `${u.Name?.charAt(0) ?? ""}${u.LastName?.charAt(0) ?? ""}`.toUpperCase() || "U"

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("es-GT") : "Sin fecha"

// ── Badges ─────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const isAdmin = role === "Admin"
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide
      ${isAdmin
        ? "bg-slate-900 text-slate-100"
        : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
      <FiShield className="text-[10px]" />
      {role}
    </span>
  )
}

function StatusBadge({ estado }) {
  const active = (estado ?? "Activo") === "Activo"
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold
      ${active
        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
        : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {estado ?? "Activo"}
    </span>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────
function Avatar({ user }) {
  const isAdmin = user.Role === "Admin"
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold flex-shrink-0
      ${isAdmin ? "bg-slate-900 text-slate-100" : "bg-blue-50 text-blue-700"}`}>
      {getInitials(user)}
    </div>
  )
}

// ── Metric card ────────────────────────────────────────────────────
function MetricCard({ icon: Icon, iconBg, iconColor, label, value, badge, badgeClass }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 flex-1">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`text-base ${iconColor}`} />
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md ${badgeClass}`}>{badge}</span>
      </div>
      <p className="text-[11px] font-medium text-slate-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    </div>
  )
}

// ── Formulario compartido ──────────────────────────────────────────
function UserForm({ form, handleChange, showPasswordNote }) {
  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 transition"

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="Name" value={form.Name} onChange={handleChange}
          placeholder="Nombre" className={inputClass} required />
        <input name="LastName" value={form.LastName} onChange={handleChange}
          placeholder="Apellido" className={inputClass} required />
      </div>
      <input type="email" name="Email" value={form.Email} onChange={handleChange}
        placeholder="Correo electrónico" className={inputClass} required />
      <input name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange}
        placeholder="Teléfono" className={inputClass} />
      <div className="grid grid-cols-2 gap-3">
        <select name="Role" value={form.Role} onChange={handleChange} className={inputClass}>
          <option value="Cliente">Cliente</option>
          <option value="Admin">Admin</option>
        </select>
        <select name="Estado" value={form.Estado} onChange={handleChange} className={inputClass}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      {showPasswordNote && (
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-700">
          Contraseña temporal: <span className="font-bold">123456</span>
        </div>
      )}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────
function UserModal({ title, description, form, handleChange, onClose, onSubmit, submitText, showPasswordNote }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 w-full max-w-md p-6 border border-slate-100">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition">
            <FiX className="text-xs" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <UserForm form={form} handleChange={handleChange} showPasswordNote={showPasswordNote} />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              Cancelar
            </button>
            <button type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <FiSave className="text-[11px]" />
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────────
const FORM_DEFAULT = { Name: "", LastName: "", Email: "", PhoneNumber: "", Role: "Cliente", Estado: "Activo" }

function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(FORM_DEFAULT)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch("http://localhost:4000/api/usuarios")
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch {
      alert("No se pudieron cargar los usuarios.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) =>
      `${u.Name} ${u.LastName} ${u.Email} ${u.PhoneNumber} ${u.Role} ${u.Estado}`.toLowerCase().includes(q)
    )
  }, [users, search])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const closeModal = () => { setEditingUser(null); setShowCreate(false); setForm(FORM_DEFAULT) }

  const openEdit = (u) => {
    setForm({ Name: u.Name ?? "", LastName: u.LastName ?? "", Email: u.Email ?? "",
      PhoneNumber: u.PhoneNumber ?? "", Role: u.Role ?? "Cliente", Estado: u.Estado ?? "Activo" })
    setEditingUser(u)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.Name, lastName: form.LastName, email: form.Email,
          phoneNumber: form.PhoneNumber, password: "123456", role: form.Role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      await loadUsers(); closeModal()
    } catch (err) { alert(err.message || "No se pudo crear el usuario.") }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${editingUser.Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.Name, lastName: form.LastName, email: form.Email,
          phoneNumber: form.PhoneNumber, role: form.Role, estado: form.Estado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      await loadUsers(); closeModal()
    } catch (err) { alert(err.message || "No se pudo actualizar.") }
  }

  const handleDelete = async (u) => {
    if (!window.confirm(`¿Eliminar a ${u.Name} ${u.LastName}?`)) return
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${u.Id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      await loadUsers()
    } catch (err) { alert(err.message || "No se pudo eliminar.") }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 px-7 py-6 max-w-[1400px]">
        <Topbar />

        {/* Encabezado */}
        <section className="mt-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700
              bg-blue-50 border border-blue-100 rounded-md px-2.5 py-0.5">
              <FiUsers className="text-[10px]" /> Gestión de usuarios
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Usuarios</h1>
            <p className="mt-1 text-xs text-slate-400">
              Administra, crea, edita y elimina usuarios registrados en Nexora.
            </p>
          </div>

          {/* Buscador */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full xl:w-80">
            <FiSearch className="text-slate-300 flex-shrink-0 text-sm" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-500 transition">
                <FiX className="text-xs" />
              </button>
            )}
          </div>
        </section>

        {/* Métricas */}
        <section className="mt-5 flex gap-4">
          <MetricCard icon={FiUsers} iconBg="bg-blue-50" iconColor="text-blue-600"
            label="Usuarios registrados" value={users.length}
            badge="Total" badgeClass="bg-slate-100 text-slate-500" />
          <MetricCard icon={FiShield} iconBg="bg-slate-900" iconColor="text-slate-100"
            label="Administradores" value={users.filter((u) => u.Role === "Admin").length}
            badge="Admin" badgeClass="bg-slate-800 text-slate-200" />
          <MetricCard icon={FiUsers} iconBg="bg-emerald-50" iconColor="text-emerald-600"
            label="Usuarios activos" value={users.filter((u) => (u.Estado ?? "Activo") === "Activo").length}
            badge="Activos" badgeClass="bg-emerald-50 text-emerald-700 border border-emerald-100" />
        </section>

        {/* Tabla */}
        <section className="mt-5 bg-white border border-slate-100 rounded-2xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Lista de usuarios</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} encontrados</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <FiPlus className="text-[11px]" /> Nuevo usuario
              </button>
              <button onClick={loadUsers}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                <FiRefreshCw className={`text-[11px] ${loading ? "animate-spin" : ""}`} /> Actualizar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Cliente", "Correo", "Teléfono", "Rol", "Estado", "Registro", ""].map((h, i) => (
                    <th key={i}
                      className="px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                      style={{ textAlign: i === 6 ? "center" : "left" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.Id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                    {/* Cliente */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={u} />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{u.Name} {u.LastName}</p>
                          <p className="text-[10px] text-slate-400">ID #{u.Id}</p>
                        </div>
                      </div>
                    </td>
                    {/* Correo */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiMail className="text-slate-300 flex-shrink-0 text-[11px]" />
                        {u.Email}
                      </span>
                    </td>
                    {/* Teléfono */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiPhone className="text-slate-300 flex-shrink-0 text-[11px]" />
                        {u.PhoneNumber || "—"}
                      </span>
                    </td>
                    {/* Rol */}
                    <td className="px-4 py-3"><RoleBadge role={u.Role} /></td>
                    {/* Estado */}
                    <td className="px-4 py-3"><StatusBadge estado={u.Estado} /></td>
                    {/* Fecha */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiCalendar className="text-slate-300 flex-shrink-0 text-[11px]" />
                        {fmtDate(u.CreatedAt)}
                      </span>
                    </td>
                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(u)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600
                            hover:bg-amber-100 transition" aria-label="Editar usuario">
                          <FiEdit2 className="text-[11px]" />
                        </button>
                        <button onClick={() => handleDelete(u)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500
                            hover:bg-red-100 transition" aria-label="Eliminar usuario">
                          <FiTrash2 className="text-[11px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="py-10 text-center text-xs text-slate-400">Cargando usuarios...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                No hay usuarios que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </section>
      </main>

      {editingUser && (
        <UserModal title="Editar usuario" description="Actualiza la información del usuario."
          form={form} handleChange={handleChange} onClose={closeModal}
          onSubmit={handleUpdate} submitText="Guardar cambios" showPasswordNote={false} />
      )}
      {showCreate && (
        <UserModal title="Nuevo usuario" description="Registra un nuevo cliente o administrador."
          form={form} handleChange={handleChange} onClose={closeModal}
          onSubmit={handleCreate} submitText="Crear usuario" showPasswordNote={true} />
      )}
    </div>
  )
}

export default Users