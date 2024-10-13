import { writable } from 'svelte/store';

export const selectedLine = writable('');
export const origin = writable('');
export const destination = writable('');
export const selectedDate = writable('');
export const trips = writable([]);
export const isLoading = writable(false);
export const noTrips = writable(false);