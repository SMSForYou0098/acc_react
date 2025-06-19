import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  auth_session: null,
  session_id: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAuthSession: (state, action) => {
      state.auth_session = action.payload.auth_session;
      state.session_id = action.payload.session_id;
    },
    clearUser: (state) => {
      state.user = null;
      state.auth_session = null;
      state.session_id = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAuthSession, clearUser } = userSlice.actions;
export default userSlice.reducer;