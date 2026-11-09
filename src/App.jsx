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

// --- BARREIRA DE SEGURANÇA ---
const RotaProtegidaAdmin = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">A verificar...</div>;

  // Se o utilizador estiver logado e o e-mail NÃO for do tipo caixa (@sistema.com), é admin.
  const isSupervisor = user?.email && !user.email.includes('@sistema.com');

  if (isSupervisor) {
    return children;
  }

  // Se for caixa (ou não tiver login), chuta de volta para a tela de vendas
  return <Navigate to="/pos" replace />;
};
// ------------------------------

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

        {/* Rotas do Admin (PROTEGIDAS) */}
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