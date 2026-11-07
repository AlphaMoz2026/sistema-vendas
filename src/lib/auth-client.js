import { createAuthClient } from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

const AUTH_URL = "https://ep-wild-field-be46xgdd.neonauth.c-9.us-east-2.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(AUTH_URL, {
    adapter: BetterAuthReactAdapter(),
});