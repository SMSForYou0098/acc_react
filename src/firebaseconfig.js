import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import axios from 'axios';

const firebaseConfig = {
    apiKey: "AIzaSyA2dbJ9f8hGINk4C9l8awST8kQ2t-ZZeZQ",
    authDomain: "event-notify-959b1.firebaseapp.com",
    projectId: "event-notify-959b1",
    storageBucket: "event-notify-959b1.firebasestorage.app",
    messagingSenderId: "15186708713",
    appId: "1:15186708713:web:cfeefd9b8fe3a352ca8878",
    measurementId: "G-VSZJ4MV2FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging = null;

// Safely initialize messaging if supported
const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// Call this function before using messaging
initializeMessaging();

// Request permission and save token
export const requestNotificationPermission = async (api) => {
  try {
    // Ensure messaging is initialized
    if (!messaging) {
      const initialized = await initializeMessaging();
      if (!initialized) {
        return false;
      }
    }

    // Check if service worker is registered
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      return false;
    }
    // Get token with better error handling
    try {
      const token = await getToken(messaging, {
        vapidKey: 'BMOb3YbQWaaPPYWUkvF47Bo2vrhizJv9KVx3yX1hCOjAIxC9TpbVxKRbNHIoYtiDtQCOk25Hancon8oI_02732E'
      });
      if (token) {
        axios.post(`${api}notifications/save-token`, {
          token: token,
        })
        .then((response) => {})
        .catch((error) => {});

        // Save token to your backend
        await saveTokenToServer(token,api);
        return true;
      } else {
        return false;
      }
    } catch (tokenError) {
      return false;
    }
  } catch (err) {
    return false;
  }
};

// Save token to your backend
const saveTokenToServer = async (token,api) => {
  try {
    const user = getCurrentUser(); // Replace with your auth logic
    
    // For development, fallback to logging if user is not available
    if (!user.id) {
      // Store in localStorage as fallback during development
      localStorage.setItem('fcm_token', token);
      return;
    }
    
    // Try to save to backend
    await axios.post('notifications/save-token', {
      token,
      user_id: user.id
    });
  } catch (err) {
    // Store in localStorage as fallback during development
    localStorage.setItem('fcm_token', token);
  }
};

// Handle foreground messages
export const setupForegroundNotification = (api) => {
  if (!messaging) {
    return;
  }
  
  onMessage(messaging, (payload) => {
    const notification = new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/notification-icon.png'
    });
    
    notification.onclick = (event) => {
      event.preventDefault();
      if (payload.data && payload.data.url) {
        window.open(payload.data.url, '_blank');
      }
      notification.close();
    };
  });
};

// Helper function to get the current user - replace with your auth logic
const getCurrentUser = () => {
  // Replace with your authentication logic
  return JSON.parse(localStorage.getItem('user')) || { id: null };
};