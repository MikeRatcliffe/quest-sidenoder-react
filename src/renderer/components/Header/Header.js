import { AppInfo } from './AppInfo';
import { Navbar } from './Navbar';

function Header() {
  return (
    <div className="sticky" id="topbar">
      <Navbar />
      <AppInfo />
    </div>
  );
}

export { Header };
