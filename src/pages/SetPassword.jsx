import React, { useEffect } from 'react';
import { authClient } from '../lib/auth-client';

export default function SetPassword() {
    useEffect(() => {
        const definirSenha = async () => {
            try {
                const { error } = await authClient.admin.setUserPassword({
                    userId: '287885aa-c0bd-4e11-9ce3-1b7695d36dcd', // O seu ID real
                    newPassword: '1234' // A senha definida
                });

                if (error) {
                    alert("Erro: " + error.message);
                } else {
                    alert("Senha definida com sucesso! Já pode fazer login.");
                }
            } catch (err) {
                alert("Erro: " + err.message);
            }
        };
        definirSenha();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p>A processar a sua senha...</p>
        </div>
    );
}