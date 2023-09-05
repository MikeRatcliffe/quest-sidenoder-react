import { createSlice } from '@reduxjs/toolkit';

const remote = window.require('@electron/remote');
const config = remote.getGlobal('currentConfiguration');
const which = window.require('which');

const initialState = {
  allowOtherDevices: config.allowOtherDevices,
  autoMount: config.autoMount,
  cacheOculusGames: config.cacheOculusGames,
  cfgSection: config.cfgSection,
  mountCmd: config.mountCmd,
  proxyOculus: config.proxyOculus,
  proxySQ: config.proxySQ,
  proxySteam: config.proxySteam,
  proxyUrl: config.proxyUrl,
  rcloneBinaryError: '',
  rcloneConf: config.rcloneConf,
  rcloneConfigError: '',
  rclonePath: config.rclonePath,
  rclonePlaceholder: (await which('rclone', { nothrow: true })) || '',
  rcloneSections: remote.getGlobal('rcloneSections') || [],
  scrcpyBinaryError: '',
  scrcpyPath: config.scrcpyPath,
  scrcpyPlaceholder: (await which('scrcpy', { nothrow: true })) || '',
  tmpdir: config.tmpdir,
  tmpdirPlaceholder: remote.getGlobal('tmpdir') || '',
  userHide: config.userHide,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettingsField: (state, action) => {
      const { key, val } = action.payload;
      state[key] = val;
    },
    rcloneIsValid: (state) => {
      state.rcloneBinaryError = '';
      state.rcloneConfigError = '';
      state.rcloneSections = remote.getGlobal('rcloneSections');
    },
    rcloneBinaryIsInvalid: (state, action) => {
      state.rcloneBinaryError = action.payload;
      state.rcloneSections = [];
    },
    rcloneConfigIsInvalid: (state, action) => {
      state.rcloneConfigError = action.payload;
      state.rcloneSections = [];
    },
  },
});

export const settingsFieldsSelector = (state) => state.settings;

export const {
  rcloneIsValid,
  rcloneBinaryIsInvalid,
  rcloneConfigIsInvalid,
  setSettingsField,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
