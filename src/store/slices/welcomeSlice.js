import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adb: false,
  rclone: false,
  scrcpy: false,
  zip: false,
};

export const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    setAdb: (state, action) => {
      state.adb = action.payload;
    },
    setRclone: (state, action) => {
      state.rclone = action.payload;
    },
    setScrcpy: (state, action) => {
      state.scrcpy = action.payload;
    },
    setZip: (state, action) => {
      state.zip = action.payload;
    },
  },
});

export const adbSelector = (state) => state.welcome.adb;
export const rcloneSelector = (state) => state.welcome.rclone;
export const scrcpySelector = (state) => state.welcome.scrcpy;
export const zipSelector = (state) => state.welcome.zip;

export const { setAdb, setRclone, setScrcpy, setZip } = welcomeSlice.actions;
export const welcomeReducer = welcomeSlice.reducer;
