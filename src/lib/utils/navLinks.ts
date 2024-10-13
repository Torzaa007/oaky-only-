import { route } from '$lib/ROUTES';
import type { AriaAttributes } from 'svelte/elements';

// Type for navigation link
export type NavLink = {
	href: string;
	title: string;
	ariaLabel?: AriaAttributes['aria-label'];
	isExternal?: boolean;
};

export const createNavLink = ({ title, href, ariaLabel, isExternal }: NavLink) => {
	if (!title || !href) {
		throw new Error('Title and href are required to create a NavLink');
	}

	return {
		title,
		href,
		ariaLabel: ariaLabel ?? title,
		isExternal
	};
};

export const mainNavLinks = {
	home: createNavLink({
		title: 'Home',
		href: route('/'),
		ariaLabel: 'Go to home page'
	}),

	dashboard: createNavLink({
		title: 'Dashboard',
		href: route('/dashboard'),
		ariaLabel: 'Go to dashboard page'
	}),

	login: createNavLink({
		title: 'เข้าสู่ระบบ',
		href: route('/auth/login'),
		ariaLabel: 'Go to login page'
	}),

	register: createNavLink({
		title: 'ลงทะเบียน',
		href: route('/auth/register'),
		ariaLabel: 'Go to register page'
	}),
	
	list_ticket: createNavLink(
		{
			title: "รายการตั๋วโดยสาร",
			href: route('/list_ticket'),
			ariaLabel: 'Go to list ticket'
		}
	),
	show_trip: createNavLink(
		{
			title: "ค้นหาเที่ยวโดยสาร",
			href: route('/search'),
			ariaLabel: 'Go to show trip'
		}
	)


} as const;
