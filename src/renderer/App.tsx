// import { useEffect } from 'react';
import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './shared/components/Header/Header';
import Footer from './shared/components/Footer/Footer';
import SystemCheck from './pages/SystemCheck/SystemCheck';
import FileBrowserLocal from './pages/FileBrowser/FileBrowserLocal';
import FileBrowserRemote from './pages/FileBrowser/FileBrowserRemote';

import './css/bootstrap-slate.css';
import './css/App.css';

function Sidenoder() {
  const [currentPage, setCurrentPage] = useState('SystemCheck');

  return (
    <React.StrictMode>
      <Header setCurrentPage={setCurrentPage} />
      <div id="mainbody">
        <SystemCheck show={currentPage === 'SystemCheck'} />
        <FileBrowserLocal show={currentPage === 'FileBrowserLocal'} />
        <FileBrowserRemote show={currentPage === 'FileBrowserRemote'} />
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
