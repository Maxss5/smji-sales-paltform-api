"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductosPage() {
  const [products, setProducts] = useState([]); // Lista para la tabla principal
  const [existingProducts, setExistingProducts] = useState([]); // Lista para el dropdown
  const [showForm, setShowForm] = useState(false);
  const [isExisting, setIsExisting] = useState(false); // Switch entre nuevo o existente
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Producto para la Modal

  const initialFormState = {
    productId: "",
    name: "",
    description: "",
    companyId: "96baea1f-e485-413e-a4f4-5a5f0e97660a", 
    variants: [{ sku: "", size: "", color: "", salePrice: 0 }]
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = () => {
    // Es importante que el backend devuelva las variantes: include: { ProductVariant: true }
    apiFetch("/products").then((data) => {
      setProducts(data);
      setExistingProducts(data);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      setFormData(initialFormState);
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar:", error);
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
    <div className="p-4 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => { setShowForm(true); setIsExisting(false); }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Nuevo Producto
          </button>
          <button 
            onClick={() => { setShowForm(true); setIsExisting(true); }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            + Añadir Variantes
          </button>
        </div>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-xl rounded-lg mb-8 border-2 border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-blue-900">
              {isExisting ? "Registrar Variantes en Producto Existente" : "Crear Nuevo Producto"}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 font-bold">✕ Cerrar</button>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {isExisting ? (
              <select 
                required
                className="border p-2 rounded bg-gray-50 w-full"
                value={formData.productId}
                onChange={e => setFormData({...formData, productId: e.target.value})}
              >
                <option value="">-- Selecciona un producto --</option>
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
              <button type="button" onClick={addVariant} className="text-blue-600 text-sm font-bold">+ Fila</button>
            </div>
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex gap-2 bg-gray-50 p-2 rounded border">
                <input placeholder="SKU" required className="border p-1 w-1/3 rounded" value={variant.sku} onChange={(e) => updateVariant(index, "sku", e.target.value)} />
                <input placeholder="Talla" className="border p-1 w-1/4 rounded" value={variant.size || ""} onChange={(e) => updateVariant(index, "size", e.target.value)} />
                <input placeholder="Color" className="border p-1 w-1/4 rounded" value={variant.color || ""} onChange={(e) => updateVariant(index, "color", e.target.value)} />
                <input type="number" placeholder="Precio" required className="border p-1 w-1/4 rounded" value={variant.salePrice} onChange={(e) => updateVariant(index, "salePrice", e.target.value)} />
              </div>
            ))}
          </div>

          <button type="submit" className="w-full mt-6 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition">
            {isExisting ? "Actualizar Inventario" : "Guardar Producto"}
          </button>
        </form>
      )}

      {/* TABLA PRINCIPAL */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-gray-600 uppercase text-xs font-bold">
              <th className="p-4">Nombre</th>
              <th className="p-4">Descripción</th>
              <th className="p-4 text-center">Variantes</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-semibold text-gray-800">{p.name}</td>
                <td className="p-4 text-gray-500 italic">{p.description || "Sin descripción"}</td>
                <td className="p-4 text-center">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                    {p.ProductVariant?.length || 0} items
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => setSelectedProduct(p)}
                    className="text-blue-600 font-bold hover:text-blue-800 underline underline-offset-4"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE DETALLES */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                <p className="text-sm text-gray-500">ID: {selectedProduct.id}</p>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-600 text-sm font-bold uppercase">Total Variantes</p>
                  <p className="text-3xl font-black text-blue-900">{selectedProduct.ProductVariant?.length || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-green-600 text-sm font-bold uppercase">Categoría</p>
                  <p className="text-3xl font-black text-green-900">{selectedProduct.category || 'N/A'}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-700 mb-3 border-l-4 border-blue-600 pl-2">Inventario de Variantes</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 border-b">
                      <th className="p-3">SKU</th>
                      <th className="p-3">Talla / Color</th>
                      <th className="p-3 text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.ProductVariant?.map((v: any) => (
                      <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs text-blue-700">{v.sku}</td>
                        <td className="p-3 text-gray-700">
                          {v.size || '-'} {v.color ? ` / ${v.color}` : ''}
                        </td>
                        <td className="p-3 text-right font-bold text-gray-900">
                          ${v.salePrice?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {(!selectedProduct.ProductVariant || selectedProduct.ProductVariant.length === 0) && (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-gray-400 italic">No hay variantes registradas</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}