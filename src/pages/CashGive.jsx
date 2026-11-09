import React, { useState, useEffect } from 'react';
import { sql } from '../lib/db';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CashGive() {
    const navigate = useNavigate();

    // Estado para as notas (valores iniciais a 0)
    const [notas, setNotas] = useState({
        1000: 0,
        500: 0,
        200: 0,
        100: 0,
        50: 0,
        20: 0,
        10: 0,
    });

    // Estado para a lista de funcionários e o selecionado
    const [funcionarios, setFuncionarios] = useState([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');

    // Estados de controlo
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(false);

    // Buscar os funcionários (caixas) do banco assim que a tela abrir
    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const result = await sql`SELECT id, full_name FROM profiles WHERE role = 'cashier'`;
                setFuncionarios(result);
            } catch (error) {
                console.error("Erro ao buscar funcionários:", error);
            }
        };
        fetchFuncionarios();
    }, []);

    // Atualiza a quantidade de uma nota específica
    const handleNotaChange = (valor, quantidade) => {
        const qtd = parseInt(quantidade) || 0;
        setNotas({ ...notas, [valor]: qtd < 0 ? 0 : qtd });
    };

    // Calcula o total de dinheiro com base nas notas
    const calcularTotal = () => {
        return Object.entries(notas).reduce((total, [valor, qtd]) => {
            return total + (parseInt(valor) * qtd);
        }, 0);
    };

    const totalDinheiro = calcularTotal();

    // Função para submeter a entrega do dinheiro e enviar a notificação
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (totalDinheiro === 0) {
            alert("Por favor, insira pelo menos uma nota.");
            return;
        }

        if (!funcionarioSelecionado) {
            alert("Por favor, selecione quem vai receber o valor.");
            return;
        }

        setLoading(true);
        try {
            const funcionario = funcionarios.find(f => f.id === funcionarioSelecionado);

            // Grava a notificação no banco de dados para o supervisor ver
            await sql`
        INSERT INTO notifications (title, message) 
        VALUES (
          'Nova Entrada de Caixa', 
          ${'O funcionário ' + funcionario.full_name + ' entregou um total de ' + totalDinheiro.toLocaleString('pt-MZ') + ' MZN.'}
        )
      `;

            setSucesso(true);

            // Limpa o formulário após 3 segundos
            setTimeout(() => {
                setSucesso(false);
                setNotas({ 1000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 });
                setFuncionarioSelecionado('');
            }, 3000);

        } catch (error) {
            alert("Erro ao registar a entrega: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Cabeçalho */}
            <header className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="mr-4 text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Entregar Dinheiro (Cash Give)</h1>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Lado Esquerdo: Calculadora de Notas */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Contagem de Notas</h2>
                    <form id="cash-form" onSubmit={handleSubmit} className="space-y-4">
                        {Object.entries(notas).sort((a, b) => b[0] - a[0]).map(([valor, qtd]) => (
                            <div key={valor} className="flex items-center justify-between">
                                <label className="text-gray-700 font-medium w-24">{valor} MZN</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">x</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={qtd === 0 ? '' : qtd}
                                        onChange={(e) => handleNotaChange(valor, e.target.value)}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-medium"
                                        placeholder="0"
                                    />
                                    <span className="text-gray-500 text-sm w-24 text-right font-medium">
                                        = {(parseInt(valor) * qtd).toLocaleString('pt-MZ')} MZN
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center text-xl font-bold text-blue-600">
                                <span>Total a Entregar:</span>
                                <span>{totalDinheiro.toLocaleString('pt-MZ')} MZN</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Lado Direito: Destinatário e Ação */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quem vai receber?</h2>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selecione o Funcionário</label>
                        <select
                            value={funcionarioSelecionado}
                            onChange={(e) => setFuncionarioSelecionado(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                            required
                        >
                            <option value="">-- Escolha um funcionário --</option>
                            {funcionarios.map((func) => (
                                <option key={func.id} value={func.id}>{func.full_name}</option>
                            ))}
                        </select>

                        {funcionarios.length === 0 && (
                            <p className="text-sm text-orange-500 mt-2">
                                Nenhum caixa registado. Vá a "Gestão de Caixas" para criar um.
                            </p>
                        )}
                    </div>

                    {/* Botão de Finalizar / Mensagem de Sucesso */}
                    <div className="mt-8">
                        {sucesso ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 font-medium">
                                <CheckCircle2 size={24} />
                                Notificação enviada ao supervisor!
                            </div>
                        ) : (
                            <button
                                type="submit"
                                form="cash-form"
                                disabled={loading || totalDinheiro === 0 || !funcionarioSelecionado}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? 'A processar...' : (
                                    <>
                                        <Send size={18} /> Confirmar e Enviar
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}