import { useEffect, useMemo, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

import {
  FiUsers,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiSave,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi"

function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    Name: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Role: "Cliente",
    Estado: "Activo",
  })

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:4000/api/usuarios")
      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando usuarios:", error)
      alert("No se pudieron cargar los usuarios.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text = `
        ${user.Name || ""}
        ${user.LastName || ""}
        ${user.Email || ""}
        ${user.PhoneNumber || ""}
        ${user.Role || ""}
        ${user.Estado || ""}
      `.toLowerCase()

      return text.includes(search.toLowerCase())
    })
  }, [users, search])

  const totalAdmins = users.filter((user) => user.Role === "Admin").length

  const totalActivos = users.filter(
    (user) => (user.Estado || "Activo") === "Activo"
  ).length

  const resetForm = () => {
    setForm({
      Name: "",
      LastName: "",
      Email: "",
      PhoneNumber: "",
      Role: "Cliente",
      Estado: "Activo",
    })
  }

  const openEditModal = (user) => {
    setEditingUser(user)

    setForm({
      Name: user.Name || "",
      LastName: user.LastName || "",
      Email: user.Email || "",
      PhoneNumber: user.PhoneNumber || "",
      Role: user.Role || "Cliente",
      Estado: user.Estado || "Activo",
    })
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const closeModal = () => {
    setEditingUser(null)
    setShowCreateModal(false)
    resetForm()
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.Name,
          lastName: form.LastName,
          email: form.Email,
          phoneNumber: form.PhoneNumber,
          password: "123456",
          role: form.Role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error creando usuario")
      }

      await loadUsers()
      closeModal()
      alert("Usuario creado correctamente")
    } catch (error) {
      console.error("Error creando usuario:", error)
      alert(error.message || "No se pudo crear el usuario.")
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `http://localhost:4000/api/usuarios/${editingUser.Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.Name,
            lastName: form.LastName,
            email: form.Email,
            phoneNumber: form.PhoneNumber,
            role: form.Role,
            estado: form.Estado,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "No se pudo actualizar el usuario")
      }

      await loadUsers()
      closeModal()
      alert("Usuario actualizado correctamente")
    } catch (error) {
      console.error("Error actualizando usuario:", error)
      alert(error.message || "No se pudo actualizar el usuario.")
    }
  }

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar a ${user.Name} ${user.LastName}?`
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(
        `http://localhost:4000/api/usuarios/${user.Id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "No se pudo eliminar el usuario")
      }

      await loadUsers()
      alert("Usuario eliminado correctamente")
    } catch (error) {
      console.error("Error eliminando usuario:", error)
      alert(error.message || "No se pudo eliminar el usuario.")
    }
  }

  const getInitials = (user) => {
    const name = user.Name?.charAt(0) || ""
    const lastName = user.LastName?.charAt(0) || ""
    return `${name}${lastName}`.toUpperCase() || "U"
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6ff] text-[#071735]">
      <Sidebar />

      <main className="flex-1 px-8 py-7">
        <Topbar />

        <section className="mt-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div>
            <span className="badge-blue">
              <FiUsers />
              Gestión de usuarios
            </span>

            <h1 className="title-main mt-3">Usuarios</h1>

            <p className="mt-3 text-[15px] font-semibold text-slate-500">
              Administra, crea, edita y elimina usuarios registrados en Nexora.
            </p>
          </div>

          <div className="searchbar w-full xl:w-[460px]">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="searchbar-input"
            />

            <button type="button" className="searchbar-button">
              <FiSearch className="text-xl" />
            </button>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card-premium p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FiUsers className="text-3xl" />
              </div>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                Total
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-500">
              Usuarios registrados
            </p>

            <h2 className="mt-1 text-5xl font-extrabold tracking-tight text-[#071735]">
              {users.length}
            </h2>
          </div>

          <div className="card-premium p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <FiShield className="text-3xl" />
              </div>

              <span className="badge-dark">Admin</span>
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-500">
              Administradores
            </p>

            <h2 className="mt-1 text-5xl font-extrabold tracking-tight text-[#071735]">
              {totalAdmins}
            </h2>
          </div>

          <div className="card-premium p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <FiUsers className="text-3xl" />
              </div>

              <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-600">
                Activos
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold text-slate-500">
              Usuarios activos
            </p>

            <h2 className="mt-1 text-5xl font-extrabold tracking-tight text-[#071735]">
              {totalActivos}
            </h2>
          </div>
        </section>

        <section className="card-premium mt-8 p-7">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="title-section">Lista de usuarios</h2>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Total encontrados: {filteredUsers.length}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={openCreateModal}
                className="btn-primary w-fit"
              >
                <FiPlus />
                Nuevo usuario
              </button>

              <button
                type="button"
                onClick={loadUsers}
                className="btn-secondary w-fit"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                Actualizar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1160px] border-collapse text-left">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-4">Cliente</th>
                  <th className="px-4 py-4">Correo</th>
                  <th className="px-4 py-4">Teléfono</th>
                  <th className="px-4 py-4">Rol</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-4 py-4">Fecha registro</th>
                  <th className="px-4 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.Id} className="table-row">
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-sm font-extrabold text-blue-600">
                          {getInitials(user)}
                        </div>

                        <div>
                          <p className="text-[13px] font-extrabold text-[#071735]">
                            {user.Name} {user.LastName}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-400">
                            ID #{user.Id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                        <FiMail className="text-slate-400" />
                        {user.Email}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                        <FiPhone className="text-slate-400" />
                        {user.PhoneNumber || "Sin teléfono"}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={
                          user.Role === "Admin" ? "badge-dark" : "badge-blue"
                        }
                      >
                        <FiShield />
                        {user.Role}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-600">
                        {user.Estado || "Activo"}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                        <FiCalendar className="text-slate-400" />
                        {user.CreatedAt
                          ? new Date(user.CreatedAt).toLocaleDateString()
                          : "Sin fecha"}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff6d9] text-[#d4a100] transition hover:scale-105"
                          title="Editar usuario"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe5e5] text-[#ff4d4f] transition hover:scale-105"
                          title="Eliminar usuario"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="py-12 text-center text-sm font-semibold text-slate-500">
                Cargando usuarios...
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="py-14 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  No hay usuarios registrados todavía.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {editingUser && (
        <UserModal
          title="Editar usuario"
          description="Actualiza la información del usuario seleccionado."
          form={form}
          handleChange={handleChange}
          onClose={closeModal}
          onSubmit={handleUpdateUser}
          submitText="Guardar cambios"
          showPasswordNote={false}
        />
      )}

      {showCreateModal && (
        <UserModal
          title="Nuevo usuario"
          description="Registra un nuevo cliente o administrador."
          form={form}
          handleChange={handleChange}
          onClose={closeModal}
          onSubmit={handleCreateUser}
          submitText="Crear usuario"
          showPasswordNote={true}
        />
      )}
    </div>
  )
}

function UserModal({
  title,
  description,
  form,
  handleChange,
  onClose,
  onSubmit,
  submitText,
  showPasswordNote,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="modal-premium w-full max-w-xl p-8">
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="title-section">{title}</h2>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              {description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              name="Name"
              value={form.Name}
              onChange={handleChange}
              placeholder="Nombre"
              className="input-admin"
              required
            />

            <input
              name="LastName"
              value={form.LastName}
              onChange={handleChange}
              placeholder="Apellido"
              className="input-admin"
              required
            />
          </div>

          <input
            type="email"
            name="Email"
            value={form.Email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="input-admin"
            required
          />

          <input
            name="PhoneNumber"
            value={form.PhoneNumber}
            onChange={handleChange}
            placeholder="Teléfono"
            className="input-admin"
          />

          <select
            name="Role"
            value={form.Role}
            onChange={handleChange}
            className="input-admin"
          >
            <option value="Cliente">Cliente</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            name="Estado"
            value={form.Estado}
            onChange={handleChange}
            className="input-admin"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          {showPasswordNote && (
            <div className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-600">
              Contraseña temporal: <b>123456</b>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>

            <button type="submit" className="btn-primary">
              <FiSave />
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Users