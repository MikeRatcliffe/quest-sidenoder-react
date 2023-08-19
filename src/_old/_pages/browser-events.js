/* global $,$id,addBookmark,id,fixIcons,getDir,ipcRenderer,loadDir,promptDialog,remote,resizeLoc,scrollDir,search,setLocation,shell,refreshDir,upDir */

// Electron
ipcRenderer.on('get_dir', (event, arg) => {
  console.log('get_dir msg arrived:', arg.path, arg.list.length);
  if (arg.success) {
    setLocation(arg.path);
    loadDir(arg.list);
    fixIcons();
  }
  $id('processingModal').modal('hide');
  if (search) {
    search.update();
  }
});

// DOM
document.body.addEventListener('load', () => {
  console.log('ONLOAD BROWSE');

  $id('processingModal').modal('show');
  id('nav-panel').style.top = `${$id('topbar').height()}px`; // fix navbar position

  const { dirBookmarks } = remote.getGlobal('currentConfiguration');
  for (const { name, path } of dirBookmarks) {
    addBookmark(name, path, false);
  }

  id('addBookmark').onclick = () => {
    addBookmark(id('bookmarkName').value, id('path').title);
  };
  id('shellOpenDirPath').onclick = () => {
    shell.openPath(id('path').title);
  };
  id('editDirPath').onclick = async () => {
    const loc = await promptDialog(
      'Change directory location',
      '',
      id('path').title,
      true
    );
    if (loc) {
      getDir(loc);
    }
  };

  window.addEventListener('resize', resizeLoc);
  window.addEventListener('scroll', scrollDir);
});

document.addEventListener('keydown', (e) => {
  if (!id('path')) {
    return;
  }

  console.log(e);
  if (
    e.code === 'Backspace' &&
    !$('.form-control').is(':focus') &&
    !$('.find-input').is(':focus') &&
    !$('#bookmarkName').is(':focus')
  ) {
    return upDir();
  }

  if (e.ctrlKey && e.code === 'KeyR') {
    return refreshDir();
  }

  if (e.ctrlKey && e.altKey && e.code === 'KeyD') {
    return remote.getGlobal('win').webContents.openDevTools();
  }
});
