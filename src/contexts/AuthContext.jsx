import React, { createContext, useState, useEffect, useContext } from 'react';
import { authClient } from '../lib/auth-client';
import { sql } from '../lib/db';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'supervisor', 'cashier', etc.
    const [loading, setLoading] = useState(true);

    // Verifica a sessão ao abrir o sistema
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await authClient.getSession();
                if (data?.session) {
                    setUser(data.user);

                    // Busca o cargo no banco
                    const result = await sql`SELECT role FROM profiles WHERE id = ${data.user.id}`;
                    if (result && result.length > 0) {
                        setRole(result[0].role);
                    } else {
                        setRole('cashier');
                    }
                }
            } catch (error) {
                console.log("Nenhuma sessão ativa.");
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    // Função de Login que já retorna o cargo
    const login = async (email, password) => {
        const loginFormatado = email.includes('@')
            ? email
            : `${email.replace(/\s+/g, '')}@sistema.com`;

        const { data, error } = await authClient.signIn.email({
            email: loginFormatado,
            password: password,
        });

        if (error) throw new Error(error.message);

        // Busca o cargo no banco imediatamente após o login
        let cargoDoUsuario = 'cashier'; // Padrão
        try {
            const result = await sql`SELECT role FROM profiles WHERE id = ${data.user.id}`;
            if (result && result.length > 0) {
                cargoDoUsuario = result[0].role;
            }
        } catch (err) {
            console.error("Erro ao buscar perfil no login:", err);
        }

        // Atualiza o estado global
        setUser(data.user);
        setRole(cargoDoUsuario);

        // Retorna o cargo para o arquivo login.jsx usar
        return cargoDoUsuario;
    };

    // Função de Logout
    const logout = async () => {
        await authClient.signOut();
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);