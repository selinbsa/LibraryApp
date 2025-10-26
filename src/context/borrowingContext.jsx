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

// YYYY-MM-DD veya ISO → YYYY-MM-DD
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
    const h = () => load(); // kitap değişince tazele
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

    const created = await createBorrow(form);

    // eklenen kaydı liste başına koy
    const newBook = books.find((b) => b.id === Number(form.bookId));
    setBorrows((prev) => [
      {
        ...created,
        borrowerName: String(form.borrowerName ?? "").trim(),
        borrowerMail: String(form.borrowerMail ?? "").trim(),
        borrowingDate: form.borrowingDate,
        book: newBook || created.book || { id: Number(form.bookId) },
      },
      ...prev,
    ]);

    toast.success("Kayıt eklendi");

    // diğer yerler dinliyorsa söyleyelim (sayfa load çağırıyorsa çağırır)
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

    // 1) API isteği (await)
    await updateBorrowApi(id, form);

    // 2) tabloyu anında güncelle
    const patchedBook = books.find((b) => b.id === Number(form.bookId)) ||
      prev?.book || { id: Number(form.bookId) };

    setBorrows((prevList) =>
      prevList.map((r) =>
        r.id === id
          ? {
              ...r,
              borrowerName: String(form.borrowerName ?? "").trim(),
              borrowerMail: String(form.borrowerMail ?? "").trim(),
              borrowingDate: form.borrowingDate,
              book: patchedBook,
            }
          : r
      )
    );

    toast.success("Kayıt güncellendi");

  };

  const remove = async (id) => {
    await deleteBorrow(id);
    // hemen listeden düşür
    setBorrows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Kayıt silindi");
    // Diğer yerler dinliyorsa haber ver
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
