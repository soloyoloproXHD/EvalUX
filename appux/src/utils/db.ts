import {Pool} from 'pg';
import 'dotenv/config';

let conn: Pool | null = null;

if(!conn){
    conn = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
}

export {conn};