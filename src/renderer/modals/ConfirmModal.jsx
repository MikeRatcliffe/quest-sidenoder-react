import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_CONFIRM } from '../utils/constants';
import Icon from '../shared/Icon';

function Confirm() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_CONFIRM)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_CONFIRM))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Confirm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Confirm Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_CONFIRM))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Confirm;
