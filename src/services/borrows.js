
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


const toUpdatePayload = (x) => {
  const payload = {
    borrowerName: String(x.borrowerName ?? "").trim(),
    borrowerMail: String(x.borrowerMail ?? "").trim(),
    borrowingDate: x.borrowingDate, // YYYY-MM-DD
    book: { id: Number(x.bookId ?? x.book?.id) }, // PUT beklentisi
  };
  if (x.returnDate) {
    // iade tarihi gönderilecekse ekle (YYYY-MM-DD)
    payload.returnDate = x.returnDate;
  }
  return payload;
};

export async function updateBorrow(id, formOrPartial) {
  const payload = toUpdatePayload(formOrPartial);
  const { data } = await api.put(`/borrows/${id}`, payload);
  return data;
}

export async function deleteBorrow(id) {
  await api.delete(`/borrows/${id}`);
}
