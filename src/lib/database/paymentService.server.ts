import Database from 'better-sqlite3';

const db = new Database('src/lib/databaseStorage/dbforTrain-2.db', { verbose: console.log });

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function processPayment(paymentId: number, paymentMethod: string) {
  const updateReservationStmt = db.prepare(`
    UPDATE RESERVATIONS
    SET reserve_status = 'ready'
    WHERE payment_id = ? AND reserve_status = 'wait'
  `);

  const updatePaymentStmt = db.prepare(`
    UPDATE PAYMENT
    SET payment_datetime = ?, payment_method = ?
    WHERE payment_id = ?
  `);

  const transaction = db.transaction((paymentId: number, paymentMethod: string) => {
    // อัปเดตสถานะการจอง
    const reservationResult = updateReservationStmt.run(paymentId);
    if (reservationResult.changes === 0) {
      throw new Error('No reservation found with the given payment_id or status is not "wait"');
    }

    // จัดรูปแบบวันที่เป็น YYYY-MM-DD HH:MM:SS
    const paymentDate = formatDate(new Date());

    // อัปเดตข้อมูลการชำระเงิน
    const paymentResult = updatePaymentStmt.run(paymentDate, paymentMethod, paymentId);
    if (paymentResult.changes === 0) {
      throw new Error('Failed to update payment record');
    }

    return { updatedReservation: reservationResult.changes, updatedPayment: paymentResult.changes };
  });

  try {
    const result = transaction(paymentId, paymentMethod);
    console.log(`Payment processed successfully. Updated reservations: ${result.updatedReservation}, Updated payments: ${result.updatedPayment}`);
    return result;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}