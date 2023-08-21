import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function Strcpy({ closeStrcpyModal, isStrcpyModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isStrcpyModalVisible()}
      onHide={() => closeStrcpyModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Strcpy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Strcpy content</Modal.Body>
    </Modal>
  );
}

Strcpy.propTypes = {
  closeStrcpyModal: PropTypes.func,
  isStrcpyModalVisible: PropTypes.func,
};

export default Strcpy;
