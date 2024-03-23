import React from 'react';
import { MDBBtn, MDBContainer, MDBIcon } from 'mdb-react-ui-kit';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

export default function GoogleLogin() {
  const navigate = useNavigate(); // Use useNavigate hook to get the navigation function

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Login successful:', result.user);
      localStorage.setItem('token', result.user.accessToken);
      localStorage.setItem('uid', result.user.uid);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('isLoggedIn', true);
      navigate('/'); // Use navigate function to navigate to the home page
    } catch (error) {
      console.error('Google Login error:', error.message);
    }
  };

  return (
    <MDBContainer className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-center mb-5" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>Welcome to HelaGPT World</h1>
      <div className="text-center">
        <MDBBtn rounded social icon onClick={handleGoogleLogin} style={{ fontSize: '1.25rem' }}>
          <MDBIcon fab icon="google" className="fa-lg mr-md-2" /> Sign in with Google
        </MDBBtn>
      </div>
    </MDBContainer>
  );
}
