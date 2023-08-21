import PropTypes from 'prop-types';

function FileBrowserRemote({ show }) {
  return <h1 hidden={!show}>FileBrowserRemote.js</h1>;
}

FileBrowserRemote.propTypes = {
  show: PropTypes.bool,
};

export default FileBrowserRemote;
