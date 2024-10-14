import {Pool} from 'pg';
import 'dotenv/config';

let conn: Pool | null = null;

if(!conn){
    conn = new Pool({
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10): undefined,
        database: process.env.DATABASE_NAME
    })
}

export {conn};