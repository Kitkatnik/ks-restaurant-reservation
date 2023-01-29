function beforeClosing(time) {
	if (time < "10:30" || time > "21:30") {
		return true;
	} else {
		return false;
	}
}

module.exports = beforeClosing;