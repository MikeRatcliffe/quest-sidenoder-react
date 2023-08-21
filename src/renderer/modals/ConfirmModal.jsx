import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../components/shared/Icon';

function Confirm({ closeConfirmModal, isConfirmModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isConfirmModalVisible()}
      onHide={() => closeConfirmModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Confirm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Confirm content</Modal.Body>
    </Modal>
  );
}

Confirm.propTypes = {
  closeConfirmModal: PropTypes.func,
  isConfirmModalVisible: PropTypes.func,
};

export default Confirm;
