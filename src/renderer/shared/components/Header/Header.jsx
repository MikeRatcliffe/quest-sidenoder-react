import DeviceInfo from './components/DeviceInfo';
import Navbar from './components/Navbar';

function Header() {
  return (
    <div id="topbar">
      <Navbar />
      <DeviceInfo />
    </div>
  );
}

export default Header;
