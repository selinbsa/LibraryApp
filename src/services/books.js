import api from "../api/client";

// UI -> backend payload
export const toBookPayload = (f) => ({
  name: String(f.name ?? "").trim(),
  publicationYear: Number(f.publicationYear),
  stock: Number(f.stock),
  author: { id: Number(f.authorId) },
  publisher: { id: Number(f.publisherId) },
  categories: (f.categoryIds || []).map((id) => ({ id: Number(id) })),
});

export async function listBooks() {
  const { data } = await api.get("/books");
  return data;
}
export async function createBook(form) {
  const payload = toBookPayload(form);
  const { data } = await api.post("/books", payload);
  return data;
}
export async function updateBook(id, form) {
  const payload = toBookPayload(form);
  const { data } = await api.put(`/books/${id}`, payload);
  return data;
}
export async function deleteBook(id) {
  await api.delete(`/books/${id}`);
}
