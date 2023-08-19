/* global $id,ipcRenderer,loadInclude */

// DOM
document.body.addEventListener('load', () => {
  ipcRenderer.removeAllListeners('ask_sideload');
});

document
  .querySelector('confirmSideloadButton')
  .addEventListener('click', () => {
    // setup listener for confirm btn, takes path form data dir, and sends start_sideload
    $id('confirmModal').modal('hide');

    const data = {
      path: $id('confirmSideloadButton').data('path'),
      update: $id('confirmSideloadButton').data('update'),
    };
    loadInclude('modals/sideload.twig', 'sideloadmodaldiv', () => {
      ipcRenderer.send('start_sideload', data);
    });
  });

// Electron
ipcRenderer.on('ask_sideload', (event, arg) => {
  console.log('ask_sideload msg arrived:', arg);
  $id('processingModal').modal('hide');
  const { success, install, update } = arg;
  if (!success) {
    return;
  }

  const lastslashindex = install.path.lastIndexOf('/');
  const file = install.path.substring(lastslashindex + 1);

  $id('confirmSideloadButton').data('path', install.path);
  $id('confirmSideloadButton').data('update', !!update);
  $id('confirmModalMessage').html(
    `Do you want to sideload: <br><b>${file}</b>`
  );

  if (install.install_desc) {
    $id('confirmModalInstallDesc').html(install.install_desc);
    $id('confirmModalInstallCont').show();
  } else {
    $id('confirmModalInstallCont').hide();
  }

  if (install.notes) {
    $id('confirmModalNotesDesc').html(install.notes);
    $id('confirmModalNotesCont').show();
  } else {
    $id('confirmModalNotesCont').hide();
  }

  $id('confirmModal').modal('show');
});
