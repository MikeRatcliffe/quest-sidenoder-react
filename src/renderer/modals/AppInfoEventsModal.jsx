import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_APPINFOEVENTS } from '../utils/constants';
import Icon from '../shared/Icon';

function AppInfoEvents() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_APPINFOEVENTS)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_APPINFOEVENTS))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> Events:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>AppInfoEvents Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_APPINFOEVENTS))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default AppInfoEvents;
