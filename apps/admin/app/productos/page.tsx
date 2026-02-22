"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    companyId: "96baea1f-e485-413e-a4f4-5a5f0e97660a", // Sustituir por lógica de sesión
    variants: [{ sku: "", size: "", salePrice: 0 }]
  });

  const fetchProducts = () => apiFetch("/products").then(setProducts).catch(console.error);

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Usamos apiFetch pasando el endpoint y las opciones del método
      await apiFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      setShowForm(false);
      fetchProducts(); // Recargar la tabla
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  // Función para añadir una fila vacía de variante al formulario
const addVariant = () => {
  setFormData({
    ...formData,
    variants: [...formData.variants, { sku: "", size: "", color: "", salePrice: 0 }]
  });
};

// Función para actualizar una variante específica por su índice
const updateVariant = (index: number, field: string, value: any) => {
  const newVariants = [...formData.variants];
  newVariants[index] = { ...newVariants[index], [field]: value };
  setFormData({ ...formData, variants: newVariants });
};

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 border">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input 
              type="text" placeholder="Nombre del producto" required
              className="border p-2 rounded"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="text" placeholder="Descripción"
              className="border p-2 rounded"
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-3 border-t pt-4">
          <h3 className="font-bold text-gray-700">Variantes del Producto</h3>
          
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex gap-2 bg-gray-50 p-2 rounded border">
              <input 
                placeholder="SKU" 
                className="border p-1 w-1/3"
                onChange={(e) => updateVariant(index, "sku", e.target.value)}
              />
              <input 
                placeholder="Talla" 
                className="border p-1 w-1/4"
                onChange={(e) => updateVariant(index, "size", e.target.value)}
              />
              <input 
                placeholder="Color" 
                className="border p-1 w-1/4"
                onChange={(e) => updateVariant(index, "color", e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Precio" 
                className="border p-1 w-1/4"
                onChange={(e) => updateVariant(index, "salePrice", e.target.value)}
              />
            </div>
          ))}

          <button 
            type="button" 
            onClick={addVariant}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            + Añadir otra variante
          </button>
        </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
            Guardar Producto
          </button>
        </form>
      )}

      {/* Tabla existente */}
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Descripción</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.description || "Sin descripción"}</td>
              <td className="p-3 text-blue-600 cursor-pointer hover:underline">Ver detalles</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
