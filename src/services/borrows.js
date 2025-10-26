import api from "../api/client";

export async function listBorrows() {
  const { data } = await api.get("/borrows");
  return data;
}

export async function createBorrow(form) {
  const payload = {
    borrowerName: String(form.borrowerName ?? "").trim(),
    borrowerMail: String(form.borrowerMail ?? "").trim(),
    borrowingDate: form.borrowingDate, // YYYY-MM-DD
    bookForBorrowingRequest: { id: Number(form.bookId) }, // POST beklentisi
  };
  const { data } = await api.post("/borrows", payload);
  return data;
}

export async function updateBorrow(id, form) {
  const payload = {
    borrowerName: String(form.borrowerName ?? "").trim(),
    borrowerMail: String(form.borrowerMail ?? "").trim(),
    borrowingDate: form.borrowingDate, // YYYY-MM-DD
    book: { id: Number(form.bookId) }, // PUT beklentisi
  };
  const { data } = await api.put(`/borrows/${id}`, payload);
  return data;
}

export async function deleteBorrow(id) {
  await api.delete(`/borrows/${id}`);
}
