import type { Actions, PageServerLoad } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
import { SESSION_COOKIE_NAME } from '$lib/constants';
import { route } from '$lib/ROUTES';


export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete(SESSION_COOKIE_NAME, {
			path: route('/')
		});

		throw redirect(303, route('/auth/login'));
	}
};
