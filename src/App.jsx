import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CategorySelect from './components/CategorySelect';
import Wall from './components/Wall';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<CategorySelect />} />
        <Route path="/wall/:category" element={<Wall />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
