import React, { createContext, useContext, useState, useEffect } from 'react';
import { postRoutesByUserId } from '../Utils/PostUserRoutesAPI.jsx';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [mode, setMode] = useState('TRANSIT'); // Default travel mode
  const [inputsCompleted, setInputsCompleted] = useState(false);
  const [routeDetails, setRouteDetails] = useState({
    distance: 0,
    duration: '',
    end_address: '',
    end_location_lat: 0,
    end_location_lng: 0,
    start_address: '',
    start_location_lat: 0,
    start_location_lng: 0,
    carbon_usage: 0,
  });
  const [isSaveIconClicked, setIsSaveIconClicked] = useState(false);

  useEffect(() => {
    if (isSaveIconClicked) {
      const user_id = 1; // Replace with actual user id logic
      postRoutesByUserId(routeDetails, mode, user_id);
      setIsSaveIconClicked((prev) => !prev); // Reset after handling
      console.log('Save icon clicked, triggered post request, useEffect happened in LocationContext');
    }
  }, [isSaveIconClicked]);

  // const toggleSaveIconClicked = () => {
  //   setIsSaveIconClicked((prev) => !prev);
  // };

  return (
    <LocationContext.Provider
      value={{
        origin,
        setOrigin,
        destination,
        setDestination,
        mode,
        setMode,
        inputsCompleted,
        setInputsCompleted,
        routeDetails,
        setRouteDetails,
        isSaveIconClicked,
        setIsSaveIconClicked,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Create a hook to use the context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};



