import React, { useEffect } from 'react';
import { authClient } from '../lib/auth-client';

export default function CreateAccount() {
    useEffect(() => {
        const criarConta = async () => {
            try {
                // O signUp cria o utilizador e a senha corretamente
                const { error } = await authClient.signUp.email({
                    email: 'alphadigitalofficialmoz@gmail.com',
                    password: 'ADMINM1234',
                    name: 'Augusto Simone',
                });

                if (error) {
                    alert("Erro: " + error.message);
                } else {
                    alert("Conta criada com sucesso! Já pode fazer login.");
                }
            } catch (err) {
                alert("Erro: " + err.message);
            }
        };
        criarConta();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <p>A criar conta...</p>
        </div>
    );
}