import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../shared/Icon';

function Installed({ closeInstalledModal, isInstalledModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isInstalledModalVisible()}
      onHide={() => closeInstalledModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Installed APKs
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Device Installed content</Modal.Body>
    </Modal>
  );
}

Installed.propTypes = {
  closeInstalledModal: PropTypes.func,
  isInstalledModalVisible: PropTypes.func,
};

export default Installed;
