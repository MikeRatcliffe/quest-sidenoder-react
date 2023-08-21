import PropTypes from 'prop-types';
import AppInfo from './components/AppInfo';
import Navbar from './components/Navbar';

function Header({ currentPage, setCurrentPage }) {
  return (
    <div className="sticky" id="topbar">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <AppInfo />
    </div>
  );
}

Header.propTypes = {
  currentPage: PropTypes.string,
  setCurrentPage: PropTypes.func,
};

export default Header;
