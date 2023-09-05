import { createSlice } from '@reduxjs/toolkit';

const remote = window.require('@electron/remote');
const config = remote.getGlobal('currentConfiguration');

const initialState = {
  scrcpyBitrate: config.scrcpyBitrate || '8000000',
  scrcpyBitrateType: config.scrcpyBitrateType || '',
  scrcpyCrop: config.scrcpyCrop || '1600:900:2017:510',
  scrcpyMaxFps: config.scrcpyMaxFps || '0',
  scrcpyMaxSize: config.scrcpyMaxSize || '0',
  scrcpyFullscreen: config.scrcpyFullscreen || false,
  scrcpyNoControl:
    typeof config.scrcpyNoControl !== 'undefined'
      ? config.scrcpyNoControl
      : true,
  scrcpyAlwaysOnTop: config.scrcpyAlwaysOnTop || false,
};

export const scrcpySlice = createSlice({
  name: 'scrcpy',
  initialState,
  reducers: {
    setScrcpyValue: (state, action) => {
      const { key, val } = action.payload;
      state[key] = val;
    },
  },
});

export const scrcpyFieldsSelector = (state) => state.scrcpy;

export const { setScrcpyValue } = scrcpySlice.actions;
export const scrcpyReducer = scrcpySlice.reducer;
