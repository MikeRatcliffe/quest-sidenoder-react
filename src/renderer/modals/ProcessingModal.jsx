import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_PROCESSING } from '../utils/constants';
import Icon from '../shared/Icon';

function Processing() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_PROCESSING)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_PROCESSING))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Processing
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Processing Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_PROCESSING))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Processing;
