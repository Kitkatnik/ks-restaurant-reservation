import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import ReservationForm from "./ReservationForm";

import ErrorAlert from "../errors/ErrorAlert"

import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";

export default function NewReservation() {

	const history = useHistory();
	const [error, setError] = useState(null);

	function submitHandler(reservation) {

		const abortController = new AbortController();
		
		setError(null);
		
		createReservation(reservation, abortController.signal)
			.then((savedReservation) => {
				history.push(
					`/dashboard?date=${formatAsDate(savedReservation.reservation_date)}`
				);
			})
			.catch(setError);
			
		return () => abortController.abort();
	}

	function cancelHandler() {
		history.goBack();
	}

	return (
		<main>
			<h1>New Reservation</h1>
			<ErrorAlert error={error} />
			<ReservationForm
				submitHandler={submitHandler}
				cancelHandler={cancelHandler}
			/>
		</main>
	);
}