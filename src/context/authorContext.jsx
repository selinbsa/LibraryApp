import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  listAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../services/authors";

const Ctx = createContext(null);

export function AuthorProvider({ children }) {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setAuthors((await listAuthors()) || []);
    } catch (e) {
      console.error(e);
      toast.error("Yazarlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (p) => {
    await createAuthor(p);
    toast.success("Yazar eklendi");
    await load();
  };
  const update = async (i, p) => {
    await updateAuthor(i, p);
    toast.success("Yazar güncellendi");
    await load();
  };
  const remove = async (i) => {
    await deleteAuthor(i);
    toast.success("Yazar silindi");
    await load();
  };

  const value = useMemo(
    () => ({ authors, loading, load, add, update, remove }),
    [authors, loading]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuthors = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuthors, AuthorProvider içinde kullanılmalı.");
  return v;
};
