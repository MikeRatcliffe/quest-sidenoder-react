import { useEffect, useState } from 'react';
import { AppIcon } from '../../../../assets/AppIcon.jsx';
import { Navbar as BootstrapNavbar, Button, Container } from 'react-bootstrap';
import { Icon } from '../shared/icon';

const remote = window.require('@electron/remote');
const { dialog, ipcRenderer } = window.require('electron');

function Navbar() {
  const [mounting, setMounting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wirelessRefresh, setWirelessRefresh] = useState(false);
  const [wirelessConnected, setWirelessConnected] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);

  useEffect(() => {
    ipcRenderer.on('check_mount', (event, arg) => {
      console.log('check_mount responded: ', arg); // prints "ping"
      if (arg.success) {
        setMounting(false);
        setMounted(true);
        if (!remote.getGlobal('adbDevice')) {
          return;
        }
      } else if (arg.error) {
        dialog.showMessageBox(null, {
          type: 'error',
          buttons: ['Ok'],
          title: 'RCLONE MOUNT FAILED',
          message: 'Rclone failed on mount command',
          detail: arg.error.toString(),
        });
      }
    });
    ipcRenderer.on('check_device', (event, arg) => {
      console.log('check_device msg:', arg);
      if (arg.success) {
        console.log('GETDEVICE SUCCESS');
        setDeviceConnected(true);
        // const deviceLinks = [document.querySelectorAll('a.adbdev')];
        // for (const link of deviceLinks) {
        // FIXME: We don't do it this way in React
        // link.removeClass('disabled');
        // }
        //   if (!mounted) {
        //     $id('updateBadge').addClass('disabled');
        //   }
        //   if (arg.success.endsWith(':5555')) {
        //     id('wirelessbtn').onclick = disconnectWireless;
        //     $id('wirelessbtn')
        //       .removeClass('btn-danger')
        //       .addClass('btn-success')
        //       .html(
        //         `<i id="wirelessrefresh" class="fa fa-check-circle-o"></i> | WIRELESS:<br>connected`,
        //       );
        //   }
        //   ipcRenderer.send('get_device_info', '');
        //   ipcRenderer.send('mp_name', { cmd: 'get' });
        // } else {
        //   $id('devicebtn')
        //     .removeClass('btn-success')
        //     .addClass('btn-danger')
        //     .html(
        //       `<i class="fa fa-refresh fa-spin"></i> | DEVICE:<br>disconnected`,
        //     );
        //   $('a.adbdev').addClass('disabled');
        //   id('wirelessbtn').onclick = connectWireless;
        //   $id('wirelessbtn')
        //     .removeClass('btn-success')
        //     .addClass('btn-danger')
        //     .html(
        //       `<i id="wirelessbtnrefresh" class="fa fa-refresh"></i> | WIRELESS:<br>disconnected`,
        //     );
      }
    });
  });

  function onWirelessClick() {
    setWirelessRefresh(true);
    if (wirelessConnected) {
      ipcRenderer.send('disconnect_wireless', '');
    } else {
      ipcRenderer.send('connect_wireless', '');
    }
  }

  function onCheckMountClick() {
    setMounting(true);
    ipcRenderer.send('mount', 'bla');
  }

  let wirelessVariant = null;
  if (wirelessRefresh) {
    wirelessVariant = 'warning';
  } else if (!wirelessConnected) {
    wirelessVariant = 'danger';
  }

  let mountButtonVariant = 'danger';
  function getMountRefreshIcon() {
    if (mounted) {
      mountButtonVariant = 'success';
      return (
        <Icon
          set="fa"
          icon="FaRegCheckCircle"
          id="mountrefresh"
          spin={mountButtonVariant !== 'success'}
        />
      );
    } else if (mounting) {
      mountButtonVariant = 'warning';
    }

    mountButtonVariant = 'danger';
    return (
      <Icon
        set="im"
        icon="ImSpinner11"
        id="mountrefresh"
        spin={mountButtonVariant === 'warning'}
      />
    );
  }

  return (
    <BootstrapNavbar
      id="navbar"
      variant="dark"
      className="justify-content-between border-0"
    >
      <BootstrapNavbar.Brand>
        <AppIcon
          width={60}
          height={50}
          mode="light"
          className="mr-2"
          title="Quest Sidenoder"
        />
      </BootstrapNavbar.Brand>
      <Button
        id="browse-local"
        variant="primary"
        className="me-1 text-nowrap"
        // onClick="loadInclude('browse_include.twig', null, () => ipcRenderer.send('get_dir', ``));"
      >
        <Icon set="fa" icon="FaRegFolderOpen" /> Browse
      </Button>
      <Button
        id="browse-remote"
        variant="info"
        className="me-1 text-nowrap"
        disabled={!mounted}
        // onClick="loadInclude('browse_include.twig', null, () => ipcRenderer.send('get_dir', remote.getGlobal('mountFolder')));"
      >
        <Icon set="fa" icon="FaRegFolderOpen" /> Remote
      </Button>
      <Button
        id="browse-installed"
        variant="primary"
        className="me-1 text-nowrap"
        // TODO: Find a way to pass mounted to this modal so that the update
        //       button can be shown / hidden
        // onClick="loadInclude('modals/installed.twig', 'installedmodaldiv')"
      >
        <Icon set="fa" icon="FaList" /> Installed
      </Button>
      <Button
        id="device-tweaks"
        variant="primary"
        className="me-1 text-nowrap"
        // onClick="loadInclude('modals/tweaks.twig', 'tweaksmodaldiv')"
      >
        <Icon set="fa" icon="FaBug" />
      </Button>
      <Button
        id="settings"
        variant="primary"
        className="me-1 text-nowrap"
        // onClick="loadInclude('settings_include.twig')"
      >
        <Icon set="fa" icon="FaCog" />
      </Button>
      <Container
        id="action-button-container"
        className="justify-content-end gap-2"
      >
        <Button
          id="mountbtn"
          variant={mountButtonVariant}
          size="sm"
          data-spin={mounting}
          className="text-nowrap"
          onClick={onCheckMountClick}
        >
          {getMountRefreshIcon()} {mounted ? 'UNMOUNT' : 'MOUNT'}
          <br />
          {mounted ? 'connected' : 'disconnected'}
        </Button>
        <Button
          id="devicebtn"
          variant={deviceConnected ? 'success' : 'danger'}
          size="sm"
          className="text-nowrap"
        >
          {deviceConnected ? (
            <Icon set="fa" icon="FaRegCheckCircle" />
          ) : (
            <Icon set="im" icon="ImSpinner11" spin={!deviceConnected} />
          )}{' '}
          DEVICE
          <br />
          {deviceConnected ? 'connected' : 'disconnected'}
        </Button>
        <Button
          id="wirelessbtn"
          variant={wirelessVariant}
          size="sm"
          className="text-nowrap"
          onClick={onWirelessClick}
        >
          <Icon
            id="wirelessrefresh"
            set="im"
            icon="ImSpinner11"
            spin={wirelessRefresh}
          />{' '}
          WIRELESS
          <br />
          disconnected
        </Button>
      </Container>
    </BootstrapNavbar>
  );
}

