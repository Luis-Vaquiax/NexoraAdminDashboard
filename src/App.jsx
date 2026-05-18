import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import Brands from "./pages/Brands"
import Orders from "./pages/Orders"
import Customers from "./pages/Customers"
import Offers from "./pages/Offers"
import Settings from "./pages/Settings"

function App() {
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("adminLogged") === "true"
  )

  const ProtectedRoute = ({ children }) => {
    if (!isLogged) {
      return <Navigate to="/login" />
    }

    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLogged(true)} />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route path="/categorias" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/marcas" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
        <Route path="/pedidos" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/ofertas" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App