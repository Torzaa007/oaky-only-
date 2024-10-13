// src/routes/ticket/+page.server.js
import { processPayment } from '$lib/database/paymentService.server';
import { fail, redirect } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import path from 'path';

export const load = async ({ url }) => {
  const dbPath = path.resolve('src/lib/databaseStorage/dbforTrain-2.db');
  const db = new Database(dbPath);

  const paymentId = url.searchParams.get('paymentId');

  if (!paymentId) {
    throw redirect(303, '/'); // เปลี่ยนเส้นทางไปยังหน้าแรกถ้าไม่มี paymentId
  }

  try {
    const tickets = db.prepare(`
      SELECT
        p.passenger_id, p.firstname, p.lastname, p.phonenumber,
        r.reserved_seat_id, r.reserve_trip_id, r.passenger_id, r.payment_id, r.reserve_status,
        r.from_station_id, r.to_station_id,
        s.seat_id, s.seat_type, s.train_id,
        sta_from.station_name AS from_station_name,
        sta_to.station_name AS to_station_name,
        t.from_datetime, t.trip_id,
        train.train_id, train.train_name
      FROM PASSENGERS p 
      JOIN RESERVATIONS r ON p.passenger_id = r.passenger_id
      JOIN TRIPS t ON r.reserve_trip_id = t.trip_id
      JOIN STATIONS sta_from ON sta_from.station_id = r.from_station_id
      JOIN STATIONS sta_to ON sta_to.station_id = r.to_station_id
      JOIN SEAT s ON s.seat_id = r.reserved_seat_id
      JOIN SEAT_TYPE st ON s.seat_type = st.seat_type
      JOIN TRAINS train ON s.train_id = train.train_id
      WHERE r.payment_id = ?
    `).all(paymentId);

    if (tickets.length === 0) {
      return {
        error: 'ไม่พบตั๋วสำหรับ Payment ID นี้'
      };
    }

    return {
      tickets
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      error: 'ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้'
    };
  } finally {
    db.close();
  }
};

export const actions = {
  simulatePayment: async ({ request }) => {
    const formData = await request.formData();
    const paymentId = formData.get('payment_id');
    const paymentMethod = formData.get('payment_method');

    if (!paymentId || !paymentMethod) {
      return fail(400, { message: 'ข้อมูลไม่ครบถ้วน' });
    }

    try {
      // ประมวลผลการชำระเงิน
      await processPayment(paymentId, paymentMethod);
      
      // เปลี่ยนเส้นทางไปยังหน้าตั๋วพร้อมกับ paymentId
      throw window.location.href(303, `/ticket?paymentId=${(paymentId)}`);
    } catch (error) {
      // บันทึกข้อผิดพลาดจริง
      console.error('Payment simulation error:', error);
      
      // ส่งกลับข้อผิดพลาดให้ผู้ใช้
      return fail(500, { message: 'การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
    }
  }
};