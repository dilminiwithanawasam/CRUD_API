// src/config/db.js
import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL);

export default db;  // ✅ this is required for `import db from ...`
