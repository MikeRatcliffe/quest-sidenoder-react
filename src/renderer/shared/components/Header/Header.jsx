import AppInfo from './components/AppInfo';
import Navbar from './components/Navbar';

function Header() {
  return (
    <div className="sticky" id="topbar">
      <Navbar />
      <AppInfo />
    </div>
  );
}

export default Header;
