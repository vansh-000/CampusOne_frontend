import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ================= SIGNUP ================= */
export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data.message;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= LOGIN ================= */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data.data; // { user, accessToken }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    signupSuccess: false,
    isAuthenticated: false,
  },
  reducers: {
    clearAuthState(state) {
      state.error = null;
      state.signupSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.loading = false;
        state.signupSuccess = true;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
