import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  profile: null,
  token: {
    login: null,
    otp: null,
  },
  provider: null,
  isLoading: false,
  error: {
    status: false,
    message: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    nextOtp: (state, { payload }) => {
      const { token, user } = payload?.data;

      // check if regist with phone number
      if (payload?.type === "phone") {
        state.step = 3;
        state.profile = { ...user, phone: payload?.phone };
      } else if (payload?.type === "email" && payload?.provider === "google") {
        state.step = 3;
        state.profile = { ...user, email: payload?.google };
      } else if (payload?.type === "email" && payload?.provider === "facebook") {
        state.step = 3;
        state.profile = { ...user, email: payload?.facebook };
      } else {
        state.step = 2;
        state.profile = { ...user };
      }

      state.token.login = token;
      state.error = initialState.error;
    },
    nextProfile: (state, { payload }) => {
      state.step = 3;
      state.profile = payload?.data?.user;
      state.error = initialState.error;
    },
    completeProfile: (state, { payload }) => {
      state.step = 4;
      state.profile = payload?.data?.user;
      state.error = initialState.error;
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setError: (state, { payload }) => {
      state.error.status = true;
      const message = Object.keys(payload?.message ?? {}).map(
        (item) => payload.message[item]
      );

      if (payload.status === 422 && message?.length) {
        state.error.message = message[0];
      } else {
        state.error.message =
          payload?.message ??
          "Something error on server, please try again later.";
      }
    },
    setErrorMsg: (state, { payload }) => {
      state.error.status = true;
      state.error.message = payload;
    },
    removeError: (state) => {
      state.error = initialState.error;
    },
    logout: (state) => {
      state.step = 1;
      state.profile = initialState.profile;
      state.token = initialState.token;
      state.provider = initialState.provider;
    },
    login: (state, { payload }) => {
      const { token, user } = payload;

      state.profile = user;
      state.token.login = token;
      state.error = initialState.error;
    },
    setProvider: (state, { payload }) => {
      state.provider = payload;
    },
    setStep: (state, { payload }) => {
      state.step = payload;
    },
  },
});

export const {
  setLoading,
  removeError,
  setError,
  nextOtp,
  setErrorMsg,
  nextProfile,
  completeProfile,
  logout,
  login,
  setProvider,
  setStep,
} = authSlice.actions;

export default authSlice.reducer;
