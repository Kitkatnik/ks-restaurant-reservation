import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import NotFound from "../errors/NotFound";
import NewReservation from "../reservations/NewReservation";

import useQuery from "../utils/useQuery";
import { listReservations } from "../utils/api";
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

	function loadDashboard() {
		const abortController = new AbortController();

		setReservationsError(null);

		listReservations({ date }, abortController.signal)
			.then(setReservations)
			.catch(setReservationsError);
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
				/>
			</Route>
			<Route path="/reservations/new">
				<NewReservation />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;
