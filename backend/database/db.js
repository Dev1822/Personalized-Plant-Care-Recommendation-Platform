// database/db.js - SQLite connection pool wrapper
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

let dbPromise = open({
  filename: path.join(__dirname, 'plantpal.sqlite'),
  driver: sqlite3.Database
});

const pool = {
  getConnection: async () => {
    const db = await dbPromise;
    return {
      release: () => {}, // no-op for compatibility
      execute: async (sql, params = []) => {
        sql = sql.replace(/INSERT IGNORE/g, 'INSERT OR IGNORE');
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const rows = await db.all(sql, params);
          return [rows, []];
        } else {
          const result = await db.run(sql, params);
          return [{ insertId: result.lastID, affectedRows: result.changes }, []];
        }
      },
      end: async () => {} // no-op
    };
  },
  execute: async (sql, params = []) => {
    const conn = await pool.getConnection();
    return conn.execute(sql, params);
  }
};

async function testConnection() {
  try {
    await dbPromise;
    console.log('✅ SQLite connected successfully');
  } catch (err) {
    console.error('❌ SQLite connection failed:', err.message);
  }
}

testConnection();

module.exports = pool;
