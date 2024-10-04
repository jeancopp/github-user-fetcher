import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

const pgp = pgPromise();
const {parsed} = dotenv.config();

const db = pgp({
  host: parsed?.DB_HOST ?? "localhost",
  port: parseInt(parsed?.DB_PORT ?? "5432"),
  database: parsed?.DB_NAME,
  user: parsed?.DB_USER,
  password: parsed?.DB_PASSWORD,
});

export default db;