// import { useEffect } from 'react';
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { SystemCheck } from './components/SystemCheck/SystemCheck';
import './utils/logger';

// import { dialog, ipcRenderer, shell } from 'electron';
import './css/bootstrap-slate.css';
import './css/App.css';

function Sidenoder() {
  // useEffect(() => {
  //   document.ondragover = document.ondrop = (ev) => {
  //     ev.preventDefault();
  //   };

  //   document.body.ondrop = (ev) => {
  //     ev.preventDefault();
  //     if (!ev.dataTransfer.files || !ev.dataTransfer.files.length) {
  //       return;
  //     }

  //     if (ev.dataTransfer.files[0].path.endsWith('.apk')) {
  //       ipcRenderer.send(
  //         'filedrop',
  //         ev.dataTransfer.files[0].path.replace(/\\/g, '/'),
  //       );
  //     }
  //   };

  //   ipcRenderer.on('log', (event, arg) => {
  //     console.log('log arrived');
  //     console.log(arg);
  //   });

  //   ipcRenderer.on('notify_update', async (event, arg) => {
  //     console.log('notify_update msg arrived');
  //     const response = await dialog.showMessageBox(null, {
  //       type: 'info',
  //       buttons: ['Cancel', 'Download'],
  //       title: `Update available ${arg.current} to ${arg.remote}`,
  //       message: `sidenoder-${arg.remote} is now available on github.`,
  //       detail: arg.description,
  //     });

  //     if (response === 1) {
  //       shell.openExternal(arg.url);
  //     }
  //   });
  // });

  return (
    <React.StrictMode>
      <Header />
      <div id="mainbody">
        <SystemCheck />
      </div>
      <Footer />
    </React.StrictMode>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sidenoder />} />
      </Routes>
    </Router>
  );
}
