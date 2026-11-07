import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Menu, Package, Users, FileText, LogOut, X, Home } from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Fecha o menu ao clicar
    };

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* HEADER DO ADMIN */}
            <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md relative z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsMenuOpen(true)} className="p-1 hover:bg-gray-800 rounded">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="font-bold text-lg">Painel Admin</h1>
                </div>
                <button onClick={() => navigate('/login')} className="text-red-400 text-sm flex items-center gap-1 hover:text-red-300">
                    <LogOut className="w-4 h-4" /> Sair
                </button>
            </header>

            {/* MENU LATERAL (SIDEBAR) */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsMenuOpen(false)}></div>
            )}

            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="font-bold text-lg">Menu</h2>
                    <button onClick={() => setIsMenuOpen(false)}><X className="w-5 h-5" /></button>
                </div>

                <nav className="flex flex-col p-4 gap-2">
                    <button onClick={() => handleNavigate('/admin')} className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                        <Home className="w-5 h-5" /> Início
                    </button>
                    <button onClick={() => handleNavigate('/admin/vendas')} className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                        <FileText className="w-5 h-5" /> Relatório de Vendas
                    </button>
                    <button onClick={() => handleNavigate('/admin/produtos')} className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                        <Package className="w-5 h-5" /> Gerir Produtos
                    </button>
                    <button onClick={() => handleNavigate('/admin/caixas')} className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg text-left">
                        <Users className="w-5 h-5" /> Gestão de Caixas
                    </button>
                </nav>
            </div>

            {/* CONTEÚDO DA PÁGINA */}
            <main className="p-6 max-w-6xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}