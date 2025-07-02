import React, {useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

const PoliciesDetailsScreen = ({navigation}) => {

    const { webUri, headerTitle } = useRoute().params;

    useEffect(() => {
      navigation.setOptions({
        title: headerTitle, // Set the dynamic header title
      });
    }, [navigation, headerTitle]); // Dependencies for useEffect
  
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri:  `${webUri}`}} // Replace with your desired URL
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PoliciesDetailsScreen;