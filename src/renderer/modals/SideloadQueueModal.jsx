import { PropTypes } from 'prop-types';
import { Modal } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function SideloadQueue({
  closeSideloadQueueModal,
  isSideloadQueueModalVisible,
}) {
  return (
    <Modal
      scrollable
      size="xl"
      show={isSideloadQueueModalVisible()}
      onHide={() => closeSideloadQueueModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaBug" /> SideloadQueue
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>SideloadQueue content</Modal.Body>
    </Modal>
  );
}

SideloadQueue.propTypes = {
  closeSideloadQueueModal: PropTypes.func,
  isSideloadQueueModalVisible: PropTypes.func,
};

export default SideloadQueue;
