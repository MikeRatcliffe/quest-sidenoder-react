import { useState } from 'react';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeviceButtons from './DeviceButtons';
import NavigationButtons from './NavigationButtons';
import AppIcon from '../../../../../../assets/AppIcon';
import useIpcListener from '../../../../hooks/useIpcListener';

const { dialog } = window.require('@electron/remote');

function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mountRefresh, setMountRefresh] = useState(false);

  useIpcListener('check_mount', (event, arg) => {
    console.log('check_mount responded: ', arg);

    setMountRefresh(false);

    if (arg.success) {
      setMounted(true);
    } else {
      setMounted(false);

      if (arg.error) {
        dialog.showMessageBox(null, {
          type: 'error',
          buttons: ['Ok'],
          title: 'RCLONE MOUNT FAILED',
          message: 'Rclone failed on mount command',
          detail: arg.error.toString(),
        });
      }
    }
  });

  return (
    <BootstrapNavbar
      id="navbar"
      variant="dark"
      className="justify-content-between border-0"
    >
      <Link to="/">
        <Button variant="primary" className="me-1 p-0">
          <AppIcon
            width={46.5}
            height={46.5}
            mode="light"
            className="mr-2"
            title="Quest Sidenoder"
          />
        </Button>
      </Link>
      <NavigationButtons mounted={mounted} />
      <DeviceButtons
        mounted={mounted}
        setMounted={setMounted}
        mountRefresh={mountRefresh}
        setMountRefresh={setMountRefresh}
      />
    </BootstrapNavbar>
  );
}

export default Navbar;