export { Navbar };

// events

// ipcRenderer.on("connect_wireless", (event, arg) => {
//   console.log("check_wireless msg came from backend to frontend:", arg);
//   $id("wirelessrefresh").removeClass("fa-spin");

//   if (arg.success) {
//     console.log("WIRELESS CONNECTED");
//     id("wirelessbtn").onclick = disconnectWireless;
//     $id("wirelessbtn")
//       .removeClass("btn-danger")
//       .addClass("btn-success")
//       .html(
//         `<i id="wirelessrefresh" class="fa fa-check-circle-o"></i> | WIRELESS:<br>connected`,
//       );

//     dialog.showMessageBox(null, {
//       type: "info",
//       buttons: ["Ok"],
//       title: "Device connected by TCP",
//       message:
//         "You can now unplug the USB cable and continue using the program via wireless connection",
//     });
//   } else {
//     id("wirelessbtn").onclick = connectWireless;
//     $id("wirelessbtn")
//       .removeClass("btn-success")
//       .addClass("btn-danger")
//       .html(
//         `<i id="wirelessbtnrefresh" class="fa fa-refresh"></i> | WIRELESS:<br>disconnected`,
//       );
//   }
// });

// let last_alert_msg;
// ipcRenderer.on("alert", (event, arg) => {
//   if (arg === last_alert_msg) {
//     return;
//   }
//   last_alert_msg = arg;
//   setTimeout(() => (last_alert_msg = false), 500);
//   alert(arg);
// });

// ipcRenderer.on("cmd_sent", (event, arg) => {
//   alert(`Command sended: \n ${arg.success}`);
// });

// ipcRenderer.on("ask_device", () => {
//   console.log("ask_device msg arrived");
//   $id("processingModal").modal("hide");
//   dialog.showMessageBox(null, {
//     type: "info",
//     buttons: ["Understood"],
//     title: "Missing device",
//     message: `This action cannot be performed without a device attached.`,
//   });
// });
