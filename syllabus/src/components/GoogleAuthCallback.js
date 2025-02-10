import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleService from '../services/GoogleService';
import MongoService from '../services/MongoService';
const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const googleService = GoogleService();
  const mongoService = MongoService();
  async function getAccessToken(authCode) {
    await googleService.getAccessToken(authCode);
    const userInfo = await googleService.getUserInfo();
    const isGoogleLogin = localStorage.getItem('googleLogin');
    if(isGoogleLogin) {
      await mongoService.googleLoginUser(userInfo["email"],userInfo["given_name"], userInfo["family_name"]);
    }
    console.log("DONE")
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
      localStorage.setItem('uploadToCalendar', true)
      const jwt = localStorage.getItem('jwt');

      if (!jwt) {
        
      }

      // navigate(redirectUrl, { replace: true }); // Redirect back to previous page
      navigate("/", { history: "replace" })
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default GoogleAuthCallback;