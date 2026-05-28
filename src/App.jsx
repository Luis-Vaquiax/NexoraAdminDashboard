import { useState } from "react"

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

//Paginas
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import Brands from "./pages/Brands"
import Orders from "./pages/Orders"
import Sales from "./pages/Sales" 
import Users from "./pages/Users"
import Offers from "./pages/Offers"
import Settings from "./pages/Settings"

function App() {

  // ===============================
  // VALIDAR LOGIN ADMIN
  // ===============================
  const [isLogged, setIsLogged] = useState(

    localStorage.getItem(
      "adminLogged"
    ) === "true" &&

    localStorage.getItem(
      "admin_user"
    )

  )

  // ===============================
  // PROTEGER RUTAS
  // ===============================
  const ProtectedRoute = ({
    children,
  }) => {

    if (!isLogged) {

      return (
        <Navigate
          to="/login"
          replace
        />
      )

    }

    return children

  }

  return (

    <BrowserRouter>

      <Routes>

        {/* ========================================
            LOGIN
        ======================================== */}
        <Route

          path="/login"

          element={

            isLogged ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Login
                onLogin={() =>
                  setIsLogged(true)
                }
              />

            )

          }

        />

        {/* ========================================
            DASHBOARD
        ======================================== */}
        <Route

          path="/"

          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            PRODUCTOS
        ======================================== */}
        <Route

          path="/productos"

          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            CATEGORÍAS
        ======================================== */}
        <Route

          path="/categorias"

          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            MARCAS
        ======================================== */}
        <Route

          path="/marcas"

          element={
            <ProtectedRoute>
              <Brands />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            PEDIDOS
        ======================================== */}
        <Route

          path="/pedidos"

          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            VENTAS
        ======================================== */}
        <Route

          path="/ventas"

          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            USUARIOS
        ======================================== */}
        <Route

          path="/usuarios"

          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            OFERTAS
        ======================================== */}
        <Route

          path="/ofertas"

          element={
            <ProtectedRoute>
              <Offers />
            </ProtectedRoute>
          }

        />

        {/* ========================================
            CONFIGURACIÓN
        ======================================== */}
        <Route

          path="/configuracion"

          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }

        />

      </Routes>

    </BrowserRouter>

  )

}

export default App