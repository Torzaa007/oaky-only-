import { processPayment } from '$lib/database/paymentService.server';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export const actions = {
  simulatePayment: async ({ request }) => {
    console.log('Starting payment simulation');
    const formData = await request.formData();
    const paymentId = Number(formData.get('payment_id'));
    const paymentMethod = formData.get('payment_method');

    console.log(`Payment ID: ${paymentId}, Payment Method: ${paymentMethod}`);

    if (!paymentId || !paymentMethod) {
      console.error('Missing payment information');
      return fail(400, { message: 'ข้อมูลการชำระเงินไม่ครบถ้วน' });
    }

    // เรียก processPayment และตรวจสอบข้อผิดพลาด
    const result = await processPayment(paymentId, paymentMethod);

    if (result.error) {  // สมมติว่าผลลัพธ์มี field 'error' เมื่อเกิดข้อผิดพลาด
      console.error('Payment simulation error:', result.error);
      return fail(500, { 
        message: 'Failed to simulate payment', 
        details: result.error
      });
    }

    // ถ้าไม่มีข้อผิดพลาดให้ redirect ไปยังหน้าที่กำหนด
    console.log(`Redirecting to: /ticket?paymentId=${paymentId}`);
    throw redirect(303, `/ticket?paymentId=${paymentId}`);
  }
};
