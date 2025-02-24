import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import camera from './assets/camera.png';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';

function App() {
  React.useEffect(() => {
    document.title = "Photogram"; 
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = camera;
    document.head.appendChild(link);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />   
        <Route path="/upload" element={<UploadPage />} />   
        <Route path="/dashboard" element={<Dashboard />} />   
      </Routes>
    </Router>

    
  )
}

export default App;