import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_APPSTART } from '../utils/constants';
import Icon from '../shared/Icon';

function AppStart() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_APPSTART)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_APPSTART))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Launch Application
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>AppStart Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_APPSTART))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default AppStart;
