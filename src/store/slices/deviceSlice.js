import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deviceInfo: {
    batCharge: 'unknown',
    batMaxCurrent: 0,
    batMaxVoltage: 0,
    batTemperature: 0,
    fw: '',
    ip: 'X.X.X.X',
    level: 'XX',
    storage: null,
    user: '',
    wifi: 'Off',
  },
  devicePending: false,
  deviceConnected: false,
  deviceError: '',
  mountPending: false,
  mountConnected: false,
  mountError: '',
  wirelessPending: false,
  wirelessConnected: false,
  wirelessError: '',
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevicePending: (state, action) => {
      state.devicePending = action.payload;

      if (action.payload === true) {
        state.deviceConnected = false;
        state.deviceError = '';
      }
    },
    setDeviceConnected: (state, action) => {
      state.deviceConnected = action.payload;

      if (action.payload === true) {
        state.devicePending = false;
        state.deviceError = '';
      }
    },
    setDeviceError: (state, action) => {
      state.deviceError = action.payload;

      if (action.payload) {
        state.devicePending = false;
        state.deviceConnected = false;
      }
    },

    setMountPending: (state, action) => {
      state.mountPending = action.payload;

      if (action.payload === true) {
        state.mountConnected = false;
        state.mountError = '';
      }
    },
    setMountConnected: (state, action) => {
      state.mountConnected = action.payload;

      if (action.payload === true) {
        state.mountError = '';
      }

      state.mountPending = false;
    },
    setMountError: (state, action) => {
      state.mountError = action.payload;

      if (action.payload) {
        state.mountPending = false;
        state.mountConnected = false;
      }
    },

    setWirelessPending: (state, action) => {
      state.wirelessPending = action.payload;

      if (action.payload === true) {
        state.wirelessConnected = false;
        state.wirelessError = '';
      }
    },
    setWirelessConnected: (state, action) => {
      state.wirelessConnected = action.payload;

      if (action.payload === true) {
        state.wirelessPending = false;
        state.wirelessError = '';

        state.deviceConnected = true;
        state.devicePending = false;
        state.deviceError = '';
      }
    },
    setWirelessError: (state, action) => {
      state.wirelessError = action.payload;

      if (action.payload) {
        state.wirelessPending = false;
        state.wirelessConnected = false;
      }
    },
    setBatCharge: (state, action) => {
      state.deviceInfo.batCharge = action.payload;
    },
    setBatMaxCurrent: (state, action) => {
      state.deviceInfo.batMaxCurrent = action.payload;
    },
    setBatMaxVoltage: (state, action) => {
      state.deviceInfo.batMaxVoltage = action.payload;
    },
    setBatTemperature: (state, action) => {
      state.deviceInfo.batTemperature = action.payload;
    },
    setFw: (state, action) => {
      state.deviceInfo.fw = action.payload;
    },
    setIp: (state, action) => {
      state.deviceInfo.ip = action.payload;
    },
    setLevel: (state, action) => {
      state.deviceInfo.level = action.payload;
    },
    setStorage: (state, action) => {
      state.deviceInfo.storage = action.payload;
    },
    setUser: (state, action) => {
      state.deviceInfo.user = action.payload;
    },
    setWifi: (state, action) => {
      state.deviceInfo.wifi = action.payload;
    },
  },
});

export const devicePendingSelector = (state) => state.device.devicePending;
export const deviceConnectedSelector = (state) => state.device.deviceConnected;
export const deviceErrorSelector = (state) => state.device.deviceError;

export const mountPendingSelector = (state) => state.device.mountPending;
export const mountConnectedSelector = (state) => state.device.mountConnected;
export const mountErrorSelector = (state) => state.device.mountError;

export const wirelessPendingSelector = (state) => state.device.wirelessPending;
export const wirelessConnectedSelector = (state) =>
  state.device.wirelessConnected;
export const wirelessErrorSelector = (state) => state.device.wirelessError;

export const batChargeSelector = (state) => state.device.deviceInfo.batCharge;
export const batMaxCurrentSelector = (state) =>
  state.device.deviceInfo.batMaxCurrent;
export const batMaxVoltageSelector = (state) =>
  state.device.deviceInfo.batMaxVoltage;
export const batTemperatureSelector = (state) =>
  state.device.deviceInfo.batTemperature;
export const fwSelector = (state) => state.device.deviceInfo.fw;
export const ipSelector = (state) => state.device.deviceInfo.ip;
export const levelSelector = (state) => state.device.deviceInfo.level;
export const storageSelector = (state) => state.device.deviceInfo.storage;
export const userSelector = (state) => state.device.deviceInfo.user;
export const wifiSelector = (state) => state.device.deviceInfo.wifi;

export const {
  setDevicePending,
  setDeviceConnected,
  setDeviceError,

  setMountPending,
  setMountConnected,
  setMountError,

  setWirelessPending,
  setWirelessConnected,
  setWirelessError,

  setBatCharge,
  setBatMaxCurrent,
  setBatMaxVoltage,
  setBatTemperature,
  setFw,
  setIp,
  setLevel,
  setStorage,
  setUser,
  setWifi,
} = deviceSlice.actions;

export const deviceReducer = deviceSlice.reducer;
