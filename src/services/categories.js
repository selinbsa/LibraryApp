import api from "../api/client";

export async function listCategories() {
  const { data } = await api.get("/categories");
  return data;
}
export async function createCategory(payload) {
  const { data } = await api.post("/categories", payload);
  return data;
}
export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
}
export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}
