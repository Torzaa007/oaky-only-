import { redirect } from 'sveltekit-flash-message/server';
import { SESSION_COOKIE_NAME } from '$lib/constants';
import { getUserName } from '$lib/database/databaseUtils.server';
import { route } from '$lib/ROUTES';
import path from 'path';
import Database from 'better-sqlite3'; // ตรวจสอบว่าได้ติดตั้งและนำเข้าไลบรารีที่ถูกต้อง

export const load = async ({ cookies, url }) => {
  const userId = cookies.get(SESSION_COOKIE_NAME);

  // ตรวจสอบการล็อคอิน
  if (!userId) {
    // ถ้าไม่ได้ล็อกอิน ให้พาไปที่หน้าล็อกอินพร้อมข้อความเตือน
    throw redirect(
      route('/auth/login'),
      {
        type: 'error',
        message: 'กรุณาเข้าสู่ระบบเพื่อดูหน้านี้'
      },
      cookies
    );
  }

  // ถ้าล็อกอินแล้ว ให้ดำเนินการดึงข้อมูลผู้ใช้และการจอง
  const dbPath = path.resolve('src/lib/databaseStorage/dbforTrain-2.db');
  let db;
  let reservations;
  let loggedOnUserName;

  try {
    // เปิดการเชื่อมต่อกับฐานข้อมูล
    db = new Database(dbPath);

    // สอบถามข้อมูลการจองของผู้ใช้
    reservations = db
      .prepare(`
        SELECT
          r.reserved_seat_id, reserve_status, r.reserve_trip_id, r.passenger_id, r.booking_datetime,
          r.from_station_id, r.to_station_id, r.payment_id,
          s.seat_id, s.seat_type,
          st.price,
          sta_from.station_name AS from_station_name,
          sta_to.station_name AS to_station_name,
          t.from_datetime, t.route
        FROM RESERVATIONS r
        JOIN TRIPS t ON r.reserve_trip_id = t.trip_id
        JOIN STATIONS sta_from ON sta_from.station_id = r.from_station_id
        JOIN STATIONS sta_to ON sta_to.station_id = r.to_station_id
        JOIN SEAT s ON s.seat_id = r.reserved_seat_id
        JOIN SEAT_TYPE st ON s.seat_type = st.seat_type
        WHERE r.passenger_id = ?
      `)
      .all(userId);

    // ดึงชื่อผู้ใช้ที่ล็อกอินอยู่
    loggedOnUserName = await getUserName(userId);

  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  } finally {
    // ปิดการเชื่อมต่อฐานข้อมูล
    if (db) {
      db.close();
    }
  }

  // ส่งข้อมูลกลับไปยัง frontend
  return {
    session: userId,  // ส่งข้อมูลเซสชันไปยัง frontend
    reservations,  // ส่งข้อมูลการจอง
    loggedOnUserName // ส่งชื่อผู้ใช้ที่ล็อกอิน
  };
};