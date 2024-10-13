
// src/routes/+layout.server.js
import Database from 'better-sqlite3';
import path from 'path';

import { loadFlash } from 'sveltekit-flash-message/server';
import { SESSION_COOKIE_NAME } from '$lib/constants';
import { createBaseMetaTags } from '$lib/utils/metaTags';

export const load = loadFlash(async ({ url, cookies }) => {
  const baseMetaTags = createBaseMetaTags(url);
  const session = cookies.get(SESSION_COOKIE_NAME);
  const dbPath = path.resolve('src/lib/databaseStorage/dbforTrain-2.db');
  const db = new Database(dbPath);

  const trips = db.prepare(`
    SELECT 
    CONCAT(
        UPPER(SUBSTRING(t.trip_id, 4, 2)), 
        SUBSTRING(t.trip_id, 7), ' ', 
        s1.station_name, '-', s2.station_name
    ) AS trip_name,
    t.trip_id,
    t.staff_id,
    t.start_station_id start_id,
    t.end_station_id end_id,
    s1.station_name AS start,
    s2.station_name AS end,
    t.route,
    t.from_datetime
FROM 
    TRIPS t
LEFT JOIN 
    STATIONS s1 ON t.start_station_id = s1.station_id
LEFT JOIN 
    STATIONS s2 ON t.end_station_id = s2.station_id
LEFT JOIN 
    RESERVATIONS r ON t.trip_id = r.reserve_trip_id
LEFT JOIN 
    SEAT st ON r.reserved_seat_id = st.seat_id
LEFT JOIN 
    PAX_COACHES pc ON st.coach_id = pc.coach_id
GROUP BY 
    t.trip_id;

  `).all();

  
  return {
    session,  // ส่งข้อมูล session กลับไปเพื่อใช้งานในส่วนอื่น
    baseMetaTags: Object.freeze(baseMetaTags),
    trips
  };
});

