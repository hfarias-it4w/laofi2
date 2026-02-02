"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsFillExclamationOctagonFill } from "react-icons/bs";
import { FaCoffee, FaPlus, FaCheck } from "react-icons/fa";

interface Producto {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface Pedido {
  _id: string;
  user?: { name?: string; email?: string };
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  total: number;
  estado: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function InternoPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const router = useRouter();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [page, setPage] = useState(1);

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!user || !isAdmin) return;

    fetch("/api/productos")
      .then((res) => res.json())
      .then(setProductos);

    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos);
  }, [user, isAdmin, status]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || undefined,
        image: formData.image || undefined,
      };

      const isEditing = !!editingProduct;
      const url = isEditing
        ? `/api/productos/${editingProduct._id}`
        : "/api/productos";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        if (isEditing) {
          setProductos((prev) =>
            prev.map((p) => (p._id === savedProduct._id ? savedProduct : p))
          );
        } else {
          setProductos((prev) => [savedProduct, ...prev]);
        }
        closeDialog();
      } else {
        const err = await res.json();
        alert(err.message || "Error al guardar producto");
      }
    } catch {
      alert("Error de red");
    }
    setSaving(false);
  };

  const openEditDialog = (product: Producto) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      image: product.image || "",
    });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingProduct(null);
    setFormData({ name: "", price: "", description: "", image: "" });
  };

  const marcarEntregado = async (id: string) => {
    await fetch("/api/pedidos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, estado: "entregado" }),
    });
    setPedidos((prev) =>
      prev.map((p) => (p._id === id ? { ...p, estado: "entregado" } : p))
    );
  };

  // Pagination
  const totalPages = Math.ceil(pedidos.length / ITEMS_PER_PAGE);
  const paginatedPedidos = pedidos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B29F]"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center mt-10">
        <div className="text-red-600 text-4xl mb-6">
          <BsFillExclamationOctagonFill />
        </div>
        <div className="text-red-600 text-xl mb-6">Acceso denegado</div>
        <button
          className="bg-[#13B29F] hover:bg-[#119e8d] text-white rounded-xl py-3 px-6 text-lg font-semibold transition-colors"
          onClick={() => router.push("/login")}
        >
          Ir al login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold text-[#13B29F] flex items-center gap-2">
        <FaCoffee /> [INTERNO] Panel de Operaciones
      </h1>

      {/* Productos Section */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            Tipos de Cafe
          </h2>
          <button
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 bg-[#13B29F] hover:bg-[#119e8d] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <FaPlus /> Agregar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500">
                <th className="py-2">Nombre</th>
                <th className="py-2">Precio</th>
                <th className="py-2">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-neutral-400">
                    No hay productos
                  </td>
                </tr>
              )}
              {productos.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-neutral-50 cursor-pointer"
                  onClick={() => openEditDialog(p)}
                >
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2">${p.price}</td>
                  <td className="py-2 text-neutral-500">
                    {p.description || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pedidos Section */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Pedidos Recientes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500">
                <th className="py-2">Usuario</th>
                <th className="py-2">Productos</th>
                <th className="py-2">Total</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPedidos.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-neutral-400">
                    No hay pedidos
                  </td>
                </tr>
              )}
              {paginatedPedidos.map((p) => {
                let estadoColor = "bg-gray-100 text-gray-600";
                if (p.estado === "pendiente")
                  estadoColor = "bg-yellow-100 text-yellow-800";
                else if (p.estado === "preparado")
                  estadoColor = "bg-green-100 text-green-800";
                else if (p.estado === "entregado")
                  estadoColor = "bg-blue-100 text-blue-800";
                else if (p.estado === "cancelado")
                  estadoColor = "bg-red-100 text-red-700";

                return (
                  <tr key={p._id} className="border-b hover:bg-neutral-50">
                    <td className="py-2">{p.user?.name || p.user?.email || "-"}</td>
                    <td className="py-2">
                      {p.productos
                        .map((item) => `${item.cantidad}x ${item.nombre}`)
                        .join(", ")}
                    </td>
                    <td className="py-2 font-medium">${p.total}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor}`}
                      >
                        {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                      </span>
                    </td>
                    <td className="py-2">
                      {p.estado !== "entregado" && p.estado !== "cancelado" && (
                        <button
                          onClick={() => marcarEntregado(p._id)}
                          className="flex items-center gap-1 text-[#13B29F] hover:text-[#119e8d] font-medium"
                        >
                          <FaCheck /> Entregar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-neutral-600">
              Pagina {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? "Editar Cafe" : "Agregar Cafe"}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripcion
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Imagen (URL)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, image: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#13B29F] text-white font-semibold disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
