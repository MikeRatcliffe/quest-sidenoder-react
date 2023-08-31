import { Button, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeviceButtons from './DeviceButtons';
import NavigationButtons from './NavigationButtons';
import AppIcon from '../../../../../../assets/AppIcon';

function Navbar() {
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
      <NavigationButtons />
      <DeviceButtons />
    </BootstrapNavbar>
  );
}

export default Navbar;
