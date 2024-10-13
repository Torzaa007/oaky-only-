import { z } from 'zod';

export const MAX_NAME_LENGTH = 50;

export const RegisterUserZodSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  confirmPassword: z.string(),
  firstname: z.string().max(MAX_NAME_LENGTH, `ชื่อต้องไม่เกิน ${MAX_NAME_LENGTH} ตัวอักษร`),
  lastname: z.string().max(MAX_NAME_LENGTH, `นามสกุลต้องไม่เกิน ${MAX_NAME_LENGTH} ตัวอักษร`),
  phonenumber: z.string().regex(/^[0-9]{1}$/, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'),
  personal_id: z.string().regex(/^[0-9]{1}$/, 'เลขบัตรประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});