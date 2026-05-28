import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login({ onLogin }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert("Completa todos los campos")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        "http://localhost:4000/api/usuarios/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      // Error login
      if (!response.ok) {
        alert(
          data.message ||
            "Error iniciando sesión"
        )

        return
      }

      // Validar rol admin
      if (data.user.role !== "Admin") {
        alert(
          "No tienes permisos de administrador"
        )

        return
      }

      // Guardar token
      localStorage.setItem(
        "nexora_token",
        data.token
      )

      // Guardar admin
      localStorage.setItem(
        "admin_user",
        JSON.stringify(data.user)
      )

      // Login dashboard
      localStorage.setItem(
        "adminLogged",
        "true"
      )

      onLogin()

      navigate("/")

    } catch (error) {

      console.error(
        "Error login:",
        error
      )

      alert(
        "Error conectando con el servidor"
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center px-4">
      {/* Fondo blur */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      {/* Card login */}
      <div className="relative bg-white w-full max-w-[520px] shadow-2xl rounded-[32px] px-10 py-10">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black">
            N
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Nexora Admin
            </h1>

            <p className="text-slate-500">
              Panel Administrativo
            </p>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-4xl font-black text-slate-900">
          Iniciar Sesión
        </h2>

        <p className="text-slate-500 mt-3">
          Ingresa tus credenciales de administrador.
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Correo */}
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 transition disabled:opacity-50"
          >
            {loading
              ? "Ingresando..."
              : "Ingresar al Dashboard"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          Nexora Admin Dashboard © 2026
        </div>
      </div>
    </div>
  )
}

export default Login