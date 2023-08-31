import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import { ReactComponent as SideQuest } from '../img/sq-white.svg';
import { MODAL_SETTINGS } from '../utils/constants';
import {
  modalHide,
  formFieldsSelector,
  rcloneBinaryIsInvalid,
  rcloneConfigIsInvalid,
  rcloneIsValid,
  setField as setFieldAction,
  getModalIsVisibleSelector,
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

  const formFields = useSelector(formFieldsSelector);
  const isShown = useSelector((state) =>
    getModalIsVisibleSelector(state, MODAL_SETTINGS)
  );

  const setField = (key, val, sendChangeConfig = true) => {
    const payload = { key, val };

    dispatch(setFieldAction(payload));

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
    setField('scrcpyBinaryError', res.success ? '' : res.error, false);
  });

  useEffect(() => {
    sendIPC('check_rclone_setup', 'From useEffect');
    sendIPC('check_scrcpy_setup', 'From strcpyConf');
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
    setField(key, val);
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

        setField(key, val);
        break;

      // Textfields and dropdowns
      case 'cfgSection':
      case 'mountCmd':
      case 'proxyUrl':
        key = target.name;
        val = target.value;

        setField(key, val);
        break;

      // Textfields for paths
      case 'tmpdir-text':
        key = 'tmpdir';
        val = target.value;

        setField(key, val);
        break;
      case 'rclonePath-text':
        key = 'rclonePath';
        val = target.value;

        setField(key, val);
        sendIPC('check_rclone_setup', 'From rclonePath');
        break;
      case 'rcloneConf-text':
        key = 'rcloneConf';
        val = target.value;

        setField(key, val);
        sendIPC('check_rclone_setup', 'From rcloneConf');
        break;
      case 'scrcpyPath-text':
        key = 'scrcpyPath';
        val = target.value;

        setField(key, val);
        sendIPC('check_scrcpy_setup', 'From strcpyConf');
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
          title: 'Scrcpy custom binary path',
          message: 'Browse to Scrcpy binary location',
        });
        sendIPC('check_scrcpy_setup', 'From strcpyConf');
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

            <Form.Group className="m-3">
              <Form.Label>
                Select mirror (click on mount status button to remount)
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

            <Form.Group className="m-3 mt-0">
              <Form.Label>Custom Rclone binary path:</Form.Label>
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

            <Form.Group className="m-3 mt-0">
              <Form.Label>Custom Rclone config path:</Form.Label>
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
              <Form.Group className="m-3 mt-0">
                <Form.Label>Mount type:</Form.Label>
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

            <Form.Group className="m-3 mt-0" controlId="autoMount">
              <Form.Switch
                name="autoMount"
                className="fs-5"
                label="Automatically mount drive on startup (if not already mounted)"
                checked={formFields.autoMount}
                onChange={handleFieldChange}
              />
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Main:</Card.Header>
            <Form.Group className="m-3">
              <Form.Label>Custom Scrcpy binary path:</Form.Label>
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

            <Form.Group className="m-3 mt-0">
              <Form.Label>Custom temp directory:</Form.Label>
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
                  variant="outline-primary"
                  onClick={handleFieldChange}
                >
                  Browse
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="allowOtherDevices">
              <Form.Switch
                name="allowOtherDevices"
                className="fs-5"
                label="Allow connections to non-oculus devices"
                checked={formFields.allowOtherDevices}
                onChange={handleFieldChange}
              />
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="cacheOculusGames">
              <Form.Switch
                name="cacheOculusGames"
                className="fs-5"
                label="Cache Oculus Games when first opened (for faster reopening)"
                checked={formFields.cacheOculusGames}
                onChange={handleFieldChange}
              />
            </Form.Group>

            <Form.Group className="m-3 mt-0" controlId="userHide">
              <Form.Switch
                name="userHide"
                className="fs-5"
                label="Hide user name"
                checked={formFields.userHide}
                onChange={handleFieldChange}
              />
            </Form.Group>
          </Card>

          <Card className="mb-2">
            <Card.Header>Proxy settings EXPERIMENTAL:</Card.Header>
            <Form.Group className="m-3">
              <Form.Label>
                Socks proxy url (for example from
                https://hideip.me/ru/proxy/socks5list):
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

            <Form.Group className="m-3 mt-0 mb-0" controlId="proxyOculus">
              <Form.Check
                name="proxyOculus"
                type="switch"
                className="fs-5 me-0"
                inline
                checked={formFields.proxyOculus}
                onChange={handleFieldChange}
              />
              <Form.Check.Label>
                <Icon set="si" icon="SiOculus" /> Enable proxy for fetching
                Oculus information
              </Form.Check.Label>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="proxySteam">
              <Form.Check
                name="proxySteam"
                type="switch"
                className="fs-5 me-0"
                inline
                checked={formFields.proxySteam}
                onChange={handleFieldChange}
              />
              <Form.Check.Label>
                <Icon set="si" icon="SiSteam" /> Enable proxy for fetching Steam
                information
              </Form.Check.Label>
            </Form.Group>

            <Form.Group className="m-3 mt-0 mb-0" controlId="proxySQ">
              <Form.Check
                name="proxySQ"
                type="switch"
                className="fs-5 me-0"
                inline
                checked={formFields.proxySQ}
                onChange={handleFieldChange}
              />
              <Form.Check.Label>
                <SideQuest width="14" height="14" alt="SideQuest Icon" /> Enable
                proxy for fetching SideQuest information
              </Form.Check.Label>
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
