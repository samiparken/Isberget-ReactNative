import {
	TRY_AUTH_BEGIN,
	TRY_AUTH_ERROR,
	TRY_AUTH_SUCCESS,
} from '../actions/actionTypes'

const initialSate = {
	email: '',
	name: '',
	password: '123456',
	address: '',
	isLoading: false,
	error: null,
	isInstaller: false,
}

const reducer = (state = initialSate, action) => {
	switch (action.type) {
		case TRY_AUTH_BEGIN:
			return {
				...state,
				isLoading: true,
				error: null,
			}
		case TRY_AUTH_SUCCESS:
			const name = `${action.data.address.first_name} ${action.data.address.last_name}`;
			const address = `${action.data.address.street_address}, ${action.data.address.postal_code} ${action.data.address.city_name}`;

			return {
				...state,
				isLoading: false,
				error: null,
				isInstaller: action.data.isInstaller,
				email: action.data.email,
				name: name,
				address: address,
			}
		case TRY_AUTH_ERROR:
			return {
				...state,
				isLoading: false,
				error: action.error,
			}
		default:
			return state;
	}
};

export default reducer;
