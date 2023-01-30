import React, { useState } from "react";

import ReservationsDisplay from "./ReservationsDisplay";

import { listReservations } from "../utils/api";

export default function SearchByMobileNumber() {
    
	const [mobile_number, setMobile_number] = useState(null);
	const [results, setResults] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [displayResults, setDisplayResults] = useState(false);

	const formChangeHandler = ({ target }) => {
		setMobile_number(target.value);
	};

	async function listResults() {
		const abortController = new AbortController();
		await listReservations(
			{ mobile_number: mobile_number },
			abortController.signal
		)
			.then(setResults)
			.catch(setReservationsError);
		return () => abortController.abort();
	}

	const submitHandler = async (event) => {
		event.preventDefault();
		await listResults();
		setDisplayResults(true);
	};

	return (
		<main>
			<h1>Search</h1>
			<form onSubmit={submitHandler}>
				<div className="row mt-3">
					<div className="col-6 form-group">
						<input
							className="form-control"
							id="mobile_number"
							name="mobile_number"
							type="tel"
							value={mobile_number}
							onChange={formChangeHandler}
							placeholder="Enter a customer's phone number"
							required
						/>
					</div>
					<div className="col-6 form-group">
						<button className="btn btn-primary" type="submit">
							Find
						</button>
					</div>
				</div>
			</form>
			{displayResults ? (
				results.length ? (
					<ReservationsDisplay
						reservations={results}
						reservationsError={reservationsError}
					/>
				) : (
					<h4>No reservations found</h4>
				)
			) : null}
		</main>
	);
}
