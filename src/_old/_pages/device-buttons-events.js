/* global $,$id,connectWireless,disconnectWireless,id,ipcRenderer,remote,showMessageBox */

ipcRenderer.on('check_mount', (event, arg) => {
  console.log('check_mount responded: ', arg); // prints "ping"
  if (arg.success) {
    $id('mountrefresh').removeClass('fa-spin');
    $id('mountbtn')
      .removeClass('btn-warning')
      .removeClass('btn-danger')
      .addClass('btn-success')
      .html(
        `<i id="mountrefresh" class="fa fa-check-circle-o"></i> | UNMOUNT:<br>connected`
      );
    document.querySelector('remotebtn').classList.remove('disabled');

    if (!remote.getGlobal('adbDevice')) {
      return;
    }

    document.querySelector('updateBadge').classList.remove('disabled');
  } else {
    $id('mountrefresh').removeClass('fa-spin');
    $id('mountbtn')
      .removeClass('btn-success')
      .removeClass('btn-warning')
      .addClass('btn-danger')
      .html(
        `<i id="mountrefresh" class="fa fa-refresh"></i> | MOUNT:<br>disconnected`
      );
    $id('remotebtn').addClass('disabled');

    $id('updateBadge').addClass('disabled');

    if (arg.error) {
      showMessageBox({
        type: 'error',
        title: 'RCLONE MOUNT FAILED',
        message: 'Rclone failed on mount command',
        detail: arg.error.toString(),
      });
    }
  }
});

ipcRenderer.on('check_device', (event, arg) => {
  console.log('check_device msg:', arg);

  if (arg.success) {
    console.log('GETDEVICE SUCCESS');
    $id('devicebtn')
      .removeClass('btn-danger')
      .addClass('btn-success')
      .html(`<i class="fa fa-check-circle-o"></i> | DEVICE:<br>connected`);

    $('a.adbdev').removeClass('disabled');
    if (!remote.getGlobal('mounted')) {
      $id('updateBadge').addClass('disabled');
    }

    if (arg.success.endsWith(':5555')) {
      id('wirelessbtn').onclick = disconnectWireless;
      $id('wirelessbtn')
        .removeClass('btn-danger')
        .addClass('btn-success')
        .html(
          `<i id="wirelessrefresh" class="fa fa-check-circle-o"></i> | WIRELESS:<br>connected`
        );
    }

    ipcRenderer.send('get_device_info', '');
    ipcRenderer.send('mp_name', { cmd: 'get' });
  } else {
    $id('devicebtn')
      .removeClass('btn-success')
      .addClass('btn-danger')
      .html(`<i class="fa fa-refresh fa-spin"></i> | DEVICE:<br>disconnected`);

    $('a.adbdev').addClass('disabled');

    id('wirelessbtn').onclick = connectWireless;
    $id('wirelessbtn')
      .removeClass('btn-success')
      .addClass('btn-danger')
      .html(
        `<i id="wirelessbtnrefresh" class="fa fa-refresh"></i> | WIRELESS:<br>disconnected`
      );
  }
});

ipcRenderer.on('connect_wireless', (event, arg) => {
  console.log('connect_wireless msg came from backend to frontend:', arg);
  $id('wirelessrefresh').removeClass('fa-spin');

  if (arg.success) {
    console.log('WIRELESS CONNECTED');
    id('wirelessbtn').onclick = disconnectWireless;
    $id('wirelessbtn')
      .removeClass('btn-danger')
      .addClass('btn-success')
      .html(
        `<i id="wirelessrefresh" class="fa fa-check-circle-o"></i> | WIRELESS:<br>connected`
      );

    showMessageBox({
      type: 'info',
      title: 'Device connected by TCP',
      message:
        'You can now unplug the USB cable and continue using the program via wireless connection',
    });
  } else {
    id('wirelessbtn').onclick = connectWireless;
    $id('wirelessbtn')
      .removeClass('btn-success')
      .addClass('btn-danger')
      .html(
        `<i id="wirelessbtnrefresh" class="fa fa-refresh"></i> | WIRELESS:<br>disconnected`
      );
  }
});
