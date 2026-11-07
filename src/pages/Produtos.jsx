import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sql } from '../lib/db';

export default function Produtos() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados do formulário
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [stock, setStock] = useState('');
    const [imagem, setImagem] = useState('');

    const fetchProdutos = async () => {
        try {
            const data = await sql`SELECT * FROM products ORDER BY created_at DESC`;
            setProdutos(data);
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const adicionarProduto = async (e) => {
        e.preventDefault();
        try {
            await sql`
        INSERT INTO products (name, price, stock_quantity, image_url)
        VALUES (${nome}, ${preco}, ${stock}, ${imagem})
      `;
            alert("Produto adicionado com sucesso!");
            // Limpar o formulário
            setNome(''); setPreco(''); setStock(''); setImagem('');
            // Atualizar a lista
            fetchProdutos();
        } catch (error) {
            alert("Erro ao adicionar: " + error.message);
        }
    };

    const apagarProduto = async (id) => {
        if (!confirm("Tem a certeza que quer apagar este produto?")) return;
        try {
            await sql`DELETE FROM products WHERE id = ${id}`;
            fetchProdutos();
        } catch (error) {
            alert("Erro ao apagar: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/admin')} className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Gestão de Produtos</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* FORMULÁRIO */}
                <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Novo Produto</h2>
                    <form onSubmit={adicionarProduto} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nome</label>
                            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Preço (MZN)</label>
                                <input type="number" required value={preco} onChange={(e) => setPreco(e.target.value)} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Stock</label>
                                <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-2 border rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">URL da Imagem (Opcional)</label>
                            <input type="text" value={imagem} onChange={(e) => setImagem(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded-lg" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                            <Plus className="w-4 h-4" /> Adicionar Produto
                        </button>
                    </form>
                </div>

                {/* LISTA DE PRODUTOS */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Produtos em Stock</h2>
                    {loading ? (
                        <p>A carregar...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b text-gray-500 text-sm">
                                        <th className="pb-3">Produto</th>
                                        <th className="pb-3">Preço</th>
                                        <th className="pb-3">Stock</th>
                                        <th className="pb-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtos.map((prod) => (
                                        <tr key={prod.id} className="border-b last:border-0">
                                            <td className="py-3 flex items-center gap-3">
                                                {prod.image_url ? (
                                                    <img src={prod.image_url} alt={prod.name} className="w-10 h-10 rounded object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                                )}
                                                <span className="font-semibold">{prod.name}</span>
                                            </td>
                                            <td className="py-3">{Number(prod.price).toFixed(2)} MZN</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock_quantity <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {prod.stock_quantity} un.
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <button onClick={() => apagarProduto(prod.id)} className="text-red-500 hover:text-red-700 p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
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