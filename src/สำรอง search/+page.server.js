import Database from 'better-sqlite3';
import path from 'path';

export async function load() {
  // Correcting the path to the database
  const dbPath = path.resolve('/Users/oakky/Documents/star_rail/list/src/dbforTrain.db');
  const db = new Database(dbPath);

  try {
    // Query: Fetching data from STATIONS table
    const stations = db.prepare(`
      SELECT station_name
      FROM STATIONS
      WHERE station_id LIKE '%nl%'
      OR station_id IN ('st_01', 'st_02', 'st_03');
    `).all();

    console.log('Fetched stations:', stations);

    // Ensure stations is an array
    return {
      stations: stations || [] // Return an empty array if no stations found
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      error: 'Unable to fetch data from the database',
      stations: [] // Return an empty array on error
    };
  } finally {
    db.close();
  }
}