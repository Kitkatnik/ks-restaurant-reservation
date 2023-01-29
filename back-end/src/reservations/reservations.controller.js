/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const dateIsTuesday = require("../errors/dateIsTuesday");
const beforeClosing = require("../errors/beforeClosing");

// List reservations
async function list(req, res) {
	const date = req.query.date;
	const mobile_number = req.query.mobile_number;
	if (date) {
		res.json({
			data: await service.list(date),
		});
	} else if (mobile_number) {
		res.json({
			data: await service.search(mobile_number),
		});
	}
}

// Creating a reservation

const VALID_PROPERTIES = [
	"reservation_id",
	"first_name",
	"last_name",
	"mobile_number",
	"reservation_date",
	"reservation_time",
	"people",
	"status",
	"created_at",
	"updated_at",
];

function hasOnlyValidProperties(req, res, next) {
	const { data = {} } = req.body;

	const invalidFields = Object.keys(data).filter(
		(field) => !VALID_PROPERTIES.includes(field)
	);

	if (invalidFields.length)
		return next({
			status: 400,
			message: `Invalid Field(s): ${invalidFields.join(", ")} `,
		});
	return next();
}

const hasRequiredProperties = hasProperties(
	"first_name",
	"last_name",
	"mobile_number",
	"reservation_date",
	"reservation_time",
	"people"
);

const isValid = (req, res, next) => {
	const {
		data: { reservation_date, reservation_time, people, status },
	} = req.body;
	const date = new Date(reservation_date);
	const currentDate = new Date();
	if (typeof people === "string" && people > 0) {
		return next({
			status: 400,
			message: `People: ${people} is not a valid number!`,
		});
	}

	if (reservation_date.match(/[a-z]/i)) {
		return next({
			status: 400,
			message: `Reservation Date: ${reservation_date} is not a date!`,
		});
	}

	if (reservation_time.match(/[a-z]/i)) {
		return next({
			status: 400,
			message: `Reservation Time: ${reservation_time} is not a valid time!`,
		});
	}
	if (
		date.valueOf() < currentDate.valueOf() &&
		date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)
	)
		return next({
			status: 400,
			message: "Reservations must be made in the future!",
		});

	if (dateIsTuesday(reservation_date)) {
		return next({
			status: 400,
			message: `Sorry, we are closed on Tuesday!`,
		});
	}
	if (beforeClosing(reservation_time)) {
		return next({
			status: 400,
			message: `Sorry, we are not open during this time`,
		});
	}
	if (status === "seated" || status === "finished") {
		return next({
			status: 400,
			message: "This reservation has already been seated or is already finished",
		});
	}
	next();
};

async function create(req, res) {
	const newReservation = await service.create(req.body.data);

	res.status(201).json({
		data: newReservation[0],
	});
}

module.exports = {
	list: asyncErrorBoundary(list),
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		isValid,
		asyncErrorBoundary(create),
	],
};
