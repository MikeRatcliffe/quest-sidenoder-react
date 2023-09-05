import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import Tooltip from '../shared/components/Tooltip';
import { MODAL_SETTINGS } from '../utils/constants';
import {
  getModalIsVisibleSelector,
  modalHide,
  settingsFieldsSelector,
  rcloneBinaryIsInvalid,
  rcloneConfigIsInvalid,
  rcloneIsValid,
  setSettingsValue,
} from '../../store';
import Icon from '../shared/Icon';

import _useIpcListener from '../hooks/useIpcListener';
import _sendIPC from '../utils/sendIPC';

const sendIPC = _sendIPC.bind(this, module);
const useIpcListener = _useIpcListener.bind(this, module);

const { dialog } = window.require('@electron/remote');
const remote = window.require('@electron/remote');
const { shell } = remote;

const platform = remote.getGlobal('platform');

function SettingsModal() {
  const dispatch = useDispatch();

  const formFields = useSelector(settingsFieldsSelector);
  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_SETTINGS)
  );

  const setValue = (key, val, sendChangeConfig = true) => {
    const payload = { key, val };

    dispatch(setSettingsValue(payload));

    if (sendChangeConfig) {
      sendIPC('change_config', payload);
    }
  };

  useIpcListener('check_rclone_setup', (event, res) => {
    if (res.success) {
      dispatch(rcloneIsValid());
    } else if (res.error === 'Invalid Rclone binary') {
      dispatch(rcloneBinaryIsInvalid(res.error));
    } else {
      dispatch(rcloneConfigIsInvalid(res.error));
    }
  });

  useIpcListener('check_scrcpy_setup', (event, res) => {
    setValue('scrcpyBinaryError', res.success ? '' : res.error, false);
  });

  useEffect(() => {
    sendIPC('check_rclone_setup', 'From useEffect');
    sendIPC('check_scrcpy_setup', 'From scrcpyConf');
  }, []);

  async function setCustomPath({
    key,
    title,
    message,
    filters,
    type = 'openFile',
  }) {
    filters = filters || [
      {
        name: 'All',
        extensions: ['*'],
      },
    ];
    const res = await dialog.showOpenDialog(null, {
      properties: [type],
      title,
      message,
      filters,
    });
    if (res.canceled) {
      return;
    }

    const val = res.filePaths[0];
    setValue(key, val);
  }

  async function handleFieldChange({ target }) {
    let key = '';
    let val = '';

    switch (target.name) {
      // Checkboxes
      case 'autoMount':
      case 'allowOtherDevices':
      case 'cacheOculusGames':
      case 'proxyOculus':
      case 'proxySteam':
      case 'proxySQ':
      case 'userHide':
        key = target.name;
        val = target.checked;

        setValue(key, val);
        break;

      // Textfields and dropdowns
      case 'cfgSection':
      case 'mountCmd':
      case 'proxyUrl':
        key = target.name;
        val = target.value;

        setValue(key, val);
        break;

      // Textfields for paths
      case 'tmpdir-text':
        key = 'tmpdir';
        val = target.value;

        setValue(key, val);
        break;
      case 'rclonePath-text':
        key = 'rclonePath';
        val = target.value;

        setValue(key, val);
        sendIPC('check_rclone_setup', 'From rclonePath');
        break;
      case 'rcloneConf-text':
        key = 'rcloneConf';
        val = target.value;

        setValue(key, val);
        sendIPC('check_rclone_setup', 'From rcloneConf');
        break;
      case 'scrcpyPath-text':
        key = 'scrcpyPath';
        val = target.value;

        setValue(key, val);
        sendIPC('check_scrcpy_setup', 'From scrcpyConf');
        break;

      // File browser buttons
      case 'rclonePath':
        await setCustomPath({
          key: 'rclonePath',
          title: 'RClone custom binary path',
          message: 'Browse to rclone binary location',
        });
        sendIPC('check_rclone_setup', 'From rclonePath');
        break;
      case 'rcloneConf':
        await setCustomPath({
          key: 'rcloneConf',
          title: 'Rclone custom config path',
          message: 'Browse to Rclone config location',
        });
        sendIPC('check_rclone_setup', 'From rcloneConf');
        break;
      case 'scrcpyPath':
        await setCustomPath({
          key: 'scrcpyPath',
          title: 'scrcpy custom binary path',
          message: 'Browse to scrcpy binary location',
        });
        sendIPC('check_scrcpy_setup', 'From scrcpyConf');
        break;
      case 'tmpdir':
        await setCustomPath({
          key: 'tmpdir',
          title: 'Temp directory custom path',
          message: 'Browse to new temp directory location',
        });
        break;
      default:
      // Do Nothing
    }
  }

  return (
    <Modal
      scrollable
      size="xl"
      show={isShown}
      onHide={() => dispatch(modalHide(MODAL_SETTINGS))}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          <Icon set="fa" icon="FaCog" /> Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Card className="mb-2">
            <Card.Header>
              Rclone configs (needed for mounting remote disks):
            </Card.Header>

            <Form.Group className="formfield">
              <Form.Label>
                <span>
                  Select mirror (click on mount status button to remount):
                </span>
                <Tooltip style={{ float: 'right' }}>
                  This is the rclone mirror you would like to use. It should be
                  in your <code>rclone.config</code>
                </Tooltip>
              </Form.Label>
              <Form.Select
                name="cfgSection"
                onChange={handleFieldChange}
                value={formFields.cfgSection}
              >
                {formFields.rcloneSections.map((section) => {
                  return (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Rclone binary path:</span>
                <Tooltip style={{ float: 'right' }}>
                  Choose your Rclone binary path.
                </Tooltip>
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  name="rclonePath-text"
                  type="text"
                  value={formFields.rclonePath}
                  placeholder={formFields.rclonePlaceholder}
                  onChange={handleFieldChange}
                  isInvalid={!!formFields.rcloneBinaryError}
                />
                <Button
                  name="rclonePath"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
                <Button
                  variant="info"
                  onClick={() => {
                    shell.openExternal('https://downloads.rclone.org/');
                  }}
                >
                  Download
                </Button>
                <Form.Control.Feedback type="invalid">
                  {formFields.rcloneBinaryError}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Custom Rclone config path:</span>
                <Tooltip style={{ float: 'right' }}>
                  Choose your custom Rclone config path.
                </Tooltip>
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  name="rcloneConf-text"
                  type="text"
                  value={formFields.rcloneConf}
                  onChange={handleFieldChange}
                  isInvalid={!!formFields.rcloneConfigError}
                />
                <Button
                  name="rcloneConf"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
                <Form.Control.Feedback type="invalid">
                  {formFields.rcloneConfigError}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {platform === 'mac' && (
              <Form.Group className="formfield">
                <Form.Label>
                  <span>Mount type:</span>
                  <Tooltip style={{ float: 'right' }}>
                    You should probably use <code>mount</code>, but if you are
                    using older versions of OSX and it isn&apos;t working then
                    give <code>cmount</code> a try.
                  </Tooltip>
                </Form.Label>
                <Form.Select
                  name="mountCmd"
                  value={formFields.mountCmd}
                  onChange={handleFieldChange}
                >
                  <option value="mount">mount</option>
                  <option value="cmount">
                    cmount (supports legacy rclone versions)
                  </option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="formfield">
              <Form.Label>
                <span>Automount:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  If you have a valid <code>rclone</code> config then the drive
                  can be automatically mounted when the app is launched.
                </div>
                <Form.Switch
                  name="autoMount"
                  className="fs-5"
                  label="Automatically mount drive on startup (if not already mounted)"
                  checked={formFields.autoMount}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Main:</Card.Header>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Custom Scrcpy binary path:</span>
                <Tooltip style={{ float: 'right' }}>
                  Choose a custom <code>scrcpy</code> binary path.
                </Tooltip>
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  name="scrcpyPath-text"
                  type="text"
                  value={formFields.scrcpyPath}
                  placeholder={formFields.scrcpyPlaceholder}
                  onChange={handleFieldChange}
                  isInvalid={!!formFields.scrcpyBinaryError}
                />
                <Button
                  name="scrcpyPath"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
                <Button
                  variant="info"
                  onClick={() => {
                    shell.openExternal(
                      'https://github.com/Genymobile/scrcpy/releases/latest'
                    );
                  }}
                >
                  Download
                </Button>
                <Form.Control.Feedback type="invalid">
                  {formFields.scrcpyBinaryError}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Custom temp directory:</span>
                <Tooltip style={{ float: 'right' }}>
                  Choose a custom temporary directory.
                </Tooltip>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="tmpdir-text"
                  type="text"
                  value={formFields.tmpdir}
                  placeholder={formFields.tmpdirPlaceholder}
                  onChange={handleFieldChange}
                />
                <Button
                  name="tmpdir"
                  variant="primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Connections to non-meta devices:</span>
              </Form.Label>
              <div className="formfield-body">
                <p>
                  By default, Sidenoder only allows connections to Meta devices.
                  This setting allows connections to non-meta devices.
                </p>
                <p>
                  <strong>NOTE:</strong> Although Sidenoder will probably still
                  be capable of installing apps on these devices, other
                  functions may not work properly.
                </p>
                <Form.Switch
                  name="allowOtherDevices"
                  className="fs-5"
                  label="Allow connections to non-meta devices"
                  checked={formFields.allowOtherDevices}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Game and app caching:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  Caching game and app information makes it unneccessary for
                  Sidenoder to refetch the list of files in a folder when it has
                  been previously visited.
                </div>
                <Form.Switch
                  name="cacheOculusGames"
                  className="fs-5"
                  label="Cache Meta Games when first opened"
                  checked={formFields.cacheOculusGames}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Anonymity:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  This setting displays &quot;hidden&quot; in the system info
                  section in Sidenoder&apos;s header instead of your user name.
                </div>
                <Form.Switch
                  name="userHide"
                  className="fs-5"
                  label="Hide user name"
                  checked={formFields.userHide}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Proxy settings EXPERIMENTAL:</Card.Header>

            <Form.Group className="formfield">
              <Form.Label>
                <span>
                  Socks proxy URL (for example from
                  https://hideip.me/ru/proxy/socks5list):
                </span>
                <Tooltip style={{ float: 'right' }}>
                  A SOCKS proxies allow users to change their virtual location
                  (also known as location spoofing). A SOCKS5 proxy also lets
                  you hide your IP address from online services.
                </Tooltip>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  name="proxyUrl"
                  type="text"
                  value={formFields.proxyUrl}
                  placeholder="socks://[HOST]:[PORT]"
                  onChange={handleFieldChange}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Meta Proxy:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  Use your SOCKS proxy when accessing information from Meta.
                </div>
                <Form.Switch
                  name="proxyOculus"
                  className="fs-5 me-0"
                  label="Enable proxy for Meta information"
                  checked={formFields.proxyOculus}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Steam Proxy:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  Use your SOCKS proxy when accessing information from Steam.
                </div>
                <Form.Switch
                  name="proxySteam"
                  type="switch"
                  className="fs-5 me-0"
                  label="Enable proxy for fetching Steam information"
                  checked={formFields.proxySteam}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="formfield">
              <Form.Label>
                <span>Steam Proxy:</span>
              </Form.Label>
              <div className="formfield-body">
                <div>
                  Use your SOCKS proxy when accessing information from
                  SideQuest.
                </div>
                <Form.Switch
                  name="proxySQ"
                  type="switch"
                  className="fs-5 me-0"
                  label="Enable proxy for fetching SideQuest information"
                  checked={formFields.proxySQ}
                  onChange={handleFieldChange}
                />
              </div>
            </Form.Group>
          </Card>
        </Form>

        <Form.Group className="pull-right m-1 mt-2 me-0">
          <Button
            variant="primary"
            onClick={() => dispatch(modalHide(MODAL_SETTINGS))}
          >
            Close
          </Button>
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
}

export default SettingsModal;
