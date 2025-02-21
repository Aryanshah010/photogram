import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import camera from './assets/camera.png';
import Dashboard from './pages/Dashboard';

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />   
      </Routes>
    </Router>

    
  )
}

export default App;