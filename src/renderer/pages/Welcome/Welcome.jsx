import { Button, Card, Table } from 'react-bootstrap';
import AdbBlock from './components/AdbBlock';
import RcloneBlock from './components/RcloneBlock';
import ScrCpyBlock from './components/ScrCpyBlock';
import ZipBlock from './components/ZipBlock';
import Icon from '../../shared/Icon';

const remote = window.require('@electron/remote');
const { shell } = remote;
const platform = remote.getGlobal('platform');
const arch = remote.getGlobal('arch');
const tmpdir = remote.getGlobal('tmpdir');
const mountFolder = remote.getGlobal('mountFolder');
const sidenoderHome = remote.getGlobal('sidenoderHome');

function Welcome() {
  return (
    <Card>
      <Card.Header>
        <Icon set="fa" icon="FaList" size="sm" /> System Check
      </Card.Header>
      <Card.Body className="fs-5">
        <Table borderless hover size="sm" className="fit-first-column">
          <tbody>
            <tr>
              <th>Platform:</th>
              <td>
                {platform} {arch}
              </td>
            </tr>
            <tr>
              <th>Sidenoder Dir:</th>
              <td>
                {sidenoderHome}{' '}
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => shell.openPath(sidenoderHome)}
                >
                  <Icon set="fa" icon="FaHome" size="2xl" />
                </Button>
              </td>
            </tr>
            <tr>
              <th>Temp Dir:</th>
              <td>{tmpdir}</td>
            </tr>
            <tr>
              <th>Mount Dir:</th>
              <td>{mountFolder}</td>
            </tr>
          </tbody>
        </Table>
        <AdbBlock />
        <RcloneBlock />
        <ZipBlock />
        <ScrCpyBlock />
      </Card.Body>
    </Card>
  );
}

export default Welcome;
