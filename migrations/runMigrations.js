const pgp = require('pg-promise')();
const fs = require('fs');
const path = require('path');

const {parsed} = require('dotenv').config();

//TODO: There is two source of true to connect into db.
const db = pgp({
  host: parsed?.POSTGRES_HOST ?? "localhost",
  port: parseInt(parsed?.POSTGRES_PORT ?? "5432"),
  database: parsed?.POSTGRES_DB,
  user: parsed?.POSTGRES_USER,
  password: parsed?.POSTGRES_PASSWORD,
});

try {
  const files =
    fs.readdirSync(__dirname)
      .filter( f => f.endsWith('.sql'));

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    db.none(sql)
      .then(() => console.log(`Executed ${file}`))
      .then(err => console.log(err));
  }
  
} catch (error) {
  console.error('Error running migrations:', error);
}finally {
  pgp.end();
}

