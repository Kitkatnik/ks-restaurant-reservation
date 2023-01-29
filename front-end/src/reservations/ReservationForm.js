import React, { useState } from "react";

import ValidationErrors from "../errors/ValidationErrors";

import validate from "../utils/validate";

export default function ReservationForm({
	submitHandler,
	cancelHandler,
	initialState = {
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
	},
}) {
	const [reservation, setReservation] = useState(initialState);
	const [errors, setErrors] = useState([]);

	function changeHandler({ target: { name, value } }) {
		setReservation((previousReservation) => ({
			...previousReservation,
			[name]: value,
		}));
	}

	function numberChangeHandler({ target: { name, value } }) {
		setReservation((previousReservation) => ({
			...previousReservation,
			[name]: Number(value),
		}));
	}

	function onSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		const validationErrors = validate(reservation);

		if (validationErrors.length) {
			return setErrors(validationErrors);
		}

		submitHandler(reservation);
	}

	return (
		<form onSubmit={onSubmit}>
			<ValidationErrors errors={errors} />
			<fieldset>
				<div className="row mb-3">
					<div className="col-6 form-group">
						<label className="form-label" htmlFor="first_name">
							First Name:
						</label>
						<input
							className="form-control"
							id="first_name"
							name="first_name"
							type="text"
							value={reservation.first_name}
							onChange={changeHandler}
							required
						/>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-6 form-group">
						<label className="form-label" htmlFor="last_name">
							Last Name:
						</label>
						<input
							className="form-control"
							id="last_name"
							name="last_name"
							type="text"
							value={reservation.last_name}
							onChange={changeHandler}
							required
						/>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-6 form-group">
						<label className="form-label" htmlFor="mobile_number">
							Mobile Number:
						</label>
						<input
							className="form-control"
							id="mobile_number"
							name="mobile_number"
							type="tel"
							placeholder="XXX-XXX-XXXX"
							value={reservation.mobile_number}
							onChange={changeHandler}
							required
						/>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-6 form-group">
						<label className="form-label" htmlFor="reservation_date">
							Reservation Date:
						</label>
						<input
							className="form-control"
							id="reservation_date"
							name="reservation_date"
							type="date"
							placeholder="YYYY-MM-DD"
							pattern="\d{4}-\d{2}-\d{2}"
							value={reservation.reservation_date}
							onChange={changeHandler}
							required
						/>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-6 form-group">
						<label className="form-label" htmlFor="reservation_time">
							Reservation Time:
						</label>
						<input
							className="form-control"
							id="reservation_time"
							name="reservation_time"
							type="time"
							placeholder="HH:MM"
							pattern="[0-9]{2}:[0-9]{2}"
							value={reservation.reservation_time}
							onChange={changeHandler}
							required
						/>
					</div>
				</div>
				<div className="row mb-3">
					<div className="col-6 form-group">
						<label className="form-label" htmlFor="people">
							People:
						</label>
						<input
							className="form-control"
							id="people"
							name="people"
							type="number"
							max="12"
							min="1"
							aria-label="Number of people"
							value={reservation.people}
							onChange={numberChangeHandler}
							required
						/>
					</div>
				</div>
				<div>
					<button className="btn btn-secondary mx-1" onClick={cancelHandler}>
						<span className="oi oi-x" /> Cancel
					</button>
					<button className="btn btn-primary mx-1" type="submit">
						<span className="oi oi-check" /> Submit
					</button>
				</div>
			</fieldset>
		</form>
	);
}