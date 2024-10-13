// src/routes/api/stations/+server.js
import Database from 'better-sqlite3';
import path from 'path';

export async function GET({ url }) {
  const choice = url.searchParams.get('choice') || 'nl';
  const dbPath = path.resolve('/Users/oakky/Documents/star_rail/list/src/dbforTrain.db');
  const db = new Database(dbPath);

  try {
    let query;
    if (choice === 'nl') {
      query = `
        SELECT station_name
        FROM STATIONS
        WHERE station_id LIKE '%nl%'
        OR station_id IN ('st_01', 'st_02', 'st_03');
      `;
    } else if (choice === 'ne') {
      query = `
        SELECT station_name
        FROM STATIONS
        WHERE station_id LIKE '%ne%'
        OR station_id IN ('st_01', 'st_02', 'st_03');
      `;
    }

    const stations = db.prepare(query).all();

    return new Response(JSON.stringify({ stations }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch data from the database' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    db.close();
  }
}