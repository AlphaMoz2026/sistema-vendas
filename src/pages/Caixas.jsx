import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sql } from '../lib/db';
import { authClient } from '../lib/auth-client';

export default function Caixas() {
    const navigate = useNavigate();
    const [caixas, setCaixas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados do formulário
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [password, setPassword] = useState('');

    const fetchCaixas = async () => {
        try {
            const data = await sql`SELECT * FROM profiles WHERE role = 'cashier' ORDER BY created_at DESC`;
            setCaixas(data);
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaixas();
    }, []);

    const criarCaixa = async (e) => {
        e.preventDefault();
        const numeroLimpo = celular.replace(/\s+/g, '').replace(/-/g, '');
        const emailFalso = `${numeroLimpo}@sistema.com`;

        try {
            const { data, error } = await authClient.signUp.email({
                email: emailFalso,
                password: password,
                name: nome,
            });

            if (error) throw error;

            if (data?.user) {
                await sql`
          INSERT INTO profiles (id, full_name, role, phone, balance)
          VALUES (${data.user.id}, ${nome}, 'cashier', ${numeroLimpo}, 0)
        `;
            }

            alert(`Caixa criado!\nLogin: ${numeroLimpo}\nSenha: ${password}`);
            setNome(''); setCelular(''); setPassword('');
            fetchCaixas();
        } catch (error) {
            alert("Erro ao criar caixa: " + error.message);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin')} className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Gestão de Caixas</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Novo Caixa
                    </h3>
                    <form onSubmit={criarCaixa} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nome do Funcionário</label>
                            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Número de Celular (Login)</label>
                            <input type="tel" required value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ex: 841234567" className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Senha (mín. 8 caracteres)</label>
                            <input type="password" required minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">
                            Criar Caixa
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-600" /> Caixas Registados
                    </h3>
                    {loading ? (
                        <p>A carregar...</p>
                    ) : caixas.length === 0 ? (
                        <p className="text-gray-500">Nenhum caixa registado ainda.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-gray-500 text-sm">
                                        <th className="pb-3">Nome</th>
                                        <th className="pb-3">Celular</th>
                                        <th className="pb-3">Saldo Atual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {caixas.map((caixa) => (
                                        <tr key={caixa.id} className="border-b last:border-0">
                                            <td className="py-3 font-semibold text-gray-700">{caixa.full_name}</td>
                                            <td className="py-3 text-gray-600">{caixa.phone}</td>
                                            <td className="py-3 text-green-600 font-bold">{Number(caixa.balance).toFixed(2)} MZN</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}