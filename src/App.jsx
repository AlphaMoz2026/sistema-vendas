import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Importação das suas páginas
import Login from './pages/login';
import POS from './pages/POS';
import Produtos from './pages/Produtos';
import Vendas from './pages/Vendas';
import Admin from './pages/Admin';
import Caixas from './pages/Caixas';
import AdminLayout from './pages/AdminLayout';
import CashGive from './pages/CashGive';

// --- BARREIRA DE SEGURANÇA (SÓ DEIXA PASSAR SUPERVISOR/ADMIN) ---
const RotaProtegidaAdmin = ({ children }) => {
  const { role, loading } = useAuth();

  // Enquanto o sistema verifica o login, não mostra nada (ou um loading)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">A verificar permissões...</div>;
  }

  // Se for supervisor, admin ou manager, deixa entrar no painel
  if (role === 'supervisor' || role === 'admin' || role === 'manager') {
    return children;
  }

  // Se for 'cashier' (caixa), chuta ele de volta para a tela de vendas!
  return <Navigate to="/pos" replace />;
};
// ------------------------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial redireciona para o Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rotas Públicas / Caixa */}
        <Route path="/login" element={<Login />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/cashgive" element={<CashGive />} />

        {/* Rotas do Admin (PROTEGIDAS PELA BARREIRA) */}
        <Route path="/admin" element={
          <RotaProtegidaAdmin>
            <AdminLayout />
          </RotaProtegidaAdmin>
        }>
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