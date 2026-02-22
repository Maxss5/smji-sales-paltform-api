"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductosPage() {
  const [products, setProducts] = useState([]); // Lista para la tabla principal
  const [existingProducts, setExistingProducts] = useState([]); // Lista para el dropdown
  const [showForm, setShowForm] = useState(false);
  const [isExisting, setIsExisting] = useState(false); // Switch entre nuevo o existente

  // Estado inicial del formulario
  const initialFormState = {
    productId: "", // Usado solo si isExisting es true
    name: "",
    description: "",
    companyId: "96baea1f-e485-413e-a4f4-5a5f0e97660a", 
    variants: [{ sku: "", size: "", color: "", salePrice: 0 }]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Carga inicial de datos
  const fetchProducts = () => {
    apiFetch("/products").then(setProducts).catch(console.error);
    // Cargamos también la lista simplificada para el select
    apiFetch("/products").then(setExistingProducts).catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Definimos el endpoint y el body según si es producto nuevo o solo variantes
      const endpoint = isExisting 
        ? `/products/${formData.productId}/variants` 
        : "/products";

      const bodyPayload = isExisting 
        ? { variants: formData.variants } 
        : formData;

      await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      setShowForm(false);
      setFormData(initialFormState); // Resetear formulario
      fetchProducts(); // Recargar datos
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al procesar la solicitud. Revisa la consola.");
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: "", size: "", color: "", salePrice: 0 }]
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => { setShowForm(true); setIsExisting(false); }}
            className={`px-4 py-2 rounded ${!isExisting && showForm ? 'bg-blue-800' : 'bg-blue-600'} text-white hover:bg-blue-700`}
          >
            + Nuevo Producto
          </button>
          <button 
            onClick={() => { setShowForm(true); setIsExisting(true); }}
            className={`px-4 py-2 rounded ${isExisting && showForm ? 'bg-gray-800' : 'bg-gray-600'} text-white hover:bg-gray-700`}
          >
            + Añadir Variantes a Existente
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 border border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-900">
              {isExisting ? "Seleccionar Producto Existente" : "Datos del Nuevo Producto"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-red-500 text-sm">Cerrar</button>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {isExisting ? (
              <select 
                required
                className="border p-2 rounded bg-white w-full"
                value={formData.productId}
                onChange={e => setFormData({...formData, productId: e.target.value})}
              >
                <option value="">-- Selecciona un producto de la lista --</option>
                {existingProducts.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Nombre del producto" required
                  className="border p-2 rounded"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="text" placeholder="Descripción"
                  className="border p-2 rounded"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Variantes</h3>
              <button 
                type="button" 
                onClick={addVariant}
                className="text-blue-600 text-sm font-semibold hover:underline bg-blue-50 px-3 py-1 rounded"
              >
                + Añadir fila
              </button>
            </div>
            
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex gap-2 bg-gray-50 p-2 rounded border">
                <input 
                  placeholder="SKU" required
                  className="border p-1 w-1/3"
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                />
                <input 
                  placeholder="Talla" 
                  className="border p-1 w-1/4"
                  value={variant.size || ""}
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
                />
                <input 
                  placeholder="Color" 
                  className="border p-1 w-1/4"
                  value={variant.color || ""}
                  onChange={(e) => updateVariant(index, "color", e.target.value)}
                />
                <input 
                  type="number" placeholder="Precio" required
                  className="border p-1 w-1/4"
                  value={variant.salePrice}
                  onChange={(e) => updateVariant(index, "salePrice", e.target.value)}
                />
              </div>
            ))}
          </div>

          <button type="submit" className="w-full mt-6 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 shadow-lg">
            {isExisting ? "Guardar nuevas variantes" : "Guardar Producto Completo"}
          </button>
        </form>
      )}

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
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3 text-gray-600">{p.description || "Sin descripción"}</td>
              <td className="p-3 text-blue-600 cursor-pointer hover:underline">Ver detalles</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}