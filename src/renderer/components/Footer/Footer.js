import * as path from 'path';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Icon } from '../shared/icon';

const remote = window.require('@electron/remote');
const { shell } = remote;

function Footer() {
  const repository = remote.getGlobal('repository');
  const sidenoderHome = remote.getGlobal('sidenoderHome');
  const version = remote.getGlobal('version');
  const logPath = path.join(sidenoderHome, 'debug_last.log');

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const scroll = document.documentElement.scrollTop;
      setShowScrollToTop(scroll > 100);
    });
  });

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
        onClick={() => {
          document.documentElement.scrollTop = 0;
        }}
      >
        <Icon set="fa6" icon="FaAngleUp" size="2xl" />
      </Button>
    </footer>
  );
}

export { Footer };
