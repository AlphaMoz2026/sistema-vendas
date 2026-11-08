import React, { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { sql } from '../lib/db';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // --- FUNÇÃO TEMPORÁRIA PARA CRIAR O ADMIN ---
    const criarAdmin = async () => {
        const { data, error } = await authClient.signUp.email({
            email: 'alphadigitalofficialmoz@gmail.com',
            password: 'admin1234', // A senha que quer usar
            name: 'Augusto Simone',
        });
        if (error) alert("Erro ao criar: " + error.message);
        else alert("Admin criado com sucesso! Já pode fazer login.");
    };
    // ------------------------------------------

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Verifica se é um email ou um número de celular
            const loginFormatado = email.includes('@')
                ? email
                : `${email.replace(/\s+/g, '')}@sistema.com`;

            // 2. Faz o login no Neon Auth
            const { data, error } = await authClient.signIn.email({
                email: loginFormatado,
                password
            });

            if (error) throw error;

            // 3. Vai buscar o 'role' (cargo) à tabela de perfis
            let userRole = 'cashier';
            try {
                const perfil = await sql`SELECT role FROM profiles WHERE id = ${data.user.id}`;
                if (perfil.length > 0) {
                    userRole = perfil[0].role;
                }
            } catch (dbError) {
                console.warn("Aviso: Não foi possível ler o role da base de dados.", dbError);
            }

            // 4. Redireciona consoante o cargo
            if (userRole === 'supervisor' || userRole === 'admin' || loginFormatado === 'alphadigitalofficialmoz@gmail.com') {
                navigate('/admin');
            } else {
                navigate('/pos');
            }

        } catch (error) {
            alert("Erro ao entrar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">SISTEMA</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email ou Celular</label>
                        <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ex: 841234567 ou o seu email"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="A sua senha"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition">
                        {loading ? 'A entrar...' : 'Entrar'}
                    </button>

                    {/* BOTÃO TEMPORÁRIO - APAGAR DEPOIS DE USAR */}
                    <button
                        type="button"
                        onClick={criarAdmin}
                        className="w-full mt-2 bg-gray-200 text-gray-700 p-2 rounded text-sm font-semibold hover:bg-gray-300 transition"
                    >
                        [TEMPORÁRIO] Criar Conta Admin
                    </button>

                </form>
            </div>
        </div>
    );
}