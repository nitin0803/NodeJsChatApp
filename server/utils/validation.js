var isRealString = (strInput) => {
	return (typeof strInput === 'string'
		 && strInput.trim().length > 0);
}

module.exports = {isRealString};