import { createSlice } from '@reduxjs/toolkit';
import { MODAL_MESSAGEBOX } from '../../renderer/utils/constants';

const initialState = {
  openModals: [],
  messageBox: {
    type: '',
    title: '',
    message: '',
    detail: '',
    checkboxLabel: '',
    checkboxChecked: false,
    textboxLabel: '',
    textboxValue: '',
    fileBrowseLabel: '',
    fileBrowseValue: '',
    fileBrowseFilters: [
      {
        name: 'All',
        extensions: ['*'],
      },
    ],
    fileBrowseProperties: ['openFile', 'openDirectory'],
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
    setMessageBoxCheckboxChecked: (state, action) => {
      state.messageBox.checkboxChecked = action.payload;
    },
    setMessageBoxTextboxValue: (state, action) => {
      state.messageBox.textboxValue = action.payload;
    },
    setMessageBoxFileBrowseValue: (state, action) => {
      state.messageBox.fileBrowseValue = action.payload;
    },
    __showMessageBox__: (state, action) => {
      if (state.messageBox.type) {
        // We only show one messageBox at a time and one is already open, so do
        // nothing.
        return state;
      }

      const {
        type = initialState.messageBox.type,
        title = initialState.messageBox.title,
        message = initialState.messageBox.message,
        detail = initialState.messageBox.detail,
        checkboxLabel = initialState.messageBox.checkboxLabel,
        checkboxChecked = initialState.messageBox.checkboxChecked,
        textboxLabel = initialState.messageBox.textboxLabel,
        textboxValue = initialState.messageBox.textboxValue,
        fileBrowseLabel = initialState.messageBox.fileBrowseLabel,
        fileBrowseFilters = initialState.messageBox.fileBrowseFilters,
        fileBrowseProperties = initialState.messageBox.fileBrowseProperties,
        fileBrowseValue = initialState.messageBox.fileBrowseValue,
        buttons = initialState.messageBox.buttons,
      } = action.payload;

      state.messageBox.type = type;
      state.messageBox.title = title;
      state.messageBox.message = message;
      state.messageBox.detail = detail;
      state.messageBox.checkboxLabel = checkboxLabel;
      state.messageBox.checkboxChecked = checkboxChecked;
      state.messageBox.fileBrowseFilters = fileBrowseFilters;
      state.messageBox.fileBrowseLabel = fileBrowseLabel;
      state.messageBox.fileBrowseProperties = fileBrowseProperties;
      state.messageBox.fileBrowseValue = fileBrowseValue;
      state.messageBox.textboxLabel = textboxLabel;
      state.messageBox.textboxValue = textboxValue;
      state.messageBox.buttons = buttons;

      const modalName = MODAL_MESSAGEBOX;
      if (!state.openModals.includes(modalName)) {
        state.openModals.push(modalName);
      }
    },
    __hideMessageBox__: (state) => {
      state.messageBox.type = initialState.messageBox.type;
      state.messageBox.title = initialState.messageBox.title;
      state.messageBox.message = initialState.messageBox.message;
      state.messageBox.detail = initialState.messageBox.detail;
      state.messageBox.checkboxLabel = initialState.messageBox.checkboxLabel;
      state.messageBox.checkboxChecked =
        initialState.messageBox.checkboxChecked;
      state.messageBox.fileBrowseLabel =
        initialState.messageBox.fileBrowseLabel;
      state.messageBox.fileBrowseValue =
        initialState.messageBox.fileBrowseValue;
      state.messageBox.textboxLabel = initialState.messageBox.textboxLabel;
      state.messageBox.textboxValue = initialState.messageBox.textboxValue;
      state.messageBox.buttons = initialState.messageBox.buttons;

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
export const messageBoxTextboxLabelSelector = (state) =>
  state.app.messageBox.textboxLabel;
export const messageBoxTextboxValueSelector = (state) =>
  state.app.messageBox.textboxValue;
export const messageBoxFileBrowseLabelSelector = (state) =>
  state.app.messageBox.fileBrowseLabel;
export const messageBoxFileBrowsePropertiesSelector = (state) =>
  state.app.messageBox.fileBrowseProperties;
export const messageBoxFileBrowseValueSelector = (state) =>
  state.app.messageBox.fileBrowseValue;
export const messageBoxFileBrowseFiltersSelector = (state) =>
  state.app.messageBox.fileBrowseFilters;
export const messageBoxButtonsSelector = (state) =>
  state.app.messageBox.buttons;

export const showScrollToTopSelector = (state) => state.app.showScrollToTop;

export const {
  modalHide,
  modalShow,
  setShowScrollToTop,
  setMessageBoxCheckboxChecked,
  setMessageBoxFileBrowseValue,
  setMessageBoxTextboxValue,
  __hideMessageBox__,
  __showMessageBox__,
} = appSlice.actions;
export const appReducer = appSlice.reducer;
