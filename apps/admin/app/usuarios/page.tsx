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

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((p: any) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}