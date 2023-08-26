import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Welcome from './pages/Welcome/Welcome';
import FileBrowserLocal from './pages/FileBrowser/FileBrowserLocal';
import FileBrowserRemote from './pages/FileBrowser/FileBrowserRemote';
import './utils/logger';
import './css/bootstrap-slate.css';
import './css/App.css';

export default function App() {
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
