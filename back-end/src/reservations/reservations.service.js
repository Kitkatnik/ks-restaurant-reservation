const knex = require("../db/connection");
const tableName = "reservations";

async function list(reservation_date) {
	return knex(tableName)
	.where({ reservation_date })
	.whereNotIn("status", ["finished", "cancelled"])
	.orderBy("reservation_time");
}

function create(newReservation) {
	return knex(tableName).insert(newReservation).returning("*");
}

module.exports = {
	list,
	create,
};