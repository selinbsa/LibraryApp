
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  listBorrows,
  createBorrow,
  updateBorrow as updateBorrowApi,
  deleteBorrow,
} from "../services/borrows";
import { listBooks } from "../services/books";

const Ctx = createContext(null);
const toDateInput = (v) => (v ? String(v).slice(0, 10) : "");

export function BorrowingProvider({ children }) {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [bws, bs] = await Promise.all([listBorrows(), listBooks()]);
      const booksSafe = Array.isArray(bs) ? bs : [];
      const byId = new Map(booksSafe.map((b) => [b.id, b]));
      const enriched = (bws || []).map((r) => {
        const bookId = r.book?.id;
        if (bookId && byId.has(bookId)) {
          const latest = byId.get(bookId);
          return { ...r, book: { ...r.book, ...latest } };
        }
        return r;
      });
      setBorrows(enriched);
      setBooks(booksSafe);
    } catch (e) {
      console.error(e);
      toast.error("Kayıtlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("books:changed", h);
    return () => window.removeEventListener("books:changed", h);
  }, []);

  const remainingFor = (bookId, { excludeBorrowId } = {}) => {
    const b = books.find((x) => x.id === Number(bookId));
    if (!b) return 0;
    const active = borrows.filter((r) => {
      if (excludeBorrowId && r.id === excludeBorrowId) return false;
      return r.book?.id === Number(bookId) && !r.returnDate;
    }).length;
    return Math.max(0, (b.stock ?? 0) - active);
  };

  const add = async (form) => {
    if (!form.bookId) {
      toast.error("Lütfen bir kitap seçin");
      return;
    }
    if (remainingFor(form.bookId) <= 0) {
      toast.error("Stok yetersiz — bu kitap için yeni kayıt açılamaz.");
      return;
    }
    await createBorrow(form);
    toast.success("Kayıt eklendi");
    await load();
    window.dispatchEvent(new Event("borrows:changed"));
  };

  const update = async (id, form) => {
    if (!form.bookId) {
      toast.error("Lütfen bir kitap seçin");
      return;
    }
    const prev = borrows.find((r) => r.id === id);
    const bookChanged = prev?.book?.id !== Number(form.bookId);
    if (
      bookChanged &&
      remainingFor(form.bookId, { excludeBorrowId: id }) <= 0
    ) {
      toast.error("Stok yetersiz — seçilen kitap için güncelleme yapılamaz.");
      return;
    }
    await updateBorrowApi(id, form);
    toast.success("Kayıt güncellendi");
    await load();
    window.dispatchEvent(new Event("borrows:changed"));
  };

  
  const markReturned = async (id) => {
    const r = borrows.find((x) => x.id === id);
    if (!r) {
      toast.error("Kayıt bulunamadı");
      return;
    }
    if (r.returnDate) {
      toast("Bu kayıt zaten iade edilmiş.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    await updateBorrowApi(id, {
      borrowerName: r.borrowerName,
      borrowerMail: r.borrowerMail,
      borrowingDate: toDateInput(r.borrowingDate),
      bookId: r.book?.id,
      returnDate: today,
    });
    toast.success("İade edildi");
    await load();
    window.dispatchEvent(new Event("borrows:changed"));
  };

  const remove = async (id) => {
    await deleteBorrow(id);
    toast.success("Kayıt silindi");
    await load();
    window.dispatchEvent(new Event("borrows:changed"));
  };

  const value = useMemo(
    () => ({
      borrows,
      books,
      loading,
      load,
      add,
      update,
      remove,
      markReturned, 
      remainingFor,
      toDateInput,
    }),
    [borrows, books, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBorrowing = () => {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useBorrowing, BorrowingProvider içinde kullanılmalı.");
  return v;
};
