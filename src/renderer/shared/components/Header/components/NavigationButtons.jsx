import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  modalShow,
  setMountConnected,
  mountConnectedSelector,
} from '../../../../../store';
import {
  MODAL_INSTALLED,
  MODAL_TWEAKS,
  MODAL_SETTINGS,
} from '../../../../utils/constants';
import MessageBox from '../../../../modals/MessageBox';
import SettingsModal from '../../../../modals/SettingsModal';
import TweaksModal from '../../../../modals/TweaksModal';
import InstalledModal from '../../../../modals/InstalledModal';
import ScrcpyModal from '../../../../modals/ScrcpyModal';
import Icon from '../../../Icon';

import _useIpcListener from '../../../../hooks/useIpcListener';
const useIpcListener = _useIpcListener.bind(this, module);

// import AppInfoEventsModal from '../../../../modals/AppInfoEventsModal';
// import AppInfoModal from '../../../../modals/AppInfoModal';
// import AppStartModal from '../../../../modals/AppStartModal';
// import AppToolsModal from '../../../../modals/AppToolsModal';
// import ConfirmModal from '../../../../modals/ConfirmModal';
// import DonateModal from '../../../../modals/DonateModal';
// import ProcessingModal from '../../../../modals/ProcessingModal';
// import PromptModal from '../../../../modals/PromptModal';
// import SideloadModal from '../../../../modals/SideloadModal';
// import SideloadQueueModal from '../../../../modals/SideloadQueueModal';

function NavigationButtons() {
  const dispatch = useDispatch();
  const mounted = useSelector(mountConnectedSelector);

  useIpcListener('check_mount', (event, arg) => {
    console.log('check_mount responded: ', arg);

    dispatch(setMountConnected(arg.success));
  });

  return (
    <>
      <Link to="/browselocal">
        <Button
          id="browse-local"
          variant="primary"
          className="me-1 text-nowrap"
        >
          <Icon set="fa" icon="FaRegFolderOpen" /> Browse
        </Button>
      </Link>
      <Link to={mounted && '/browseremote'}>
        <Button
          id="browse-remote"
          variant="info"
          className="me-1 text-nowrap"
          disabled={!mounted}
        >
          <Icon set="fa" icon="FaRegFolderOpen" /> Remote
        </Button>
      </Link>
      <Button
        id="browse-installed"
        variant="primary"
        className="me-1 text-nowrap"
        onClick={() => dispatch(modalShow(MODAL_INSTALLED))}
      >
        <Icon set="fa" icon="FaList" /> Installed
      </Button>
      <Button
        id="device-tweaks"
        variant="primary"
        className="me-1 text-nowrap"
        onClick={() => dispatch(modalShow(MODAL_TWEAKS))}
      >
        <Icon set="fa" icon="FaBug" />
      </Button>
      <Button
        id="settings"
        variant="primary"
        className="me-1 text-nowrap"
        onClick={() => dispatch(modalShow(MODAL_SETTINGS))}
      >
        <Icon set="fa" icon="FaCog" />
      </Button>
      <SettingsModal />
      <TweaksModal />
      <InstalledModal />
      <MessageBox />
      {/* <AppInfoModal /> */}
      {/* <AppInfoEventsModal /> */}
      {/* <ConfirmModal /> */}
      {/* <SideloadModal /> */}
      {/* <SideloadQueueModal /> */}
      {/* <AppStartModal /> */}
      {/* <AppToolsModal /> */}
      <ScrcpyModal />
      {/* <ProcessingModal /> */}
      {/* <DonateModal /> */}
      {/* <PromptModal /> */}
    </>
  );
}

export default NavigationButtons;
