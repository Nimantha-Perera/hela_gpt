import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes from react-router-dom

import Home from './components/Home/Home';
import Protect from './components/Home/Protect';
import GoogleLogin from './components/google_login/GoogleLogin';

function App() {
  return (
    <Router>
      
      <div className="App">
        <Routes>
        <Route path="/login" element={<GoogleLogin />} />
          <Route path="/" element={<Protect />}> {/* Use Protect as a wrapper */}
            <Route index element={<Home />} /> {/* Use index for the Home component */}
            {/* Use GoogleLoginComponent for login */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
