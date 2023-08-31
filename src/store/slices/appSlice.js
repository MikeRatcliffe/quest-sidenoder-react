import { createSlice } from '@reduxjs/toolkit';
import { MODAL_MESSAGEBOX } from '../../renderer/utils/constants';

const initialState = {
  openModals: [],
  messageBox: {
    type: '',
    title: '',
    message: '',
    detail: '',
    checkboxLabel: false,
    checkboxChecked: false,
    buttons: [],
  },
  showScrollToTop: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    modalHide: (state, action) => {
      const modalName = action.payload;
      state.openModals = state.openModals.filter((name) => name !== modalName);
    },
    modalShow: (state, action) => {
      const modalName = action.payload;
      if (!state.openModals.includes(modalName)) {
        state.openModals.push(modalName);
      }
    },
    setMessageBoxCheckbox: (state, action) => {
      state.messageBox.checkboxChecked = action.payload;
    },
    __showMessageBox__: (state, action) => {
      if (state.messageBox.type) {
        // We only show one messageBox at a time and one is already open, so do
        // nothing.
        return state;
      }

      const {
        type = 'error',
        title = '',
        message = '',
        detail = '',
        checkboxLabel = '',
        checkboxChecked = false,
        buttons = [],
      } = action.payload;

      state.messageBox.type = type;
      state.messageBox.title = title;
      state.messageBox.message = message;
      state.messageBox.detail = detail;
      state.messageBox.checkboxLabel = checkboxLabel;
      state.messageBox.checkboxChecked = checkboxChecked;
      state.messageBox.buttons = buttons;

      const modalName = MODAL_MESSAGEBOX;
      if (!state.openModals.includes(modalName)) {
        state.openModals.push(modalName);
      }
    },
    __hideMessageBox__: (state) => {
      state.messageBox.type = '';
      state.messageBox.title = '';
      state.messageBox.message = '';
      state.messageBox.detail = '';
      state.messageBox.checkboxLabel = '';
      state.messageBox.checkboxChecked = false;
      state.messageBox.buttons = [];

      const modalName = MODAL_MESSAGEBOX;
      state.openModals = state.openModals.filter((name) => name !== modalName);
    },
    setShowScrollToTop: (state, action) => {
      state.showScrollToTop = action.payload;
    },
  },
});

export const getModalIsVisibleSelector = (state, modalName) => {
  return state.app.openModals.includes(modalName);
};
export const messageBoxTypeSelector = (state) => state.app.messageBox.type;
export const messageBoxTitleSelector = (state) => state.app.messageBox.title;
export const messageBoxMessageSelector = (state) =>
  state.app.messageBox.message;
export const messageBoxDetailSelector = (state) => state.app.messageBox.detail;
export const messageBoxCheckboxLabelSelector = (state) =>
  state.app.messageBox.checkboxLabel;
export const messageBoxCheckboxCheckedSelector = (state) =>
  state.app.messageBox.checkboxChecked;
export const messageBoxButtonsSelector = (state) =>
  state.app.messageBox.buttons;

export const showScrollToTopSelector = (state) => state.app.showScrollToTop;

export const {
  modalHide,
  modalShow,
  setShowScrollToTop,
  setMessageBoxCheckbox,
  __hideMessageBox__,
  __showMessageBox__,
} = appSlice.actions;
export const appReducer = appSlice.reducer;
