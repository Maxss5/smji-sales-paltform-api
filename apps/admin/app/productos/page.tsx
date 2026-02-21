"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    apiFetch("/productos")
      .then(setProductos)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p: any) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}