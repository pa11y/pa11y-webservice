function csvToArray(value) {
	if (!value) {
		return [];
	}

	return value.split(/,/g).map(part => part.trim());
}

module.exports = csvToArray;
