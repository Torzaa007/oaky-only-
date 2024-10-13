import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('src/lib/databaseStorage/dbforTrain-2.db');
const db = new Database(dbPath);

export const POST = async ({ request }) => {
    const formData = await request.json();
    const { userId, tripId, seatType, quantity, totalPrice, fromStation, toStation } = formData;

    try {
        // Start a transaction
        db.prepare('BEGIN').run();

        // Convert fromStation and toStation to station_id
        const getStationId = db.prepare(`
            SELECT station_id 
            FROM STATIONS 
            WHERE station_name = ?
        `);

        const fromStationIDResult = getStationId.get(fromStation);
        const toStationIDResult = getStationId.get(toStation);

        if (!fromStationIDResult || !toStationIDResult) {
            throw new Error('Invalid station names provided.');
        }

        const fromStationID = fromStationIDResult.station_id;
        const toStationID = toStationIDResult.station_id;

        console.log(`From Station ID: ${fromStationID}, To Station ID: ${toStationID}`);

        // Find available seats
        const findSeats = db.prepare(`
            SELECT seat_id
            FROM SEAT
            JOIN TRAINS USING (train_id)
            WHERE seat_id NOT IN (SELECT reserved_seat_id FROM RESERVATIONS) 
            AND trip_id = ?
            AND seat_type = ?
            ORDER BY seat_id ASC
            LIMIT ?
        `);
        const availableSeats = findSeats.all(tripId, seatType, quantity);

        if (availableSeats.length < quantity) {
            throw new Error('Not enough seats available');
        }

        console.log('Available seats:', availableSeats);

        // Generate new payment_id
        const getLastPaymentId = db.prepare(`
            SELECT MAX(CAST(payment_id AS INTEGER)) as last_payment_id 
            FROM PAYMENT
        `);
        const result = getLastPaymentId.get();
        const lastPaymentId = result ? result.last_payment_id : 0;
        const newPaymentId = lastPaymentId + 1;

        console.log(`Last Payment ID: ${lastPaymentId}, New Payment ID: ${newPaymentId}`);

        // Insert into PAYMENT table
        const paymentInsert = db.prepare(`
            INSERT INTO PAYMENT (payment_id, amount, payment_datetime, payment_method)
            VALUES (?, ?, ?, ?)
        `);

        // Set payment datetime
        const paymentDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log('Inserting payment:', newPaymentId, totalPrice, paymentDatetime);

        // Insert payment
        paymentInsert.run(newPaymentId, totalPrice, paymentDatetime, 'PromptPay');

        // Insert into RESERVATIONS table
        const reservationInsert = db.prepare(`
            INSERT INTO RESERVATIONS (
                reserved_seat_id, passenger_id, reserve_trip_id,
                from_station_id, to_station_id, booking_datetime,
                reserve_status, payment_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const bookingDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Insert reservations
        for (const seat of availableSeats) {
            console.log('Inserting reservation:', seat.seat_id, userId, tripId, fromStationID, toStationID, bookingDatetime, 'wait', newPaymentId);
            reservationInsert.run(
                seat.seat_id,
                userId,
                tripId,
                fromStationID,
                toStationID,
                bookingDatetime,
                'wait',
                newPaymentId
            );
        }

        // Commit the transaction
        db.prepare('COMMIT').run();

        return json({ success: true, paymentId: newPaymentId });
    } catch (error) {
        // Rollback the transaction in case of error
        db.prepare('ROLLBACK').run();
        console.error('Error adding new reservation:', error);
        return json({ error: 'Unable to add new reservation', details: error.message }, { status: 500 });
    } finally {
        db.close();
    }
};
