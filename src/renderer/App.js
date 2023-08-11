import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Icon } from '../../assets/Icon.jsx';
import './App.css';

function Hello() {
  return (
    <div>
      <div className="app-container">
        <Icon width={200} height={200} title="Quest Sidenoder" />
      </div>
      <h1>Quest Sidenoder</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
