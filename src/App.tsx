
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Home/pages';

import ProductDashboard from './Product/GetProduct'; // Import your ProductDashboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dashboard" element={<DashBoard />} /> */}
        <Route path="/home" element={<ProductDashboard />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
