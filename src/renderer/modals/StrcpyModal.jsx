import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_STRCPY } from '../utils/constants';
import Icon from '../shared/Icon';

function Strcpy() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_STRCPY)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_STRCPY))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Strcpy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>Strcpy Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_STRCPY))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default Strcpy;
