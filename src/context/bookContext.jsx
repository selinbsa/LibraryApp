import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  listBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/books";

const Ctx = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setBooks((await listBooks()) || []);
    } catch (e) {
      console.error(e);
      toast.error("Kitaplar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const emitChanged = () =>
    window.dispatchEvent(new CustomEvent("books:changed"));

  const add = async (form) => {
    await createBook(form);
    toast.success("Kitap eklendi");
    await load();
    emitChanged();
  };
  const update = async (id, form) => {
    await updateBook(id, form);
    toast.success("Kitap güncellendi");
    await load();
    emitChanged();
  };
  const remove = async (id) => {
    await deleteBook(id);
    toast.success("Kitap silindi");
    await load();
    emitChanged();
  };

  const value = useMemo(
    () => ({ books, loading, load, add, update, remove }),
    [books, loading]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useBooks = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBooks, BookProvider içinde kullanılmalı.");
  return v;
};
