import api from "../api/client";

export async function listAuthors() {
  const { data } = await api.get("/authors");
  return data;
}
export async function createAuthor(payload) {
  const { data } = await api.post("/authors", payload);
  return data;
}
export async function updateAuthor(id, payload) {
  const { data } = await api.put(`/authors/${id}`, payload);
  return data;
}
export async function deleteAuthor(id) {
  await api.delete(`/authors/${id}`);
}
