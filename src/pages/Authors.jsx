import { useEffect, useState } from "react";
import { useAuthors } from "../context/authorContext";

const toDateInput = (v) => (v ? String(v).slice(0, 10) : "");

export default function AuthorPage() {
  const { authors, add, update, remove, load } = useAuthors();

  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    country: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (authors.length === 0) load();
    
  }, []);

  const reset = () => {
    setForm({ name: "", birthDate: "", country: "" });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      birthDate: form.birthDate || null,
      country: form.country.trim(),
    };
    if (editingId) await update(editingId, payload);
    else await add(payload);
    reset();
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      name: r.name ?? "",
      birthDate: toDateInput(r.birthDate),
      country: r.country ?? "",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Yazar</h2>

      <form onSubmit={submit} className="grid gap-2 max-w-md mb-6">
        <input
          className="input"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          type="date"
          placeholder="Doğum Tarihi"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        />
        <input
          className="input"
          placeholder="Ülke"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
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
            <th>Ad Soyad</th>
            <th>Doğum Tarihi</th>
            <th>Ülke</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {authors.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{toDateInput(r.birthDate)}</td>
              <td>{r.country}</td>
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
          {authors.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center opacity-70">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
