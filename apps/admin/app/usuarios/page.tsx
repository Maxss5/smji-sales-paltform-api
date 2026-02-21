"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function UserPage() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    apiFetch("/users")
      .then(setUsuarios)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u: any) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}