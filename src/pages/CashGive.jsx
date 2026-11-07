import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, User, Menu, Send, Wallet, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sql } from '../lib/db';
import { authClient } from '../lib/auth-client';

export default function CashGive() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(false);

    const [destinatarios, setDestinatarios] = useState([]);
    const [destinatarioSelecionado, setDestinatarioSelecionado] = useState('');
    const [valorTotal, setValorTotal] = useState(0);

    // Definição das notas com as cores
    const notas = [
        { valor: 1000, cor: 'bg-[#1B2A4A]', texto: 'text-white' }, // Azul Escuro
        { valor: 500, cor: 'bg-[#F4D3D3]', texto: 'text-black' },  // Rosa claro
        { valor: 200, cor: 'bg-[#4AB2E6]', texto: 'text-white' },  // Azul claro
        { valor: 100, cor: 'bg-[#B93B5B]', texto: 'text-white' },  // Magenta
        { valor: 50, cor: 'bg-[#F0D27A]', texto: 'text-black' },   // Amarelo ocre
        { valor: 20, cor: 'bg-[#8C98B8]', texto: 'text-white' },   // Cinza azulado
    ];

    useEffect(() => {
        const fetchData = async () => {
            const { data: session } = await authClient.getSession();
            if (session) {
                setUser(session.user);
                const perfil = await sql`SELECT balance FROM profiles WHERE id = ${session.user.id}`;
                if (perfil.length > 0) setSaldo(Number(perfil[0].balance));
            }

            const users = await sql`SELECT id, full_name, role FROM profiles WHERE id != ${session?.user?.id}`;
            setDestinatarios(users);
            if (users.length > 0) setDestinatarioSelecionado(users[0].id);
        };
        fetchData();
    }, []);

    // Adiciona o valor da nota ao total
    const adicionarValor = (valor) => {
        setValorTotal(prev => prev + valor);
    };

    const limpar = () => setValorTotal(0);

    const enviarDinheiro = async () => {
        if (valorTotal <= 0) return alert("Insira um valor válido.");
        if (valorTotal > saldo) return alert("Saldo insuficiente!");
        if (!destinatarioSelecionado) return alert("Selecione um destinatário.");

        setLoading(true);
        try {
            await sql`
        INSERT INTO notifications (user_id, sender_id, message, type, status, amount)
        VALUES (
          ${destinatarioSelecionado}, 
          ${user.id}, 
          ${`O caixa ${user.name} quer enviar dinheiro.`}, 
          'cashgive_pending', 
          'pending', 
          ${valorTotal}
        )
      `;

            alert(`Pedido de envio de ${valorTotal.toFixed(2)} MZN enviado! Aguarde a aprovação.`);
            setSaldo(saldo - valorTotal);
            setValorTotal(0);
        } catch (error) {
            alert("Erro ao enviar pedido: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans pb-10">

            {/* HEADER */}
            <header className="bg-white px-4 py-3 flex justify-between items-center shadow-sm">
                <Menu className="w-6 h-6 text-gray-600" />
                <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6 text-gray-600" />
                    <User className="w-6 h-6 text-gray-600" />
                </div>
            </header>

            <div className="max-w-md mx-auto px-4 mt-6">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1A365D]">Cash Invoice</h1>
                    <p className="text-sm text-gray-500">Dashboard / Invoice / Cash (give)</p>
                </div>

                {/* BARRA DE PROGRESSO */}
                <div className="flex items-center justify-center mb-8 relative">
                    <div className="absolute w-2/3 h-1 bg-gray-300 top-1/2 -z-10"></div>
                    <div className="w-12 h-12 rounded-full bg-[#C13B3B] text-white flex items-center justify-center font-bold text-xl border-4 border-[#F5F7FA]">1</div>
                    <div className="flex-1"></div>
                    <div className="w-12 h-12 rounded-full bg-white text-gray-500 flex items-center justify-center font-bold text-xl border-4 border-gray-300">2</div>
                </div>

                {/* FORMULÁRIO */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">Enviar para:</label>
                        <select
                            value={destinatarioSelecionado}
                            onChange={(e) => setDestinatarioSelecionado(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {destinatarios.map(dest => (
                                <option key={dest.id} value={dest.id}>{dest.full_name} ({dest.role})</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">Title</label>
                        <input type="text" readOnly value="Transferência de Caixa" className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm" />
                    </div>

                    {/* CAMPO DO VALOR (VISOR) */}
                    <div className="mb-6">
                        <label className="block text-sm text-gray-700 mb-1">Amount</label>
                        <div className="flex">
                            <input
                                type="text"
                                readOnly
                                value={valorTotal.toFixed(2) + " MZN"}
                                className="flex-1 p-3 border border-gray-300 rounded-l-lg bg-gray-50 text-lg font-bold text-gray-800 focus:outline-none"
                            />
                            <div className="bg-[#C13B3B] text-white p-3 rounded-r-lg flex items-center justify-center">
                                <Calculator className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* BOTÕES DAS NOTAS (CLICÁVEIS) */}
                    <div className="space-y-2">
                        {notas.map((nota) => (
                            <button
                                key={nota.valor}
                                onClick={() => adicionarValor(nota.valor)}
                                className={`w-full p-3 rounded-lg text-lg font-bold text-center ${nota.cor} ${nota.texto} hover:opacity-90 active:scale-95 transition flex justify-between px-6`}
                            >
                                <span>{nota.valor}</span>
                                <span>+</span>
                            </button>
                        ))}

                        {/* Moedas */}
                        <button onClick={() => adicionarValor(10)} className="w-full p-3 rounded-lg text-lg font-bold text-center bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition flex justify-between px-6">
                            <span>Moeda (10)</span>
                            <span>+</span>
                        </button>
                        <button onClick={() => adicionarValor(5)} className="w-full p-3 rounded-lg text-lg font-bold text-center bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition flex justify-between px-6">
                            <span>Moeda (5)</span>
                            <span>+</span>
                        </button>
                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="mt-6 flex gap-2">
                        <button onClick={limpar} className="w-1/3 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300">
                            Limpar
                        </button>
                        <button onClick={enviarDinheiro} disabled={loading} className="w-2/3 bg-[#C13B3B] text-white font-bold py-3 rounded-lg hover:bg-red-700 flex justify-center items-center gap-2">
                            <Send className="w-5 h-5" /> {loading ? 'A enviar...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}