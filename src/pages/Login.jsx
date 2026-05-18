import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    localStorage.setItem("adminLogged", "true")
    onLogin()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <div className="relative bg-white w-full max-w-[520px] shadow-2xl px-10 py-10">
        <h1 className="text-4xl font-black text-slate-900">
          {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
        </h1>

        <p className="text-slate-500 mt-3">
          {isRegister ? "Completa tus datos para registrarte." : "Bienvenido de nuevo a "}
          {!isRegister && <span className="text-blue-600 font-bold">Nexora</span>}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Nombre" className="auth-input" />
              <input placeholder="Apellido" className="auth-input" />
            </div>
          )}

          <input
            placeholder="correo@ejemplo.com"
            type="email"
            className="auth-input"
          />

          {isRegister && (
            <input placeholder="Número de teléfono" className="auth-input" />
          )}

          <input
            placeholder="Contraseña"
            type="password"
            className="auth-input"
          />

          {isRegister && (
            <input
              placeholder="Confirmar contraseña"
              type="password"
              className="auth-input"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 transition"
          >
            {isRegister ? "Crear Cuenta" : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 font-bold"
          >
            {isRegister ? "Inicia sesión" : "Regístrate gratis"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login