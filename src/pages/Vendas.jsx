import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sql } from '../lib/db';

export default function Vendas() {
    const navigate = useNavigate();
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalDia, setTotalDia] = useState(0);

    useEffect(() => {
        const fetchVendas = async () => {
            try {
                // Vai buscar as vendas e os itens de cada venda
                const data = await sql`
          SELECT 
            s.id, 
            s.total, 
            s.created_at,
            COUNT(si.id) as total_itens
          FROM sales s
          LEFT JOIN sale_items si ON si.sale_id = s.id
          GROUP BY s.id
          ORDER BY s.created_at DESC
        `;
                setVendas(data);

                // Calcula o total vendido
                const total = data.reduce((acc, venda) => acc + Number(venda.total), 0);
                setTotalDia(total);
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendas();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin')} className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Histórico de Vendas</h1>
            </header>

            {/* CARTOES DE RESUMO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Arrecadado</p>
                        <p className="text-2xl font-bold text-gray-800">{totalDia.toFixed(2)} MZN</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg text-green-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Nº de Vendas</p>
                        <p className="text-2xl font-bold text-gray-800">{vendas.length}</p>
                    </div>
                </div>
            </div>

            {/* TABELA DE VENDAS */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Receipt className="w-5 h-5" /> Faturas Emitidas
                </h2>

                {loading ? (
                    <p>A carregar histórico...</p>
                ) : vendas.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma venda registada ainda.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-gray-500 text-sm">
                                    <th className="pb-3">ID da Venda</th>
                                    <th className="pb-3">Data e Hora</th>
                                    <th className="pb-3">Nº de Itens</th>
                                    <th className="pb-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendas.map((venda) => (
                                    <tr key={venda.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="py-3 font-mono text-xs text-gray-600">
                                            #{venda.id.split('-')[0].toUpperCase()}
                                        </td>
                                        <td className="py-3 text-sm">
                                            {new Date(venda.created_at).toLocaleString('pt-PT')}
                                        </td>
                                        <td className="py-3 text-sm">{venda.total_itens} itens</td>
                                        <td className="py-3 text-right font-bold text-green-600">
                                            {Number(venda.total).toFixed(2)} MZN
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}