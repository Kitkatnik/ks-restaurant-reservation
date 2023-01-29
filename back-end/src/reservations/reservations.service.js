const knex = require("../db/connection");
const tableName = "reservations";

async function list(reservation_date) {
    return knex(tableName)
        .where({ reservation_date })
        .whereNotIn("status", ["finished", "cancelled"])
        .orderBy("reservation_time");
}

module.exports = {
    list,
};