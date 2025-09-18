import React, { createContext, useState, useEffect } from 'react';
import { useTourGuideController } from 'rn-tourguide';
import { ActivityIndicator } from 'react-native';

const TourGuideContext = createContext();

export const TourGuideProvider = ({ children }) => {
  const { canStart, start, stop, eventEmitter } = useTourGuideController();
  const [currentStep, setCurrentStep] = useState(0);
  const [isEventEmitterReady, setIsEventEmitterReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if eventEmitter is initialized using a Promise approach
  const checkEventEmitterInitialized = () => {
    return new Promise((resolve) => {
      if (eventEmitter) {
        resolve(eventEmitter);
      } else {
        const intervalId = setInterval(() => {
          if (eventEmitter) {
            clearInterval(intervalId);
            resolve(eventEmitter); // Resolve once it's available
          }
        }, 500); // Check every 500ms
      }
    });
  };

  // Initialize eventEmitter with a Promise and manage state
  useEffect(() => {
    const initEventEmitter = async () => {
      try {
        await checkEventEmitterInitialized(); // Wait for eventEmitter to be ready
        setIsEventEmitterReady(true); // Set the state to true once initialized
        setIsLoading(false); // Hide the loading spinner
      } catch (error) {
        console.log('Error initializing eventEmitter', error);
      }
    };

    initEventEmitter(); // Start the initialization
  }, [eventEmitter]);

  // Handle step changes
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1); // Move to the next step
  };

  const handleStart = () => start(); // Start the tour guide
  const handleStop = () => stop(); // Stop the tour guide

  // Function to trigger the start/stop based on eventEmitter being ready
  const triggerEvent = (event) => {
    if (eventEmitter) {
      eventEmitter.emit(event); // Emit events such as 'start', 'stop', 'stepChange'
    } else {
      console.log('eventEmitter not initialized yet');
    }
  };

  // if (isLoading) {
  //   return <ActivityIndicator size="large" />; // Loading state while eventEmitter is initializing
  // }

  return (
    <TourGuideContext.Provider
      value={{
        currentStep,
        handleStart,
        handleStop,
        handleNextStep,
        canStart,
        triggerEvent,
        eventEmitter,
      }}
    >
      {children}
    </TourGuideContext.Provider>
  );
};

export default TourGuideContext;
