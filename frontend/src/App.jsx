import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Contacto from "./pages/Contacto.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
