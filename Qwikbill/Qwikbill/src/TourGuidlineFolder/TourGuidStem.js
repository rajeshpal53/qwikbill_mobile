
// Define common styles for all steps
const commonStyles = {
    position: "absolute",
    width: "100%",
    height: 32,
  };

  export const HomeScreenTourGuideSteps = [
    {
      id: 0,
      target: "homeButton", // The ID of the component you want to highlight
      title: "Welcome to QwikBill!",
      text: "Welcome to the QwikBill app. Here, you can manage everything.",
      shape: "circle",
      tooltip: "This is your home button. Tap here to go back to the home screen.",
      style: {
        ...commonStyles,
        top: 36,
      },
      onPress: handleNextStep, // Shared onPress behavior
    },
    {
      id: 1,
      target: "User-Name",
      title: "User Name",
      text: "This is where your user name is displayed.",
      shape: "rectangle",
      tooltip: "This is your User Name. Tap to view or edit.",
      style: {
        ...commonStyles,
        top: 70, // You can modify top or other positioning here
      },
      onPress: handleNextStep,
    },
    {
      id: 2,
      target: "Last-login",
      title: "Last Login",
      text: "This shows when you last logged in.",
      shape: "rectangle",
      tooltip: "This is the date and time of your last login.",
      style: {
        ...commonStyles,
        top: 100,
      },
      onPress: handleNextStep,
    },
    {
      id: 3,
      target: "See-vender",
      title: "See All Vendors in Dropdown",
      text: "You can see all vendors here in a dropdown list.",
      shape: "rectangle",
      tooltip: "Click to expand the dropdown and see all vendors.",
      style: {
        position: "absolute",
        width: "80%",
        top: 130, // Adjust based on the layout
        height: 32,
        marginLeft: 30,
      },
      onPress: handleNextStep,
    },
    {
      id: 4,
      target: "View-Customer",
      title: "View Customer",
      text: "View details of your customers here.",
      shape: "rectangle",
      tooltip: "Click here to view customer details.",
      style: {
        position: "absolute",
        width: "45%",
        top: 160,
        height: 32,
        marginLeft: 20,
      },
      onPress: handleNextStep,
    },
    {
      id: 5,
      target: "View-Invoices",
      title: "View Invoices",
      text: "Access and manage your invoices here.",
      shape: "rectangle",
      tooltip: "Click here to view your invoices.",
      style: {
        position: "absolute",
        width: "45%",
        top: 160,
        height: 32,
        marginLeft: 162,
      },
      onPress: handleNextStep,
    },
    // Add more steps as needed
  ];

