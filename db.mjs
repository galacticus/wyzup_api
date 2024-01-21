import mysql from 'mysql2/promise';

// Configure your MySQL connection
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'clive',
    password: 'Redpill21((',
    database: 'wyzup'
});

export async function query(sql, params) {
    const [results, ] = await pool.query(sql, params);
    return results;
}

