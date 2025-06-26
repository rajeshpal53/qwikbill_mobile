// hooks/usePhoneOtp.js
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { showSnackbar } from "../Util/UtilApi"; // Adjust path

export function usePhoneOtp() {
  const [confirm, setConfirm] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (phoneNumber) => {
    try {
      setIsLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      showSnackbar("OTP Sent! Check your messages.", "success");
      return true;
    } catch (error) {
      showSnackbar(`OTP send failed: ${error.message}`, "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOtp = async (otp, onSuccess, onFailure) => {
    try {
      if (confirm) {
        const userCredential = await confirm.confirm(otp);
        const token = await userCredential.user.getIdToken();
        setIdToken(token);
        onSuccess && onSuccess(userCredential.user, token);
      } else {
        throw new Error("No OTP confirmation object found.");
      }
    } catch (error) {
      showSnackbar(`Invalid OTP: ${error.message}`, "error");
      onFailure && onFailure(error);
    }
  };

  return {
    sendOtp,
    confirmOtp,
    isLoading,
    confirm,
    idToken,
  };
}
