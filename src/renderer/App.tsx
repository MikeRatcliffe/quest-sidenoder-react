// import { useEffect } from 'react';
import React, { useState } from 'react';
import Header from './shared/components/Header/Header';
import Footer from './shared/components/Footer/Footer';
import Welcome from './pages/Welcome/Welcome';
import FileBrowserLocal from './pages/FileBrowser/FileBrowserLocal';
import FileBrowserRemote from './pages/FileBrowser/FileBrowserRemote';

import './css/bootstrap-slate.css';
import './css/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Welcome');

  return (
    <React.StrictMode>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div id="mainbody">
        <Welcome show={currentPage === 'Welcome'} />
        <FileBrowserLocal show={currentPage === 'FileBrowserLocal'} />
        <FileBrowserRemote show={currentPage === 'FileBrowserRemote'} />
      </div>
      <Footer />
    </React.StrictMode>
  );
}

export default App;
