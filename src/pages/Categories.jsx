import { useEffect, useState } from "react";
import { useCategories } from "../context/categoryContext";

const stripZW = (s) => String(s ?? "").replace(/\u200B/g, "");

export default function CategoryPage() {
  const { categories, add, update, remove, load } = useCategories();

  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (categories.length === 0) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
    };
    if (editingId) await update(editingId, payload);
    else await add(payload);
    reset();
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    // formu doldururken görünmez karakterleri temizle
    setForm({ name: stripZW(r.name), description: r.description ?? "" });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Kategori</h2>

      <form onSubmit={submit} className="grid gap-2 max-w-md mb-6">
        <input
          className="input"
          placeholder="Ad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Açıklama"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={reset}>
              İptal
            </button>
          )}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Açıklama</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              {/* ekranda her zaman temiz isim göster */}
              <td>{stripZW(r.name)}</td>
              <td>{r.description}</td>
              <td className="flex gap-2">
                <button className="btn" onClick={() => startEdit(r)}>
                  Düzenle
                </button>
                <button className="btn" onClick={() => remove(r.id)}>
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center opacity-70">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
