import React, { useState, useEffect } from 'react';
import { sql } from '../lib/db';
import { Bell, X, Check } from 'lucide-react';

export default function Notificacoes() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [aberto, setAberto] = useState(false);

    // Busca as notificações não lidas
    const fetchNotificacoes = async () => {
        try {
            const result = await sql`SELECT * FROM notifications WHERE is_read = false ORDER BY created_at DESC`;
            setNotificacoes(result);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    // Atualiza automaticamente a cada 10 segundos
    useEffect(() => {
        fetchNotificacoes();
        const interval = setInterval(fetchNotificacoes, 10000);
        return () => clearInterval(interval);
    }, []);

    // Marca como lida e remove da lista
    const marcarComoLida = async (id) => {
        try {
            await sql`UPDATE notifications SET is_read = true WHERE id = ${id}`;
            setNotificacoes(notificacoes.filter(n => n.id !== id));
        } catch (error) {
            alert("Erro ao marcar como lida.");
        }
    };

    return (
        <div className="relative">
            {/* Ícone do Sino */}
            <button
                onClick={() => setAberto(!aberto)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
                <Bell size={24} />
                {notificacoes.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {notificacoes.length}
                    </span>
                )}
            </button>

            {/* Painel que abre ao clicar */}
            {aberto && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-gray-800">Notificações</h3>
                        <button onClick={() => setAberto(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notificacoes.length === 0 ? (
                            <p className="p-4 text-center text-gray-500 text-sm">Nenhuma notificação nova.</p>
                        ) : (
                            notificacoes.map((notif) => (
                                <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-blue-50 transition-colors">
                                    <p className="font-semibold text-sm text-gray-800">{notif.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notif.created_at).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <button
                                        onClick={() => marcarComoLida(notif.id)}
                                        className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
                                    >
                                        <Check size={14} /> Marcar como lida
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}