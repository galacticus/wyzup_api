import mysql from 'mysql2/promise';

// Configure your MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'clive',
    password: 'Redpill21((',
    database: 'wyzup'
});

export async function query(sql, params) {
    const [results, ] = await pool.query(sql, params);
    return results;
}

