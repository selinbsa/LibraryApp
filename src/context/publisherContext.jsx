import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  listPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../services/publishers";

const PublisherContext = createContext(null);

export function PublisherProvider({ children }) {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listPublishers();
      setPublishers(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload) => {
    await createPublisher(payload);
    await load();
  };

  const update = async (id, payload) => {
    await updatePublisher(id, payload);
    await load();
  };

  const remove = async (id) => {
    await deletePublisher(id);
    await load();
  };

  const value = useMemo(
    () => ({ publishers, loading, load, add, update, remove }),
    [publishers, loading]
  );

  return (
    <PublisherContext.Provider value={value}>
      {children}
    </PublisherContext.Provider>
  );
}

export function usePublishers() {
  const ctx = useContext(PublisherContext);
  if (!ctx) throw new Error("usePublishers, PublisherProvider içinde kullanılmalı.");
  return ctx;
}
