import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const LocalAuthScreen = ({navigation}) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible);
      setIsEnrolled(enrolled);
    })();
  }, []);

  const handleLocalAuthentication = async () => {
    if (!isEnrolled) {
      Alert.alert(
        'Authentication Error',
        'No biometric records found. Please set up biometric authentication on your device.'
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Enter Passcode',
    });

    if (result.success) {
      Alert.alert('Authenticated', 'You have successfully authenticated');
      navigation.navigate("wertone")
    } else {
      Alert.alert('Authentication Failed', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Authentication Example</Text>
      {isBiometricSupported ? (
        <Button title="Authenticate" onPress={handleLocalAuthentication} />
      ) : (
        <Text>Biometric authentication is not supported on this device</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default LocalAuthScreen;
