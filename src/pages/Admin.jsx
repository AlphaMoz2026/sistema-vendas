import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, FileText } from 'lucide-react';

export default function Admin() {
    const navigate = useNavigate();

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Bem-vindo, Supervisor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => navigate('/admin/vendas')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md flex items-center gap-4 text-left border border-gray-100">
                    <div className="bg-blue-100 p-4 rounded-lg text-blue-600"><FileText className="w-8 h-8" /></div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Relatório de Vendas</h3>
                        <p className="text-sm text-gray-500">Ver faturas e totais arrecadados</p>
                    </div>
                </button>

                <button onClick={() => navigate('/admin/produtos')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md flex items-center gap-4 text-left border border-gray-100">
                    <div className="bg-green-100 p-4 rounded-lg text-green-600"><Package className="w-8 h-8" /></div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Gerir Produtos</h3>
                        <p className="text-sm text-gray-500">Adicionar e ver stock</p>
                    </div>
                </button>

                <button onClick={() => navigate('/admin/caixas')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md flex items-center gap-4 text-left border border-gray-100">
                    <div className="bg-orange-100 p-4 rounded-lg text-orange-600"><Users className="w-8 h-8" /></div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Gestão de Caixas</h3>
                        <p className="text-sm text-gray-500">Ver saldos e criar utilizadores</p>
                    </div>
                </button>

                <button onClick={() => navigate('/pos')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md flex items-center gap-4 text-left border border-gray-100">
                    <div className="bg-purple-100 p-4 rounded-lg text-purple-600"><FileText className="w-8 h-8" /></div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Ir para a Frente de Caixa</h3>
                        <p className="text-sm text-gray-500">Fazer uma venda manual</p>
                    </div>
                </button>
            </div>
        </div>
    );
}