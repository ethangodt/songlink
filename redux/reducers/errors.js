export default function errors(errors = {}, action) {
	switch (action.type) {
		case 'TOGGLE_ERROR_CREATE_LINK':
			return Object.assign({}, errors, { createLink: action.isError })
		default: 
			return errors
	}
}
