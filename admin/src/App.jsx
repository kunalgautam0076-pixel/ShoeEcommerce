import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
