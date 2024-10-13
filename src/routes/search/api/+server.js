import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import path from 'path';
import { generateSQLQuery } from '$lib/utils.js';

export async function POST({ request }) {
  const { line, origin, destination, date, tripId } = await request.json();

  const dbPath = path.resolve('src/lib/databaseStorage/dbforTrain-2.db');
  const db = new Database(dbPath);

  try {
    // 1. Handle fetching stations if origin and destination are not provided
    if (!origin && !destination) {
      let stationsQuery = `SELECT station_id, station_name FROM STATIONS`;
      if (line) {
        stationsQuery += ` WHERE station_id LIKE '%_${line.toLowerCase()}_%'`;
      }
      const allStations = db.prepare(stationsQuery).all();
      return json({ stations: allStations });
    }

    // 2. Handle fetching trips if origin, destination, and date are provided
    if (origin && destination && date) {
      const tripsQuery = generateSQLQuery(origin, destination, date);
      const trips = db.prepare(tripsQuery).all();
      return json({ trips });
    }

    // 3. Handle the case when tripId is provided (to fetch trip details)
    if (tripId) {
      const tripDetailsQuery = `
        SELECT trip_id, seat_id, seat_type, coach_id, substr((class_1),1,1) as class, 
               count(seat_id) as available_seats, price,
               s.station_name AS 'start', s2.station_name AS 'end', 
               s.station_id 'start_id', s2.station_id 'end_id'
        FROM SEAT
        JOIN PAX_COACHES USING (coach_id)
        JOIN TRAINS USING (train_id)
        JOIN SEAT_TYPE USING (seat_type)
        JOIN TRIPS t USING (trip_id) 
        JOIN STATIONS s ON t.start_station_id = s.station_id
        JOIN STATIONS s2 ON t.end_station_id = s2.station_id
        WHERE seat_id NOT IN (SELECT reserved_seat_id FROM RESERVATIONS)
        AND trip_id = ?
        GROUP BY trip_id, seat_type;
      `;
      const tripsQ = db.prepare(tripDetailsQuery).all(tripId);

      console.log('Received trip ID:', tripId);
      console.log('Queried trip details:', tripsQ);

      if (tripsQ.length > 0) {
        return json({ success: true, tripsQ });
      } else {
        return json({ success: false, error: 'ไม่พบข้อมูลสำหรับทริปนี้' }, { status: 400 });
      }
    }

    // 4. Handle missing date error
    if (!date) {
      return json({ error: 'กรุณาเลือกวันที่เดินทาง' }, { status: 400 });
    }

    // Fallback: if none of the above conditions match
    return json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });

  } catch (error) {
    console.error('Error fetching data:', error);
    return json({ stations: [], trips: [], error: 'ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้' }, { status: 500 });
  } finally {
    db.close(); // Ensure the database is closed properly
  }
}

//Tor

// // Function to handle POST request from frontend and query trip details
// export async function POST({ request }) {
//     const dbPath = path.resolve('src/lib/databaseStorage/dbforTrain-2.db'); // Ensure this path is correct
//     const db = new Database(dbPath);
    
//     try {
//         const { tripId } = await request.json();

//         if (!tripId) {
//             return json({ success: false, message: 'Trip ID is required' }, { status: 400 });
//         }

//         // Query the database to get the trip details based on the selected trip_id
//         const tripDetailsQuery = `
//             SELECT trip_id, seat_id, seat_type, coach_id, substr((class_1),1,1) as class, count(seat_id) as available_seats, price,
//             s.station_name AS 'start', s2.station_name AS 'end', s.station_id 'start_id', s2.station_id 'end_id'
//             FROM SEAT
//             JOIN PAX_COACHES USING (coach_id)
//             JOIN TRAINS USING (train_id)
//             join SEAT_TYPE USING (seat_type)
//             join TRIPS t using (trip_id) 
//             JOIN STATIONS s ON t.start_station_id = s.station_id
//             JOIN STATIONS s2 ON s2.station_id = t.end_station_id
//             WHERE seat_id NOT IN (SELECT reserved_seat_id FROM RESERVATIONS)
//             AND trip_id = ?
//             GROUP BY trip_id, seat_type;
//         `;
//         const tripsQ = db.prepare(tripDetailsQuery).all(tripId);

//         console.log('Received trip ID:', tripId);
//         console.log('Queried trip details:', tripsQ);

//         // Return the queried trip details back to the frontend
//         return json({ success: true, tripsQ });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return json({ success: false, message: 'Failed to retrieve trip details' }, { status: 500 });
//     } finally {
//         db.close();
//     }
// }
