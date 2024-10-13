export function formatDateTime(datetime) {
    const dateObj = new Date(datetime);
    const date = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
}

// ฟังก์ชันแยกประเภทที่นั่ง
export function formatSeatType(seatType) {
    const parts = seatType.split('_');
    const classLevel = parts[0].replace('seat', '');
    const seatNumber = parts[1][0];
    const part_seat = parts[1];
    const seat_type = part_seat.slice(1);

    let seatCategory;
    if (seat_type === 'upBed') {
        seatCategory = 'เตียงบน';
    } else if (seat_type === 'downBed') {
        seatCategory = 'เตียงล่าง';
    } else if (seat_type === 'normal') {
        seatCategory = 'เบาะนั่ง';
    } else {
        seatCategory = 'ไม่ทราบประเภทที่นั่ง';
    }

    let airConditioning = '';
    if (seatNumber === '2') {
        airConditioning = parts[3] === '1' ? ' (ปรับอากาศ)' : ' (พัดลม)';
    }

    return `${classLevel} - ${seatCategory} ${airConditioning}`;
}

export function generateChangeLink(trip) {
    const route = encodeURIComponent(trip.route);
    const fromStation = encodeURIComponent(trip.from_station_name);
    const toStation = encodeURIComponent(trip.to_station_name);
    const trip_id = encodeURIComponent(trip.trip_id);
    const seat_type = encodeURIComponent(formatSeatType(trip.seat_type));
    const date = encodeURIComponent(formatDateTime(trip.from_datetime).date)
    return `/change?trip_route=${route}&from_station_name=${fromStation}&to_station_name=${toStation}&date=${date}&trip_id=${trip_id}&seat_type=${seat_type}`;
}

export function generateSQLQuery(fromStation, toStation, selectedDate) {
    let fromStationNum = parseInt(fromStation.slice(-2));
    let toStationNum = parseInt(toStation.slice(-2));
    let fromStationSubstr = fromStation.substr(3, 2);
    let direction = "";
    let sqlQuery = "";
    
    const date = selectedDate;

    if (toStationNum > fromStationNum) {
        direction = "ขาไป";
        sqlQuery = `
            SELECT 
                t.trip_id, 
                t.start_station_id, 
                t.end_station_id, 
                t.from_datetime,
                CONCAT(
                    UPPER(SUBSTR(t.trip_id, 4, 2)), 
                    SUBSTR(t.trip_id, 7), ' ', 
                    s_start.station_name, '-', s_end.station_name
                ) AS trip_name,
                s_start.station_name AS start_name, 
                s_end.station_name AS end_name,
                GROUP_CONCAT(DISTINCT SUBSTR(pc.class_1, 1, 1) ORDER BY pc.class_1) AS available_classes
            FROM TRIPS t
            JOIN STATIONS s_start ON t.start_station_id = s_start.station_id
            JOIN STATIONS s_end ON t.end_station_id = s_end.station_id
            LEFT JOIN RESERVATIONS r ON t.trip_id = r.reserve_trip_id
            LEFT JOIN SEAT st ON r.reserved_seat_id = st.seat_id
            LEFT JOIN PAX_COACHES pc ON st.coach_id = pc.coach_id
            WHERE 
                CAST(SUBSTR(t.start_station_id, -2) AS INTEGER) <= ${fromStationNum}
                AND CAST(SUBSTR(t.end_station_id, -2) AS INTEGER) >= ${toStationNum}
                AND SUBSTR(t.start_station_id, 4, 2) = '${fromStationSubstr}'
                AND DATE(t.from_datetime) = '${date}'
            GROUP BY t.trip_id;
        `;
    } else if (toStationNum < fromStationNum) {
        direction = "ขากลับ";
        sqlQuery = `
            SELECT 
                t.trip_id, 
                t.start_station_id, 
                t.end_station_id, 
                t.from_datetime,
                CONCAT(
                    UPPER(SUBSTR(t.trip_id, 4, 2)), 
                    SUBSTR(t.trip_id, 7), ' ', 
                    s_start.station_name, '-', s_end.station_name
                ) AS trip_name,
                s_start.station_name AS start_name, 
                s_end.station_name AS end_name,
                GROUP_CONCAT(DISTINCT SUBSTR(pc.class_1, 1, 1) ORDER BY pc.class_1) AS available_classes
            FROM TRIPS t
            JOIN STATIONS s_start ON t.start_station_id = s_start.station_id
            JOIN STATIONS s_end ON t.end_station_id = s_end.station_id
            LEFT JOIN RESERVATIONS r ON t.trip_id = r.reserve_trip_id
            LEFT JOIN SEAT st ON r.reserved_seat_id = st.seat_id
            LEFT JOIN PAX_COACHES pc ON st.coach_id = pc.coach_id
            WHERE 
                CAST(SUBSTR(t.start_station_id, -2) AS INTEGER) >= ${fromStationNum}
                AND CAST(SUBSTR(t.end_station_id, -2) AS INTEGER) <= ${toStationNum}
                AND SUBSTR(t.start_station_id, 4, 2) = '${fromStationSubstr}'
                AND DATE(t.from_datetime) = '${date}'
            GROUP BY t.trip_id;
        `;
    } else {
        direction = "สถานีเดียวกัน";
        sqlQuery = "SELECT trip_id FROM TRIPS WHERE 1=0;";
    }

    console.log(`Direction: ${direction}`);
    console.log(`SQL Query: ${sqlQuery}`);

    return sqlQuery;
}
