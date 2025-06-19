import React, { useCallback, useEffect } from 'react'
import { useMyContext } from '../Context/MyContextProvider';
import { useDispatch } from 'react-redux';
import { setSetting } from '../store/setting/actions';
import { logout } from '../store/slices/authSlice';
import { setupForegroundNotification } from '../firebaseconfig';
import axios from 'axios';
import PushNotificationButton from './PushNotificationButton';
import { checkAndClearSessionData } from './checkAndClearSessionData';

const getTimeoutDuration = (role) => {
    switch (role) {
        case 'User':
            return 5 * 60 * 1000; // 5 minutes
        case 'Scanner':
        case 'Agent':
        case 'Organizer':
            return 4 * 60 * 60 * 1000; // 4 hours
        default:
            return null;
    }
};

function AppContent({ children }) {
    const { userRole, api,systemSetting } = useMyContext();
    const dispatch = useDispatch();
    const [logoutTimer, setLogoutTimer] = React.useState(null);

    const handleLogout = useCallback(async () => {
        dispatch(logout());
    }, []);
    useEffect(() => {
        // Only set up timer if user is logged in
        if (!userRole) return;

        const timeoutDuration = getTimeoutDuration(userRole);
        if (!timeoutDuration) return;

        const resetTimer = () => {
            if (logoutTimer) clearTimeout(logoutTimer);
            setLogoutTimer(setTimeout(handleLogout, timeoutDuration));
        };

        const activityEvents = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart'
        ];

        activityEvents.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            if (logoutTimer) clearTimeout(logoutTimer);
            activityEvents.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    useEffect(() => {
        dispatch(setSetting());
        checkAndClearSessionData();
        setupForegroundNotification(api)
        const handleContextMenu = (event) => {
            event.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    //kinjal
    // useEffect(() => {
    //     // Function to get user's location
    //     const getUserLocation = async () => {
    //       try {
    //         // Many mobile browsers require a user gesture before allowing geolocation
    //         const position = await new Promise((resolve, reject) => {
    //           navigator.geolocation.getCurrentPosition(resolve, reject, {
    //             enableHighAccuracy: true, // Better for mobile
    //             timeout: 10000,           // 10 seconds timeout
    //             maximumAge: 0             // Always get fresh location
    //           });
    //         });
            
    //         const { latitude, longitude } = position.coords;
            
    //         // Fetch detailed location info from BigDataCloud API
    //         const response = await axios.get(
    //           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    //         );
            
    //         const locationDetails = response.data;
            
    //         // Send location details to your API
    //         await axios.post(`${api}store-device`, {
    //           latitude,
    //           longitude,
    //           city: locationDetails.city,
    //           locality: locationDetails.locality,
    //           country: locationDetails.countryName,
    //           principalSubdivision: locationDetails.principalSubdivision,
    //         });
            
    //         localStorage.setItem("locationSent", "true");
    //       } catch (error) {
    //         console.error("Error with location:", error.message);
    //         // Don't set locationSent flag if there was an error, so we can try again later
    //       }
    //     };
      
    //     // Check if we've already sent location
    //     const locationSent = localStorage.getItem("locationSent");
        
    //     if (!locationSent && navigator.geolocation) {
    //       // For mobile devices, it's better to request location on a user interaction
    //       const initLocationRequest = () => {
    //         getUserLocation();
    //         // Remove event listeners after first interaction
    //         document.removeEventListener('touchstart', initLocationRequest);
    //         document.removeEventListener('mousedown', initLocationRequest);
    //       };
          
    //       // Add event listeners for user interaction
    //       document.addEventListener('touchstart', initLocationRequest);
    //       document.addEventListener('mousedown', initLocationRequest);
          
    //       // Try to get location immediately for desktop browsers
    //       getUserLocation();
          
    //       return () => {
    //         // Clean up event listeners
    //         document.removeEventListener('touchstart', initLocationRequest);
    //         document.removeEventListener('mousedown', initLocationRequest);
    //       };
    //     }
    //   }, []);

    return (
        <div className="App">
            {systemSetting?.notify_req ? <PushNotificationButton /> : null}
            {children}
        </div>
    );
}

export default AppContent
