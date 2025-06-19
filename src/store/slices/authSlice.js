import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { AUTH_TOKEN } from 'constants/AuthConstant';

// import 'react-dotenv';
export const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	twoFactor: false,
	redirect: '',
	user: [],
	token: null
}

const api = process.env.REACT_APP_API_PATH;

export const signIn = createAsyncThunk('login', async (data, { rejectWithValue }) => {
	try {
		const { password, number, passwordRequired ,session_id,auth_session,otp} = data;
		const response = await axios.post(`${api}login`, {  password, number, passwordRequired ,session_id,auth_session,otp })
		return response.data
	} catch (err) {
		return rejectWithValue(
			err.response.data.emailError ? err.response.data.emailError :
			err.response.data.message ? err.response.data.message :
				err.response.data.error ? err.response.data.error :
					err.response.data.passwordError ? err.response.data.passwordError :
						err.response.data.ipAuthError ? err.response.data.ipAuthError :
							'Server Error'
		);

	}
})




export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false

			state.redirect = '/'
			state.token = action.payload
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload
			state.showMessage = true
			state.loading = false
		},
		hideAuthMessage: (state) => {
			state.message = ''
			state.showMessage = false
		},
		logout: (state, action) => {
			state.loading = false
			state.token = null
			state.user = []
			state.redirect = '/login'
			state.twoFactor = false
		},
		updateUser: (state, action) => {
			const updatedUser = action.payload; 
			state.user = {
				...state.user,
				...updatedUser,
				permissions: state.user.permissions,
			};
		},
		validateTwoFector: (state) => {
			state.twoFactor = false
		},
		showLoading: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.loading = false
			state.token = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				if (action?.payload?.user?.two_fector_auth === 'true') {
					state.twoFactor = true
				}
				state.loading = false
				state.token = action.payload.token
				state.user = action.payload.user
			})
			.addCase(signIn.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false

			})
	},
})

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
	logout,
	updateUser,
	validateTwoFector,
	signInSuccess
} = authSlice.actions

export default authSlice.reducer