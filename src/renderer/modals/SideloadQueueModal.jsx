import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_SIDELOADQUEUE } from '../utils/constants';
import Icon from '../shared/Icon';

function SideloadQueue() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_SIDELOADQUEUE)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_SIDELOADQUEUE))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> SideloadQueue
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>SideloadQueue Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_SIDELOADQUEUE))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default SideloadQueue;
