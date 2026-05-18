const API_URL = "http://localhost:4000/api"

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/productos`)
  return await response.json()
}

export const createProduct = async (product) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })

  return await response.json()
}

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categorias`)
  return await response.json()
}

export const getSubcategoriesByCategory = async (categoriaId) => {
  const response = await fetch(`${API_URL}/categorias/${categoriaId}/subcategorias`)
  return await response.json()
}

export const getBrands = async () => {
  const response = await fetch(`${API_URL}/marcas`)
  return await response.json()
}