import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import debounce from 'debounce';
import { setShowScrollToTop } from '../store';

import './utils/IPCListeners';

import Layout from './Layout';
import Welcome from './pages/Welcome/Welcome';
import FileBrowserLocal from './pages/FileBrowser/FileBrowserLocal';
import FileBrowserRemote from './pages/FileBrowser/FileBrowserRemote';
import './utils/logger';
import './css/bootstrap-slate.css';
import './css/App.css';

const { ipcRenderer } = window.require('electron');

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener(
      'scroll',
      debounce(
        () => {
          const scroll = document.documentElement.scrollTop;
          dispatch(setShowScrollToTop(scroll > 100));
        },
        100,
        false
      )
    );

    document.ondragover = (ev) => {
      ev.preventDefault();
    };
    document.ondrop = document.ondragover;

    document.body.ondrop = (ev) => {
      ev.preventDefault();
      if (!ev.dataTransfer?.files || !ev.dataTransfer?.files.length) {
        return;
      }

      if (ev.dataTransfer?.files[0].path.endsWith('.apk')) {
        ipcRenderer.send(
          'filedrop',
          ev.dataTransfer?.files[0].path.replace(/\\/g, '/')
        );
      }
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Welcome />
            </Layout>
          }
        />
        <Route
          path="/browselocal"
          element={
            <Layout>
              <FileBrowserLocal />
            </Layout>
          }
        />
        <Route
          path="/browseremote"
          element={
            <Layout>
              <FileBrowserRemote />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
