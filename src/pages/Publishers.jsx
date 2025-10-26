import { useEffect, useState } from "react";
import { usePublishers } from "../context/publisherContext";
import { toast } from "react-hot-toast";

export default function PublishersPage() {
  const { publishers, loading, add, update, remove, load } = usePublishers();

  const [form, setForm] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [original, setOriginal] = useState(null); // düzenleme başlangıcındaki kayıt

  useEffect(() => {
    if (publishers.length === 0) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setForm({ name: "", establishmentYear: "", address: "" });
    setEditingId(null);
    setOriginal(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    const year = Number(form.establishmentYear);
    if (!form.name.trim() || !form.address.trim() || !year) {
      toast.error("Lütfen tüm alanları geçerli doldurun.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      establishmentYear: year,
      address: form.address.trim(),
    };

    try {
      if (editingId) {
        // ---- 2 ADIMLI GÜNCELLEME HİLESİ ----
        const onlyAddressChanged =
          original &&
          original.name?.trim().toLowerCase() === payload.name.toLowerCase() &&
          Number(original.establishmentYear) === payload.establishmentYear &&
          original.address?.trim() !== payload.address;

        if (onlyAddressChanged) {
          // 1) Geçici benzersiz ad ile güncelle (dupe kontrolünü aşmak için)
          const tmpName = `${payload.name} __tmp__${Date.now()}`;
          await update(editingId, {
            name: tmpName,
            establishmentYear: payload.establishmentYear,
            address: payload.address, // yeni adresi şimdiden uygula
          });

          // 2) Hedef adı geri koy
          await update(editingId, payload);

          toast.success("Adres güncellendi");
        } else {
          // normal güncelle
          await update(editingId, payload);
          toast.success("Yayımcı güncellendi");
        }
      } else {
        await add(payload);
        toast.success("Yayımcı eklendi");
      }
      reset();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "İşlem başarısız";
      toast.error(msg);
      console.error(err?.response || err);
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setOriginal(r);
    setForm({
      name: r.name ?? "",
      establishmentYear: r.establishmentYear ?? "",
      address: r.address ?? "",
    });
  };

  const confirmDelete = async (id) => {
    if (!confirm("Silinsin mi?")) return;
    try {
      await remove(id);
      toast.success("Yayımcı silindi");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Silme hatası";
      toast.error(msg);
      console.error(err?.response || err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Yayımcı</h2>

      <form onSubmit={submit} className="grid gap-2 max-w-md mb-6">
        <input
          className="input"
          placeholder="Ad"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Kuruluş Yılı"
          value={form.establishmentYear}
          onChange={(e) =>
            setForm({ ...form, establishmentYear: e.target.value })
          }
        />
        <input
          className="input"
          placeholder="Adres"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
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
            <th>Yıl</th>
            <th>Adres</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.establishmentYear}</td>
              <td>{r.address}</td>
              <td className="flex gap-2">
                <button className="btn" onClick={() => startEdit(r)}>
                  Düzenle
                </button>
                <button className="btn" onClick={() => confirmDelete(r.id)}>
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {!loading && publishers.length === 0 && (
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
