import { Routes, Route, NavLink } from "react-router-dom";
import Layout from "./layout/Layout";

import Publishers from "./pages/Publishers.jsx";
import Authors from "./pages/Authors.jsx";
import Categories from "./pages/Categories.jsx";
import Books from "./pages/Books.jsx";
import Borrows from "./pages/Borrows.jsx";

const linkClass = ({ isActive }) =>
  "px-3 py-2 rounded-md transition " +
  (isActive
    ? "text-white bg-slate-700"
    : "text-slate-200 hover:text-white hover:bg-slate-700/60");

export default function App() {
  return (
    <Layout>
      {/* Üst bar (farklı renk) */}
      <header className="bg-slate-800">
        <nav className="container mx-auto max-w-5xl h-14 px-4 flex items-center justify-center gap-2 sm:gap-4">
          <NavLink to="/" className={linkClass}>
            Giriş
          </NavLink>
          <NavLink to="/publishers" className={linkClass}>
            Yayımcı
          </NavLink>
          <NavLink to="/authors" className={linkClass}>
            Yazar
          </NavLink>
          <NavLink to="/categories" className={linkClass}>
            Kategori
          </NavLink>
          <NavLink to="/books" className={linkClass}>
            Kitap
          </NavLink>
          <NavLink to="/borrows" className={linkClass}>
            Kitap Alma
          </NavLink>
        </nav>
      </header>

      {/* Tüm sayfa içeriklerini ortala */}
      <main className="container mx-auto max-w-5xl px-4 py-10 text-center">
        <Routes>
          <Route
            index
            element={
              <div className="text-center space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Kütüphane Sistemimize Hoşgeldiniz!
                </h1>
                <img
                  src="/src/assets/kutuphane.jpeg"
                  alt="Kütüphane"
                  className="object-cover rounded-2xl shadow-lg w-full max-w-3xl mx-auto"
                />
              </div>
            }
          />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/books" element={<Books />} />
          <Route path="/borrows" element={<Borrows />} />
        </Routes>
      </main>
    </Layout>
  );
}


