import { useEffect, useState } from "react";
import { useBooks } from "../context/bookContext";
import { useAuthors } from "../context/authorContext";
import { useCategories } from "../context/categoryContext";
import { usePublishers } from "../context/publisherContext";

export default function BookPage() {
  const { books, add, update, remove, load } = useBooks();
  const { authors } = useAuthors();
  const { categories } = useCategories();
  const { publishers } = usePublishers();

  const [form, setForm] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    publisherId: "",
    categoryIds: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (books.length === 0) load();
  }, []);

  const toggleCategory = (id) =>
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((x) => x !== id)
        : [...f.categoryIds, id],
    }));

  const reset = () => {
    setForm({
      name: "",
      publicationYear: "",
      stock: "",
      authorId: "",
      publisherId: "",
      categoryIds: [],
    });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      publicationYear: Number(form.publicationYear),
      stock: Number(form.stock),
    };
    if (editingId) await update(editingId, payload);
    else await add(payload);
    reset();
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      name: r.name ?? "",
      publicationYear: r.publicationYear ?? "",
      stock: r.stock ?? "",
      authorId: r.author?.id ?? "",
      publisherId: r.publisher?.id ?? "",
      categoryIds: (r.categories || []).map((x) => x.id),
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Kitap</h2>
      <form onSubmit={submit} className="grid gap-2 max-w-2xl mb-6">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            placeholder="Ad"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Basım Yılı"
            value={form.publicationYear}
            onChange={(e) =>
              setForm({ ...form, publicationYear: e.target.value })
            }
          />
          <input
            className="input"
            type="number"
            placeholder="Stok"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <select
            className="input"
            value={form.authorId}
            onChange={(e) => setForm({ ...form, authorId: e.target.value })}
          >
            <option value="">Yazar seç</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={form.publisherId}
            onChange={(e) => setForm({ ...form, publisherId: e.target.value })}
          >
            <option value="">Yayımcı seç</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="border rounded-lg p-3">
          <div className="font-medium mb-1">Kategoriler</div>
          <div className="flex gap-4 flex-wrap">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.categoryIds.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />{" "}
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary">
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
            <th>Yıl</th>
            <th>Stok</th>
            <th>Yazar</th>
            <th>Yayımcı</th>
            <th>Kategoriler</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.publicationYear}</td>
              <td>{r.stock}</td>
              <td>{r.author?.name}</td>
              <td>{r.publisher?.name}</td>
              <td>{(r.categories || []).map((c) => c.name).join(", ")}</td>
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
        </tbody>
      </table>
    </div>
  );
}
