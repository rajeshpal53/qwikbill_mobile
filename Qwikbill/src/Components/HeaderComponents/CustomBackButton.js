import { Ionicons } from '@expo/vector-icons'; // or any other icon library
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
//import * as ScreenOrientation from "expo-screen-orientation"

const CustomBackButton = ({isLandscape, setIsLandscape}) => {
  const navigation = useNavigation();

  const goBack = () => {

   
   
  }

  const handleRotate = async () => {
    if (isLandscape) {
        setIsLandscape(false);
      //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Lock to portrait
    }
    navigation.goBack();
  };
  
  
  return (
    <TouchableOpacity onPress={() => handleRotate()} style={{ padding: 10 }}>
      {/* Replace with your custom icon or text */}
      <Ionicons name="arrow-back" size={24} color="#fff" />
      {/* <Text>Back</Text>  // Example if you want to use text instead */}
    </TouchableOpacity>
  );
};

export default CustomBackButton;