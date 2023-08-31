import { Card } from 'react-bootstrap';
import Icon from '../../shared/Icon';

function FileBrowserLocal() {
  return (
    <Card>
      <Card.Header>
        <Icon set="fa" icon="FaList" size="sm" /> Browse Local Files
      </Card.Header>
      <Card.Body className="fs-5">
        <h1>FileBrowserLocal.js</h1>
      </Card.Body>
    </Card>
  );
}

export default FileBrowserLocal;
