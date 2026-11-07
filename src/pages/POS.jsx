import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Trash2, ArrowRight, Menu, X, Wallet, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sql } from '../lib/db';
import { authClient } from '../lib/auth-client';

export default function POS() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [saldo, setSaldo] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 1. Buscar o utilizador logado e o saldo
    useEffect(() => {
        const getUser = async () => {
            const { data } = await authClient.getSession();
            if (data) {
                setUser(data.user);
                const perfil = await sql`SELECT balance FROM profiles WHERE id = ${data.user.id}`;
                if (perfil.length > 0) setSaldo(Number(perfil[0].balance));
            }
        };
        getUser();
    }, []);

    // 2. Buscar os produtos
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const data = await sql`SELECT * FROM products`;
                setProdutos(data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProdutos();
    }, []);

    const adicionarAoCarrinho = (produto) => {
        const itemExistente = carrinho.find(item => item.id === produto.id);
        if (itemExistente) {
            setCarrinho(carrinho.map(item => item.id === produto.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCarrinho([...carrinho, { ...produto, qty: 1 }]);
        }
    };

    const removerDoCarrinho = (id) => {
        setCarrinho(carrinho.filter(item => item.id !== id));
    };

    const finalizarVenda = async () => {
        if (carrinho.length === 0) {
            alert("A fatura está vazia!");
            return;
        }

        try {
            const totalVenda = total;
            const vendaId = crypto.randomUUID();

            await sql`
        INSERT INTO sales (id, total, status) 
        VALUES (${vendaId}, ${totalVenda}, 'completed')
      `;

            for (const item of carrinho) {
                await sql`
          INSERT INTO sale_items (sale_id, product_id, quantity, price_at_sale)
          VALUES (${vendaId}, ${item.id}, ${item.qty}, ${item.price})
        `;

                await sql`
          UPDATE products 
          SET stock_quantity = stock_quantity - ${item.qty}
          WHERE id = ${item.id}
        `;
            }

            if (user) {
                await sql`
          UPDATE profiles 
          SET balance = balance + ${totalVenda} 
          WHERE id = ${user.id}
        `;
                setSaldo(saldo + totalVenda); // Atualiza o saldo no ecrã
            }

            alert(`Venda de ${totalVenda.toFixed(2)} MZN finalizada com sucesso!`);
            setCarrinho([]);

            const data = await sql`SELECT * FROM products`;
            setProdutos(data);

        } catch (error) {
            console.error("Erro ao finalizar venda:", error);
            alert("Erro ao finalizar venda: " + error.message);
        }
    };

    const total = carrinho.reduce((acc, item) => acc + (item.price * item.qty), 0);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-100 text-lg font-semibold">A carregar produtos...</div>;

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden relative">

            {/* HEADER COM MENU E SALDO */}
            <header className="bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="p-1 hover:bg-gray-100 rounded">
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">LOJA <span className="text-blue-600">MZN</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2 border border-blue-100">
                        <Wallet className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-800">{saldo.toFixed(2)} MZN</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="relative mb-6">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3" />
                        <input type="text" placeholder="Pesquisar produto..." className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {produtos.map((prod) => (
                            <div key={prod.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                <div className="h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-semibold text-sm mb-1 truncate">{prod.name}</h3>
                                {/* O caixa NÃO vê a quantidade de stock */}
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold text-blue-600">{Number(prod.price).toFixed(2)} MZN</span>
                                    <button onClick={() => adicionarAoCarrinho(prod)} className="bg-blue-50 text-blue-600 p-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-96 bg-white border-l flex flex-col shadow-lg z-10 h-1/2 md:h-auto">
                    <div className="p-5 border-b flex justify-between items-center">
                        <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Fatura</h2>
                        <button onClick={() => setCarrinho([])} className="text-red-500 text-sm hover:underline">Limpar</button>
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto space-y-4">
                        {carrinho.length === 0 && <p className="text-center text-gray-400 mt-10">Nenhum produto.</p>}
                        {carrinho.map((item) => (
                            <div key={item.id} className="flex justify-between items-start border-b pb-2">
                                <div>
                                    <h4 className="font-semibold text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.qty} x {Number(item.price).toFixed(2)} MZN</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-bold text-sm">{Number(item.price * item.qty).toFixed(2)} MZN</span>
                                    <button onClick={() => removerDoCarrinho(item.id)} className="text-red-400 mt-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 border-t bg-gray-50">
                        <div className="flex justify-between mb-4 text-xl">
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-blue-600">{total.toFixed(2)} MZN</span>
                        </div>
                        <button
                            onClick={finalizarVenda}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex justify-between px-6 items-center"
                        >
                            <span>Finalizar Venda</span> <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </main>

            {/* MENU LATERAL DO CAIXA */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsMenuOpen(false)}></div>
            )}

            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b bg-gray-50">
                    <h2 className="font-bold text-gray-800">Menu do Caixa</h2>
                    <button onClick={() => setIsMenuOpen(false)}><X className="w-5 h-5 text-gray-600" /></button>
                </div>
                <nav className="flex flex-col p-4 gap-2">
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-600">Saldo Atual</p>
                        <p className="text-xl font-bold text-blue-800">{saldo.toFixed(2)} MZN</p>
                    </div>
                    <button onClick={() => { navigate('/pos'); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left text-gray-700">
                        <ShoppingCart className="w-5 h-5" /> Frente de Caixa
                    </button>
                    <button onClick={() => { navigate('/cashgive'); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left text-gray-700">
                        <ArrowLeftRight className="w-5 h-5" /> CashGive (Transferir)
                    </button>
                </nav>
            </div>
        </div>
    );
}
