import pgPromise, {IDatabase, IMain} from 'pg-promise';
import dotenv from 'dotenv';
dotenv.config();

const pgp: IMain = pgPromise();

const db: IDatabase<any> = pgp({
  host: process.env?.DB_HOST ?? "localhost",
  port: parseInt(process.env?.DB_PORT ?? "5432"),
  database: process.env?.DB_NAME,
  user: process.env?.DB_USER,
  password: process.env?.DB_PASSWORD,
});

export default db;