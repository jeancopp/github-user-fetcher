import pgPromise, {IDatabase, IEventContext, IMain} from 'pg-promise';
import dotenv from 'dotenv';
import logger from "../helper/logger";

dotenv.config();

const pgp: IMain = pgPromise({
  query(e: IEventContext): void {
    logger.debug(`Command: ${e.query}`, );
    if(e.params) logger.debug(`PARAMS:${e.params}`);
  },
});

const db: IDatabase<any> = pgp({
  host: process.env?.DB_HOST ?? "localhost",
  port: parseInt(process.env?.DB_PORT ?? "5432"),
  database: process.env?.DB_NAME,
  user: process.env?.DB_USER,
  password: process.env?.DB_PASSWORD,
});

export default db;