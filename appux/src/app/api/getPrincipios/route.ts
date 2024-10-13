import { conn } from "@/utils/db";

export async function GET() {
    try {
        const result = await conn?.query('SELECT * FROM principio');
        const principios = result?.rows

        if (principios) {
           return new Response(JSON.stringify({principios}), {status: 200}) 
        } else {
            return new Response('No hay principios', {status: 404})
        }
    } catch (error) {
        console.log(error)
        return new Response('Error del Servidor', {status: 500})    
    }
};