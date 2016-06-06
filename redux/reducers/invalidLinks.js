export default function invalidLinks(invalidLinks = {}, action) {
	switch (action.type) {
		case 'ADD_INVALID_LINK':
			var invalid = {};
			invalid[action.invalidLink] = true;
			return Object.assign({}, invalidLinks, invalid)
		default: 
			return invalidLinks
	}
}
