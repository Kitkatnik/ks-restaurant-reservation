import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import NotFound from "../errors/NotFound";

import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import SeatReservation from "../reservations/SeatReservation";
import EditReservation from "../reservations/EditReservation";
import SearchByMobileNumber from "../reservations/SearchByMobileNumber";
import TableForm from "../tables/TableForm";

import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
	const query = useQuery();
	const date = query.get("date") || today();

	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);

	function loadDashboard() {
		const abortController = new AbortController();

		setReservationsError(null);
		setTablesError(null);

		listReservations({ date }, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError);

		listTables(abortController.signal).then(setTables).catch(setTablesError);
	}

	useEffect(loadDashboard, [date]);

	return (
		<Switch>
			<Route exact={true} path="/">
				<Redirect to={"/dashboard"} />
			</Route>
			<Route exact={true} path="/reservations">
				<Redirect to={"/dashboard"} />
			</Route>
			<Route path="/dashboard">
				<Dashboard
					date={date}
					reservations={reservations}
					reservationsError={reservationsError}
					tables={tables}
					tablesError={tablesError}
				/>
			</Route>
			<Route path="/search">
				<SearchByMobileNumber />
			</Route>
			<Route path="/reservations/new">
				<NewReservation />
			</Route>
			<Route path="/reservations/:reservation_id/seat">
				<SeatReservation tables={tables} />
			</Route>
			<Route path="/reservations/:reservation_id/edit">
				<EditReservation />
			</Route>
			<Route path="/tables/new">
				<TableForm setTables={setTables} />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;
