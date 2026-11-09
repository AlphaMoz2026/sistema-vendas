import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, FileText } from 'lucide-react';
import Notificacoes from './Notificacoes';

export default function Admin() {
    const navigate = useNavigate();

    return (
        <div className="p-4 md:p-6">
            {/* CABEÇALHO COM TÍTULO E SINO */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Bem-vindo, Supervisor</h2>
                <Notificacoes />
            </div>

            {/* GRELHA DE BOTÕES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Botão: Relatório de Vendas */}
                <button onClick={() => navigate('/admin/vendas')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="bg-blue-100 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                        <FileText className="text-blue-600 w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Relatório de Vendas</h3>
                    <p className="text-sm text-gray-500">Ver faturas e totais arrecadados</p>
                </button>

                {/* Botão: Gerir Produtos */}
                <button onClick={() => navigate('/admin/produtos')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="bg-green-100 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                        <Package className="text-green-600 w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Gerir Produtos</h3>
                    <p className="text-sm text-gray-500">Adicionar e ver stock</p>
                </button>

                {/* Botão: Gestão de Caixas */}
                <button onClick={() => navigate('/admin/caixas')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="bg-orange-100 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                        <Users className="text-orange-600 w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Gestão de Caixas</h3>
                    <p className="text-sm text-gray-500">Ver saldos e criar utilizadores</p>
                </button>

                {/* Botão: Ir para a Frente de Caixa */}
                <button onClick={() => navigate('/pos')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="bg-purple-100 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4">
                        <FileText className="text-purple-600 w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Ir para a Frente de Caixa</h3>
                    <p className="text-sm text-gray-500">Fazer uma venda manual</p>
                </button>

            </div>
        </div>
    );
}