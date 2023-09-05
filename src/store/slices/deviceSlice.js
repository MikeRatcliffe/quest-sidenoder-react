import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deviceInfo: {
    manufacturer: '',
    model: '',
    batCharge: 'unknown',
    batMaxCurrent: 0,
    batMaxVoltage: 0,
    batTemperature: 0,
    fw: 'v.XX',
    ip: 'X.X.X.X',
    level: 'XX',
    storage: null,
    user: '',
    wifi: 'Off',
  },
  tweaks: {
    chromaticAberration: '1', // gCA
    cpuLevel: '', // CPU
    defaultTextureSize: '1440x1584', // gSSO
    fixedFoveatedRendering: '', // gFFR
    fullRateCapture: '', // frc
    gpuLevel: '', // GPU
    guardianPause: '', // guardian_pause
    multiplayerName: 'null', // mp_name
    refreshRate: '', // gRR Q2 ONLY
    screenshotSize: '1024x1024', // cres
    videoCaptureSize: '', // vres
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
    setManufacturer: (state, action) => {
      state.deviceInfo.manufacturer = action.payload;
    },
    setModel: (state, action) => {
      state.deviceInfo.model = action.payload;
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
    setChromaticAberration: (state, action) => {
      state.tweaks.chromaticAberration = action.payload;
    },
    setCpuLevel: (state, action) => {
      state.tweaks.wifi = action.payload;
    },
    setDefaultTextureSize: (state, action) => {
      state.tweaks.defaultTextureSize = action.payload;
    },
    setFixedFoveatedRendering: (state, action) => {
      state.tweaks.fixedFoveatedRendering = action.payload;
    },
    setFullRateCapture: (state, action) => {
      state.tweaks.fullRateCapture = action.payload;
    },
    setGpuLevel: (state, action) => {
      state.tweaks.gpuLevel = action.payload;
    },
    setGuardianPause: (state, action) => {
      state.tweaks.guardianPause = action.payload;
    },
    setMultiplayerName: (state, action) => {
      state.tweaks.multiplayerName = action.payload;
    },
    setRefreshRate: (state, action) => {
      state.tweaks.refreshRate = action.payload;
    },
    setScreenshotSize: (state, action) => {
      state.tweaks.screenshotSize = action.payload;
    },
    setVideoCaptureSize: (state, action) => {
      state.tweaks.videoCaptureSize = action.payload;
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

export const manufacturerSelector = (state) =>
  state.device.deviceInfo.manufacturer;
export const modelSelector = (state) => state.device.deviceInfo.model;
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

export const chromaticAberrationSelector = (state) =>
  state.device.deviceInfo.chromaticAberration;
export const cpuLevelSelector = (state) => state.device.deviceInfo.cpuLevel;
export const defaultTextureSizeSelector = (state) =>
  state.device.deviceInfo.defaultTextureSize;
export const fixedFoveatedRenderingSelector = (state) =>
  state.device.deviceInfo.fixedFoveatedRendering;
export const fullRateCaptureSelector = (state) =>
  state.device.deviceInfo.fullRateCapture;
export const gpuLevelSelector = (state) => state.device.deviceInfo.gpuLevel;
export const guardianPauseSelector = (state) =>
  state.device.deviceInfo.guardianPause;
export const multiplayerNameSelector = (state) =>
  state.device.deviceInfo.multiplayerName;
export const refreshRateSelector = (state) =>
  state.device.deviceInfo.refreshRate;
export const screenshotSizeSelector = (state) =>
  state.device.deviceInfo.screenshotSize;
export const videoCaptureSizeSelector = (state) =>
  state.device.deviceInfo.videoCaptureSize;

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

  setManufacturer,
  setModel,
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

  setChromaticAberration,
  setCpuLevel,
  setDefaultTextureSize,
  setFixedFoveatedRendering,
  setFullRateCapture,
  setGpuLevel,
  setGuardianPause,
  setMultiplayerName,
  setRefreshRate,
  setScreenshotSize,
  setVideoCaptureSize,
} = deviceSlice.actions;

export const deviceReducer = deviceSlice.reducer;
