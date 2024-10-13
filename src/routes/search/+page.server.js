import { redirect } from '@sveltejs/kit';

export const actions = {
  saveTrip: async ({ request, locals }) => {
    const data = await request.formData();
    const bookingInfo = JSON.parse(data.get('bookingInfo'));

    if (!locals.session) {
      locals.session = {};
    }

    const tripData = {
      tripId: bookingInfo.tripId,
      tripName: bookingInfo.tripName,
      startStation: bookingInfo.startName,
      endStation: bookingInfo.endName,
      fromDatetime: bookingInfo.fromDatetime,
      toDatetime: bookingInfo.toDatetime,
      availableClasses: bookingInfo.availableClasses,
      user_from_station: bookingInfo.user_from_station,
      user_to_station: bookingInfo.user_to_station
    };
    console.log("from_server", tripData)
    if (locals.session) {
      locals.session.trip = tripData;
    } else {
      console.warn('Session is not available. Using alternative method to pass data.');
    }

    const searchParams = new URLSearchParams(tripData);
    throw redirect(302, `/reservation?${searchParams.toString()}`);
  }
};

