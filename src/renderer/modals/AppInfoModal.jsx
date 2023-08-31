import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { modalHide, getModalIsVisibleSelector } from '../../store';
import { MODAL_APPINFO } from '../utils/constants';
import Icon from '../shared/Icon';

function AppInfo() {
  const dispatch = useDispatch();

  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_APPINFO)
  );

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_APPINFO))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaList" /> App Info
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h1>AppInfo Modal</h1>

        <Button
          name="rclonePath"
          variant="primary"
          onClick={() => dispatch(modalHide(MODAL_APPINFO))}
        >
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default AppInfo;
