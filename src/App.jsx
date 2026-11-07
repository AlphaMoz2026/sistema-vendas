import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import POS from './pages/POS';
import Produtos from './pages/Produtos';
import Vendas from './pages/Vendas';
import Admin from './pages/Admin';
import Caixas from './pages/Caixas';
import AdminLayout from './pages/AdminLayout';
import CashGive from './pages/CashGive'; // <-- Importação do CashGive

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial redireciona para o Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rotas Públicas / Caixa */}
        <Route path="/login" element={<Login />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/cashgive" element={<CashGive />} /> {/* <-- Rota do CashGive */}

        {/* Rotas do Admin com Layout partilhado */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="vendas" element={<Vendas />} />
          <Route path="caixas" element={<Caixas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;