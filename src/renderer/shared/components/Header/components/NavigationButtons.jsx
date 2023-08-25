import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useModal from '../../../../hooks/useModal';
import SettingsModal from '../../../../modals/SettingsModal';
import DeviceTweaksModal from '../../../../modals/DeviceTweaksModal';
import InstalledModal from '../../../../modals/InstalledModal';

// import AppInfoModal from '../../modals/AppInfoModal';
// import AppInfoEventsModal from '../../modals/AppInfoEventsModal';
// import ConfirmModal from '../../modals/ConfirmModal';
// import SideloadModal from '../../modals/SideloadModal';
// import SideloadQueueModal from '../../modals/SideloadQueueModal';
// import AppStartModal from '../../modals/AppStartModal';
// import AppToolsModal from '../../modals/AppToolsModal';
// import StrcpyModal from '../../modals/StrcpyModal';
// import ProcessingModal from '../../modals/ProcessingModal';
// import DonateModal from '../../modals/DonateModal';
// import PromptModal from '../../modals/PromptModal';

import Icon from '../../../Icon';

function NavigationButtons({ mounted }) {
  const [
    openDeviceTweaksModal,
    closeDeviceTweaksModal,
    isDeviceTweaksModalVisible,
  ] = useModal('device-tweaks');
  const [openSettingsModal, closeSettingsModal, isSettingsModalVisible] =
    useModal('settings');
  const [openInstalledModal, closeInstalledModal, isInstalledModalVisible] =
    useModal('installed');
  // const [openAppInfoModal, closeAppInfoModal, isAppInfoModalVisible] =
  //   useModal('appinfo');
  // const [
  //   openAppInfoEventsModal,
  //   closeAppInfoEventsModal,
  //   isAppInfoEventsModalVisible,
  // ] = useModal('appinfoevents');
  // const [openConfirmModal, closeConfirmModal, isConfirmModalVisible] =
  //   useModal('confirm');
  // const [openSideloadModal, closeSideloadModal, isSideloadModalVisible] =
  //   useModal('sideload');
  // const [
  //   openSideloadQueueModal,
  //   closeSideloadQueueModal,
  //   isSideloadQueueModalVisible,
  // ] = useModal('sideload-queue');
  // const [openAppStartModal, closeAppStartModal, isAppStartModalVisible] =
  //   useModal('appstart');
  // const [openAppToolsModal, closeAppToolsModal, isAppToolsModalVisible] =
  //   useModal('apptools');
  // const [openStrcpyModal, closeStrcpyModal, isStrcpyModalVisible] =
  //   useModal('strcpy');
  // const [openProcessingModal, closeProcessingModal, isProcessingModalVisible] =
  //   useModal('processing');
  // const [openDonateModal, closeDonateModal, isDonateModalVisible] =
  //   useModal('donate');
  // const [openPromptModal, closePromptModal, isPromptModalVisible] =
  //   useModal('prompt');

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
        onClick={openInstalledModal}
      >
        <Icon set="fa" icon="FaList" /> Installed
      </Button>
      <Button
        id="device-tweaks"
        variant="primary"
        className="me-1 text-nowrap"
        onClick={openDeviceTweaksModal}
      >
        <Icon set="fa" icon="FaBug" />
      </Button>
      <Button
        id="settings"
        variant="primary"
        className="me-1 text-nowrap"
        onClick={openSettingsModal}
      >
        <Icon set="fa" icon="FaCog" />
      </Button>
      <SettingsModal
        closeSettingsModal={closeSettingsModal}
        isSettingsModalVisible={isSettingsModalVisible}
      />
      <DeviceTweaksModal
        closeDeviceTweaksModal={closeDeviceTweaksModal}
        isDeviceTweaksModalVisible={isDeviceTweaksModalVisible}
      />
      <InstalledModal
        closeInstalledModal={closeInstalledModal}
        isInstalledModalVisible={isInstalledModalVisible}
      />
      {/* <AppInfoModal
        closeAppInfoModal={closeAppInfoModal}
        isAppInfoModalVisible={isAppInfoModalVisible}
      /> */}
      {/* <AppInfoEventsModal
        closeAppInfoEventsModal={closeAppInfoEventsModal}
        isAppInfoEventsModalVisible={isAppInfoEventsModalVisible}
      /> */}
      {/* <ConfirmModal
        closeConfirmModal={closeConfirmModal}
        isConfirmModalVisible={isConfirmModalVisible}
      /> */}
      {/* <SideloadModal
        closeSideloadModal={closeSideloadModal}
        isSideloadModalVisible={isSideloadModalVisible}
      /> */}
      {/* <SideloadQueueModal
        closeSideloadQueueModal={closeSideloadQueueModal}
        isSideloadQueueModalVisible={isSideloadQueueModalVisible}
      /> */}
      {/* <AppStartModal
        closeAppStartModal={closeAppStartModal}
        isAppStartModalVisible={isAppStartModalVisible}
      /> */}
      {/* <AppToolsModal
        closeAppToolsModal={closeAppToolsModal}
        isAppToolsModalVisible={isAppToolsModalVisible}
      /> */}
      {/* <StrcpyModal
        closeStrcpyModal={closeStrcpyModal}
        isStrcpyModalVisible={isStrcpyModalVisible}
      /> */}
      {/* <ProcessingModal
        closeProcessingModal={closeProcessingModal}
        isProcessingModalVisible={isProcessingModalVisible}
      /> */}
      {/* <DonateModal
        closeDonateModal={closeDonateModal}
        isDonateModalVisible={isDonateModalVisible}
      /> */}
      {/* <PromptModal
        closePromptModal={closePromptModal}
        isPromptModalVisible={isPromptModalVisible}
      /> */}
    </>
  );
}

NavigationButtons.propTypes = {
  mounted: PropTypes.bool,
};

export default NavigationButtons;
