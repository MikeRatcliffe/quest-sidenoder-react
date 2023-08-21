import PropTypes from 'prop-types';

function FileBrowserLocal({ show }) {
  return <h1 hidden={!show}>FileBrowserLocal.js</h1>;
}

FileBrowserLocal.propTypes = {
  show: PropTypes.bool,
};

export default FileBrowserLocal;
