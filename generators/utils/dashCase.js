const PATTERN = /([a-z])([A-Z])/g

module.exports = function toDashCase (string = '') {
	  return string.replace(PATTERN, '$1-$2').toLowerCase()
}
