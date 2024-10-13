import type { Actions, PageServerLoad } from './$types';

import { message, setError, superValidate } from 'sveltekit-superforms/server';

import {
	checkIfEmailExists,
	deleteAllUsers,
	getAllUsers,
	insertNewUser
} from '$lib/database/databaseUtils.server';
import type { AlertMessageType } from '$lib/types';
import { logError } from '$lib/utils';
import { RegisterUserZodSchema } from '$validations/RegisterUserZodSchema';
import { SESSION_COOKIE_NAME } from '$lib/constants';

export const load = (async () => {
	return {
		registerUserFormData: await superValidate(RegisterUserZodSchema),

		allUsers: await getAllUsers()
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteAllUsers: async ({ cookies }) => {
		await deleteAllUsers();

		cookies.delete(SESSION_COOKIE_NAME, {
			path: '/'
		});
	},

	registerUser: async ({ request }) => {
		const registerUserFormData = await superValidate<
		  typeof RegisterUserZodSchema,
		  AlertMessageType
		>(request, RegisterUserZodSchema);
	
		if (registerUserFormData.valid === false) {
		  console.log('Validation Errors:', registerUserFormData.errors);
	
		  return message(registerUserFormData, {
			alertType: 'error',
			alertText: 'ลงทะเบียนสมาชิกไม่สำเร็จ'
		  });
		}
	
		try {
		  const isEmailAlreadyRegistered = await checkIfEmailExists(registerUserFormData.data.email);
	
		  if (isEmailAlreadyRegistered === true) {
			return setError(registerUserFormData, 'email', 'อีเมล์นี้ได้ลงทะเบียนไว้แล้ว');
		  }
	
		  if (registerUserFormData.data.password !== registerUserFormData.data.confirmPassword) {
			return setError(registerUserFormData, 'confirmPassword', 'รหัสผ่านไม่ตรงกัน');
		  }
	
		  await insertNewUser({
			firstname: registerUserFormData.data.firstname,
			lastname: registerUserFormData.data.lastname,
			email: registerUserFormData.data.email,
			password: registerUserFormData.data.password,
			phonenumber: registerUserFormData.data.phonenumber,
			personal_id: registerUserFormData.data.personal_id,
		  });
	
		  return message(registerUserFormData, {
			alertType: 'success',
			alertText: 'สมัครสมาชิกสำเร็จ'
		  });
		} catch (error) {
		  logError(error);
	
		  return message(registerUserFormData, {
			alertType: 'error',
			alertText: 'ลงทะเบียนสมาชิกไม่สำเร็จ'
		  });
		}
	  },
	};

