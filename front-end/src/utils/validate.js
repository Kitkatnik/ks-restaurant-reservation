const CLOSED_DAYS = [2];

function convertISOTimeToMinutes(time) {
	const result = time.split(":").map((part) => parseInt(part));
	return result[0] * 60 + result[1];
}

function isFutureDate({ reservation_date, reservation_time }) {
	if (new Date(`${reservation_date}T${reservation_time}`) < new Date()) {
		return new Error("Reservation date/time must occur in the future");
	}
}

function isWorkingDay({ reservation_date }) {
	const day = new Date(reservation_date).getUTCDay();
	if (CLOSED_DAYS.includes(day)) {
		return new Error("The restaurant is closed on Tuesday");
	}
}

function isWithinEligibleTimeframe({ reservation_time }) {
	const reservationTime = convertISOTimeToMinutes(reservation_time);
	if (reservationTime < 630 || reservationTime > 1290) {
		return new Error("Please select a time between 10:30 and 21:30");
	}
}

export default function validate(reservation) {
	return [
		isFutureDate(reservation),
		isWorkingDay(reservation),
		isWithinEligibleTimeframe(reservation),
	].filter((error) => error !== undefined);
}
