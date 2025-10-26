
import { useEffect, useState } from "react";
import { useBorrowing } from "../context/borrowingContext";

export default function BorrowingPage() {
  const {
    borrows,
    books,
    add,
    update,
    remove,
    load,
    remainingFor,
    toDateInput,
    loading,
    markReturned, 
  } = useBorrowing();

  const [form, setForm] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    bookId: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (borrows.length === 0) load();
    const h = () => load();
    window.addEventListener("books:changed", h);
    window.addEventListener("borrows:changed", h);
    return () => {
      window.removeEventListener("books:changed", h);
      window.removeEventListener("borrows:changed", h);
    };
    
  }, []);

  const reset = () => {
    setForm({
      borrowerName: "",
      borrowerMail: "",
      borrowingDate: "",
      bookId: "",
    });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editingId) await update(editingId, form);
    else await add(form);
    reset();
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({
      borrowerName: r.borrowerName ?? "",
      borrowerMail: r.borrowerMail ?? "",
      borrowingDate: toDateInput(r.borrowingDate),
      bookId: r.book?.id ?? "",
    });
  };

  const selectedRemain = form.bookId
    ? remainingFor(form.bookId, { excludeBorrowId: editingId })
    : null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Kitap Alma</h2>

      <form onSubmit={submit} className="grid gap-2 max-w-2xl mb-6">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            placeholder="Ad Soyad"
            value={form.borrowerName}
            onChange={(e) => setForm({ ...form, borrowerName: e.target.value })}
          />
          <input
            className="input"
            placeholder="E-posta"
            value={form.borrowerMail}
            onChange={(e) => setForm({ ...form, borrowerMail: e.target.value })}
          />
          <input
            className="input"
            type="date"
            placeholder="Alma Tarihi"
            value={form.borrowingDate}
            onChange={(e) =>
              setForm({ ...form, borrowingDate: e.target.value })
            }
          />
          <select
            className="input"
            value={form.bookId}
            onChange={(e) => setForm({ ...form, bookId: e.target.value })}
          >
            <option value="">Kitap seç</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRemain !== null && (
          <div
            className={`text-sm ${
              selectedRemain > 0 ? "text-green-700" : "text-red-600"
            }`}
          >
            Kalan stok: {selectedRemain}
          </div>
        )}

        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>
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
            <th>E-posta</th>
            <th>Alma Tarihi</th>
            <th>İade Tarihi</th> 
            <th>Kitap</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.borrowerName}</td>
              <td>{r.borrowerMail}</td>
              <td>{toDateInput(r.borrowingDate)}</td>
              <td>{toDateInput(r.returnDate)}</td> 
              <td>{r.book?.name}</td>
              <td className="flex gap-2">
                <button
                  className="btn"
                  onClick={() => startEdit(r)}
                  disabled={!!r.returnDate}
                >
                  Düzenle
                </button>
                {!r.returnDate && (
                  <button className="btn" onClick={() => markReturned(r.id)}>
                    İade Et
                  </button>
                )}
                <button className="btn" onClick={() => remove(r.id)}>
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {borrows.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center opacity-70">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
