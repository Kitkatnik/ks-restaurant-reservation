import React from "react";
import { useHistory } from "react-router-dom";

import { previous, today, next } from "../utils/date-time";

import ReservationsDisplay from "../reservations/ReservationsDisplay";
import TablesDisplay from "../tables/TablesDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
	date,
	reservations,
	reservationsError,
	tables,
	tablesError,
}) {
	const history = useHistory();

	return (
		<main>
			<h1>Dashboard</h1>
			<div className="d-md-flex mb-3">
				<h4 className="mb-0">Reservations for {date}</h4>
			</div>
			<div className="d-md-flex mb-3">
				<button
					className="btn btn-secondary mx-1"
					onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
				>
					Previous
				</button>
				<button
					className="btn btn-primary mx-1"
					onClick={() => history.push(`/dashboard?date=${today()}`)}
				>
					Today
				</button>
				<button
					className="btn btn-secondary mx-1"
					onClick={() => history.push(`/dashboard?date=${next(date)}`)}
				>
					Next
				</button>
			</div>
			<ReservationsDisplay
				reservations={reservations}
				reservationsError={reservationsError}
			/>

			<h4>Tables</h4>

			<TablesDisplay tables={tables} tablesError={tablesError} />
		</main>
	);
}

export default Dashboard;
