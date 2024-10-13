'use server';

import { z } from 'zod';
import { signIn, signOut } from '../auth';
import { loginSchema } from '../lib/zod';

export const loginAction = async (
    values: z.infer<typeof loginSchema>,
) => {
    try {
        await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        });
    } catch (error) {
        console.error(error);
    }
};

export const signOutAction = async () => {
    try {
        await signOut();
        console.log("Sesión cerrada");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};