import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import DeviceButtons from './DeviceButtons';
import NavigationButtons from './NavigationButtons';
import AppIcon from '../../../../../../assets/AppIcon';

const { dialog, ipcRenderer } = window.require('electron');

function Navbar({ setCurrentPage }) {
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
      <Button
        variant="primary"
        className="me-1 p-0"
        onClick={() => {
          setCurrentPage('SystemCheck');
        }}
      >
        <AppIcon
          width={46.5}
          height={46.5}
          mode="light"
          className="mr-2"
          title="Quest Sidenoder"
        />
      </Button>
      <NavigationButtons mounted={mounted} setCurrentPage={setCurrentPage} />
      <DeviceButtons
        mounted={mounted}
        setMounted={setMounted}
        mounting={mounting}
        setMounting={setMounting}
      />
    </BootstrapNavbar>
  );
}

Navbar.propTypes = {
  setCurrentPage: PropTypes.func,
};

export default Navbar;
