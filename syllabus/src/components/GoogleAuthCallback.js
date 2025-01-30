import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleService from '../services/GoogleService';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const googleService = GoogleService();
  async function getAccessToken(authCode) {
    await googleService.getAccessToken(authCode);
  }
  useEffect(() => {
    // Extract authorization code from URL
    const decodedURL = decodeURIComponent(window.location.search);
    const urlParams = new URLSearchParams(decodedURL);
    const authCode = urlParams.get('code');
    console.log(decodedURL)

    if (authCode) {
      console.log('Authorization Code:', authCode);
      getAccessToken(authCode);
      // After processing, redirect to the stored URL or home page
      const redirectUrl = localStorage.getItem('redirectAfterAuth') || '/';
      localStorage.removeItem('redirectAfterAuth'); // Clean up
      localStorage.setItem('uploadToCalendar', true)

      // navigate(redirectUrl, { replace: true }); // Redirect back to previous page
      navigate("/", { history: "replace" })
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default GoogleAuthCallback;