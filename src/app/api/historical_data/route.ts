// src/app/api/historical_data/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (timestamp)
        id,
        device_id,
        key,
        value,
        timestamp
      FROM thingsboard_data
      WHERE key = 'ElapsedTime'
      ORDER BY timestamp DESC
      LIMIT 10
    `);
    
    const formattedData = result.rows.map(row => ({
      timestamp: row.timestamp,
      value: row.value,
      device_id: row.device_id
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}