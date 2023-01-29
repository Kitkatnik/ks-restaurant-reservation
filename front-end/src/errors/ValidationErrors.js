import React from "react";

function ValidationErrors({ errors = [] }) {
	return errors.length ? (
		<div className="alert-danger">
			<p>Please fix the following errors:</p>
			<ul>
				{errors.map((error) => (
					<li key={error.message}>{error.message}</li>
				))}
			</ul>
		</div>
	) : null;
}

export default ValidationErrors;