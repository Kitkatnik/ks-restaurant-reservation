function dateIsTuesday(date) {
	newDate = new Date(date);
	if (newDate.getDay() === 1) {
		return true;
	}
	return false;
}

module.exports = dateIsTuesday;