import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function Sideload({ closeSideloadModal, isSideloadModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isSideloadModalVisible()}
      onHide={() => closeSideloadModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Sideload
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Sideload content</Modal.Body>
    </Modal>
  );
}

Sideload.propTypes = {
  closeSideloadModal: PropTypes.func,
  isSideloadModalVisible: PropTypes.func,
};

export default Sideload;
