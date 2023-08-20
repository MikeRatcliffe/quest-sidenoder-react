import { useEffect, useState } from 'react';
import { Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import DeviceButtons from './DeviceButtons';
import AppIcon from '../../../../assets/AppIcon';
import Icon from '../shared/icon';

const { dialog, ipcRenderer } = window.require('electron');

function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mounting, setMounting] = useState(false);

  useEffect(() => {
    ipcRenderer.removeAllListeners('check_mount');
    ipcRenderer.on('check_mount', (event, arg) => {
      console.log('check_mount responded: ', arg);
      if (arg.success) {
        setMounting(false);
        setMounted(true);
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
  }, []);

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
      <DeviceButtons
        mounted={mounted}
        setMounted={setMounted}
        mounting={mounting}
        setMounting={setMounting}
      />
    </BootstrapNavbar>
  );
}

export default Navbar;
