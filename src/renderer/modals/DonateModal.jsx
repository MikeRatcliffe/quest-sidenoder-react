import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function Donate({ closeDonateModal, isDonateModalVisible }) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isDonateModalVisible()}
      onHide={() => closeDonateModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> Donate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>Donate content</Modal.Body>
    </Modal>
  );
}

Donate.propTypes = {
  closeDonateModal: PropTypes.func,
  isDonateModalVisible: PropTypes.func,
};

export default Donate;
