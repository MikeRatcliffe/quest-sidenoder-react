import { store } from '../../store';
import {
  __hideMessageBox__,
  __showMessageBox__,
} from '../../store/slices/appSlice';

const { ipcRenderer } = window.require('electron');

function showMessageBox(messageBoxOptions) {
  store.dispatch(__showMessageBox__(messageBoxOptions));

  return new Promise((resolve) => {
    ipcRenderer.once(
      'messagebox-button-clicked',
      (event, { buttonIndexClicked }) => {
        store.dispatch(__hideMessageBox__());
        resolve(buttonIndexClicked);
      }
    );
  });
}

export default showMessageBox;
