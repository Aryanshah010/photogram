import React from 'react'
import SignUp from './pages/SignUp';
import camera from './assets/camera.png';

function App() {
  React.useEffect(() => {
    document.title = "Photogram"; 
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = camera;
    document.head.appendChild(link);
  }, []);

  return (
    <SignUp/>
    
  )
}

export default App;