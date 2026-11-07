import React, { useEffect } from 'react';
import { authClient } from '../lib/auth-client';

export default function CreateAdmin() {
    useEffect(() => {
        const criarAdmin = async () => {
            try {
                const { error } = await authClient.admin.createUser({
                    email: 'admin@sistema.com',
                    password: '1234',
                    name: 'Augusto Simone',
                    role: 'admin',
                });

                if (error) {
                    alert("Erro: " + error.message);
                } else {
                    alert("Admin criado com sucesso! Use 'admin' e a senha 1234.");
                }
            } catch (err) {
                alert("Erro: " + err.message);
            }
        };
        criarAdmin();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p>A criar admin...</p>
        </div>
    );
}