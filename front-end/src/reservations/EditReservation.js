import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { readReservation, updateReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";

import ErrorAlert from "../errors/ErrorAlert";

import ReservationForm from "./ReservationForm";

export default function EditReservation() {

	const history = useHistory();
	const { reservation_id } = useParams();
	const [reservation, setReservation] = useState({});
	const [reservationError, setReservationError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		setReservationError(null);
		readReservation(reservation_id, abortController.signal)
			.then(setReservation)
			.catch(setReservationError);

		return () => abortController.abort();
	}, [reservation_id]);

	const submitHandler = (reservation) => {
		const abortController = new AbortController();
		setReservationError(null);
		updateReservation(reservation, abortController.signal)
			.then((updatedReservation) => {
				history.push(
					`/dashboard?date=${formatAsDate(updatedReservation.reservation_date)}`
				);
			})
			.catch(setReservationError);
		return () => abortController.abort();
	};

	function cancelHandler() {
		history.goBack();
	}

	const child = reservation.reservation_id 
        ? 
            (
                <ReservationForm
                    initialState={reservation}
                    submitHandler={submitHandler}
                    cancelHandler={cancelHandler}
                />
            ) 
        : 
            (
                <p>Loading...</p>
            );

	return (
		<main>
			<h1>Edit Existing Reservation #{reservation.reservation_id}</h1>
			<ErrorAlert error={reservationError} />
			{child}
		</main>
	);
}