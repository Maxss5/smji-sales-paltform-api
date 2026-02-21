"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}