/* global $id,ipcRenderer */
/* eslint-disable @typescript-eslint/no-unused-vars */

function checkMount() {
  $id('mountrefresh').addClass('fa-spin');
  $id('mountbtn')
    .removeClass('btn-danger')
    .removeClass('btn-success')
    .addClass('btn-warning');
  $id('remotebtn').addClass('disabled');
  ipcRenderer.send('mount', 'bla');
}

function connectWireless() {
  $id('wirelessrefresh').addClass('fa-spin');
  $id('wirelessbtn').removeClass('btn-danger').addClass('btn-warning');
  ipcRenderer.send('connect_wireless', '');
}

function disconnectWireless() {
  $id('wirelessrefresh').addClass('fa-spin');
  $id('wirelessbtn').removeClass('btn-success').addClass('btn-warning');
  ipcRenderer.send('disconnect_wireless', '');
}
