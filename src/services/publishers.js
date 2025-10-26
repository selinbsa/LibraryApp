import api from "../api/client";

export async function listPublishers() {
  const { data } = await api.get("/publishers");
  return data;
}

export async function createPublisher(payload) {
  const { data } = await api.post("/publishers", payload);
  return data;
}

export async function updatePublisher(id, payload) {
  
  const { data } = await api.put(`/publishers/${id}`, { id, ...payload });
  return data;
}

export async function deletePublisher(id) {
  await api.delete(`/publishers/${id}`);
}
