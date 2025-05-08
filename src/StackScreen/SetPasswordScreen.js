import { Text, TouchableOpacity, View } from "react-native";

import { useState } from "react";
import SetpasswordModal from "../Components/Modal/SetpasswordModal";

const SetPasswordSreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const HandalsetPasswordModal = () => {
    setVisible((prevState) => !prevState);
    console("hello friends !")
    alert("hello everyone")
  };


  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={HandalsetPasswordModal}>
        <Text>Set Password</Text>
      </TouchableOpacity>

      {visible && (
        <SetpasswordModal
          visible={visible}
          closeModal={HandalsetPasswordModal}
          navigation={navigation}
      

        />
      )}
    </View>
  );
};

export default SetPasswordSreen;
