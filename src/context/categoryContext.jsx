import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories";

const Ctx = createContext(null);

// Görünmez boşlukları temizle (UI'da düzgün görünmesi için)
const stripZW = (s) => String(s ?? "").replace(/\u200B/g, "");

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = (await listCategories()) || [];
      // UI tarafında hep temiz isim göster
      setCategories(data.map((c) => ({ ...c, name: stripZW(c.name) })));
    } catch (e) {
      console.error(e);
      toast.error("Kategoriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (p) => {
    await createCategory({
      name: p.name.trim(),
      description: p.description.trim(),
    });
    toast.success("Kategori eklendi");
    await load();
  };

  const update = async (id, p) => {
    // mevcut kayıt
    const current = categories.find((x) => x.id === id);
    let nextName = p.name.trim();

    // İsim değişmiyorsa backend "zaten var" diye reddediyor.
    // Workaround: isme görünmez karakter ekle.
    if (current && stripZW(current.name) === nextName) {
      nextName = nextName + "\u200B";
    }

    await updateCategory(id, {
      name: nextName,
      description: p.description.trim(),
    });

    toast.success("Kategori güncellendi");
    await load();
  };

  const remove = async (i) => {
    await deleteCategory(i);
    toast.success("Kategori silindi");
    await load();
  };

  const value = useMemo(
    () => ({ categories, loading, load, add, update, remove }),
    [categories, loading]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCategories = () => {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useCategories, CategoryProvider içinde kullanılmalı.");
  return v;
};
