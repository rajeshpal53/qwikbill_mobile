import { useState } from "react";

const UseTourGuideController = () => {
  // State to track if the tour is active
  const [isTourActive, setIsTourActive] = useState(false);

  // State to track the current step of the tour
  const [currentStep, setCurrentStep] = useState(0);

  // Function to start the tour
  const start = () => {
    setIsTourActive(true);
    setCurrentStep(1); // Assuming the tour starts from step 1
    console.log("Tour started");
  };

  // Function to stop the tour
  const stop = () => {
    setIsTourActive(false);
    setCurrentStep(0); // Reset the tour back to step 0
    console.log("Tour stopped");
  };

  // Function to move to the next step in the tour
  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Function to move to the previous step in the tour
  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0)); // Prevent going below step 0
  };

  // Return the tour state, controls, and step tracking
  return {
    canStart: !isTourActive, // Only allow start if the tour isn't active
    start,
    stop,
    nextStep,
    prevStep,
    isTourActive,
    currentStep,
  };
};

export default UseTourGuideController;
