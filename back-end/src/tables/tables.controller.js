const TablesService = require("./tables.service");
const ReservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
	res.json({ data: await TablesService.list() });
}

// Create tables

const VALID_PROPERTIES = [
	"table_name",
	"capacity",
	"people",
	"reservation_id",
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

const hasRequiredProperties = hasProperties("table_name", "capacity");

function createIsValid(req, res, next) {
	const {
		data: { table_name, capacity },
	} = req.body;
	if (table_name.length < 2) {
		return next({
			status: 400,
			message: `table_name must be at least 2 characters long`,
		});
	}
	if (capacity < 1) {
		return next({
			status: 400,
			message: `Table must have a capacity of at least 1.`,
		});
	}
	next();
}

async function create(req, res) {
	const newTable = await TablesService.create(req.body.data);

	res.status(201).json({
		data: newTable[0],
	});
}

async function tableExists(req, res, next) {
	const table = await TablesService.read(req.params.table_id);
	if (table) {
		res.locals.table = table;
		return next();
	}
	next({
		status: 404,
		message: `Table ${req.params.table_id} cannot be found.`,
	});
}

function read(req, res) {
	res.json({ data: res.locals.table });
}

function hasData(req, res, next) {
	if (req.body.data) {
		return next();
	}
	next({
		status: 400,
		message: `Body must have a data property.`,
	});
}

function reservationIdExists(req, res, next) {
	const { reservation_id } = req.body.data;
	if (reservation_id) {
		return next();
	}
	next({
		status: 400,
		message: `reservation_id is missing.`,
	});
}

async function reservationExists(req, res, next) {
	const reservation = await ReservationsService.read(
		req.body.data.reservation_id
	);
	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	next({
		status: 404,
		message: `Reservation ${req.body.data.reservation_id} cannot be found.`,
	});
}

function updateIsValid(req, res, next) {
	const { table, reservation } = res.locals;
	if (table.reservation_id) {
		return next({
			status: 400,
			message: `Table is occupied`,
		});
	}
	if (reservation.status === "seated") {
		return next({
			status: 400,
			message: `Reservation is already seated.`,
		});
	}
	if (table.capacity < reservation.people) {
		return next({
			status: 400,
			message: `capacity of table is not large enough for reservation.`,
		});
	}
	next();
}

async function update(req, res) {
	const updatedTable = {
		...res.locals.table,
		reservation_id: res.locals.reservation.reservation_id,
	};
	const updatedReservation = {
		...res.locals.reservation,
		status: "seated",
	};
	const data1 = await TablesService.update(updatedTable);
	const data2 = await ReservationsService.update(updatedReservation);
	res.json({ data1 });
	res.json({ data2 });
}

function isTableOccupied(req, res, next) {
	if (res.locals.table.reservation_id) {
		return next();
	}
	next({
		status: 400,
		message: `Table is not occupied`,
	});
}

async function destroy(req, res) {
	const updatedTable = {
		...res.locals.table,
		reservation_id: null,
	};
	const seatedReservation = await ReservationsService.read(
		res.locals.table.reservation_id
	);
	const data1 = await TablesService.update(updatedTable);
	const data2 = await ReservationsService.update({
		...seatedReservation,
		status: "finished",
	});
	res.json({ data1 });
	res.json({ data2 });
}

module.exports = {
    list: asyncErrorBoundary(list),
	create: [
		hasOnlyValidProperties,
		hasRequiredProperties,
		createIsValid,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(tableExists), read],
	update: [
		asyncErrorBoundary(tableExists),
		hasData,
		reservationIdExists,
		asyncErrorBoundary(reservationExists),
		updateIsValid,
		asyncErrorBoundary(update),
	],
	destroy: [
		asyncErrorBoundary(tableExists),
		isTableOccupied,
		asyncErrorBoundary(destroy),
	],
};
