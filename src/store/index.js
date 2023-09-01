import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './slices/appSlice';
import { deviceReducer } from './slices/deviceSlice';
import { welcomeReducer } from './slices/welcomeSlice';
import { settingsReducer } from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    device: deviceReducer,
    settings: settingsReducer,
    welcome: welcomeReducer,
  },
});

export {
  modalHide,
  modalShow,
  setMessageBoxCheckbox,
  setShowScrollToTop,
  getModalIsVisibleSelector,
  messageBoxTypeSelector,
  messageBoxTitleSelector,
  messageBoxMessageSelector,
  messageBoxDetailSelector,
  messageBoxButtonsSelector,
  messageBoxCheckboxLabelSelector,
  messageBoxCheckboxCheckedSelector,
  showScrollToTopSelector,
} from './slices/appSlice';

export {
  setDevicePending,
  setDeviceConnected,
  setDeviceError,
  setMountPending,
  setMountConnected,
  setMountError,
  setWirelessPending,
  setWirelessConnected,
  setWirelessError,
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
  devicePendingSelector,
  deviceConnectedSelector,
  deviceErrorSelector,
  modelSelector,
  mountPendingSelector,
  mountConnectedSelector,
  mountErrorSelector,
  wirelessPendingSelector,
  wirelessConnectedSelector,
  wirelessErrorSelector,
  batChargeSelector,
  batMaxCurrentSelector,
  batMaxVoltageSelector,
  batTemperatureSelector,
  fwSelector,
  ipSelector,
  levelSelector,
  storageSelector,
  userSelector,
  wifiSelector,
} from './slices/deviceSlice';

export {
  setAdb,
  setRclone,
  setScrcpy,
  setZip,
  adbSelector,
  rcloneSelector,
  scrcpySelector,
  zipSelector,
} from './slices/welcomeSlice';

export {
  formFieldsSelector,
  rcloneIsValid,
  rcloneBinaryIsInvalid,
  rcloneConfigIsInvalid,
  setField,
} from './slices/settingsSlice';
