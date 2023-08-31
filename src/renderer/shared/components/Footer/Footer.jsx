import * as path from 'path';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { showScrollToTopSelector } from '../../../../store';

import Icon from '../../Icon';

const remote = window.require('@electron/remote');
const { shell } = remote;

const version = remote.getGlobal('version');
const sidenoderHome = remote.getGlobal('sidenoderHome');
const logPath = path.join(sidenoderHome, 'debug_last.log');
const repository = remote.getGlobal('repository');

function Footer() {
  const showScrollToTop = useSelector(showScrollToTopSelector);

  return (
    <footer className="footer text-center">
      <hr />
      <Button
        size="sm"
        variant="dark"
        onClick={() => {
          shell.openPath(logPath);
        }}
      >
        <Icon set="fa" icon="FaRegFileCode" /> log
      </Button>{' '}
      <b>SideNoder v{version}</b>
      <br />
      <Button
        variant="link"
        size="sm"
        className="border-0 text-decoration-none"
        onClick={() => {
          shell.openExternal(repository);
        }}
      >
        Github Repository
      </Button>
      <Button
        size="lg"
        id="backToTop"
        className={showScrollToTop ? 'fade-in' : 'fade-out'}
        style={{ opacity: showScrollToTop ? '1' : '0' }}
        onClick={() => {
          document.documentElement.scrollTop = 0;
        }}
      >
        <Icon set="fa6" icon="FaAngleUp" size="2xl" />
      </Button>
    </footer>
  );
}

export default Footer;
