// pages/api/historical-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}