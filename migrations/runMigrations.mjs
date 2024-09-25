const pgp = require('pg-promise')();
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis de ambiente

const db = pgp({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const runMigrations = async () => {
  try {
    const files = fs.readdirSync(__dirname);
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(__dirname, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        await db.none(sql);
        console.log(`Executed ${file}`);
      }
    }
    pgp.end();
  } catch (error) {
    console.error('Error running migrations:', error);
    pgp.end();
  }
};

runMigrations();
