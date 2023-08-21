import PropTypes from 'prop-types';
import AppInfo from './components/AppInfo';
import Navbar from './components/Navbar';

function Header({ setCurrentPage }) {
  return (
    <div className="sticky" id="topbar">
      <Navbar setCurrentPage={setCurrentPage} />
      <AppInfo />
    </div>
  );
}

Header.propTypes = {
  setCurrentPage: PropTypes.func,
};

export default Header;
