import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

const pgp = pgPromise();
const {parsed} = dotenv.config();

const db = pgp({
  host: parsed?.POSTGRES_HOST ?? "localhost",
  port: parseInt(parsed?.POSTGRES_PORT ?? "5432"),
  database: parsed?.POSTGRES_DB,
  user: parsed?.POSTGRES_USER,
  password: parsed?.POSTGRES_PASSWORD,
});

export default db;