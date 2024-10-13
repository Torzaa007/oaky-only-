export function get_personinfo(userID) {
    const sqlQuery = `
      SELECT firstname, lastname, email, phonenumber, passenger_id
      FROM PASSENGERS
      WHERE passenger_id = ?`;
    console.log(`SQL Query: ${sqlQuery}`);
    return { query: sqlQuery, params: [userID] };
  }
  export function count_seat(tripID) {
    const sqlQuery = `
    SELECT trip_id, seat_type, COUNT(seat_id) as available_seats
    FROM SEAT
    JOIN PAX_COACHES
    USING (coach_id)
    JOIN TRAINS
    USING (train_id)
    WHERE seat_id NOT IN (SELECT reserved_seat_id 
                          FROM RESERVATIONS)
    AND trip_id = ?
    GROUP BY trip_id, seat_type`;
    console.log(`SQL Query: ${sqlQuery}`);
    console.log(`Trip ID: ${tripID}`);
    return { query: sqlQuery, params: [tripID] };
}
  
  export function getFareInfo(tripID) {
    const sqlQuery = `
      SELECT st.seat_type, 
             st.price + st.addnum * ABS(CAST(substr(t.start_station_id, -2) AS INTEGER) - CAST(substr(t.end_station_id, -2) AS INTEGER)) AS fare_per_seat
      FROM SEAT_TYPE st
      CROSS JOIN TRIPS t
      WHERE t.trip_id = ?
    `;
    console.log(`SQL Query for Fare Info: ${sqlQuery}`);
    return { query: sqlQuery, params: [tripID] };
  }

  export function calculateTotalFare(farePerSeat, quantity) {
    return farePerSeat * quantity;
  }