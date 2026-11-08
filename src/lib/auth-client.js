import { createAuthClient } from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

// NOVA AUTH URL DO PROJETO SISTEMA-VENDAS-V2
const AUTH_URL = "https://ep-calm-mode-beyddui0.neonauth.c-9.us-east-2.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(AUTH_URL, {
    adapter: BetterAuthReactAdapter(),
});