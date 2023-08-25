import React from 'react';
import PropTypes from 'prop-types';
import Header from './shared/components/Header/Header';
import Footer from './shared/components/Footer/Footer';

function Layout({ children }) {
  return (
    <React.StrictMode>
      <Header />
      <div id="mainbody">{children}</div>
      <Footer />
    </React.StrictMode>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
