import { Text, TouchableOpacity, View } from "react-native";
import SetpasswordModal from "../../Modal/SetpasswordModal";
import { useState } from "react";

const SetPasswordSreen = ({navigation}) => {
  const [visible, setVisible] = useState(false);

  const HandalsetPasswordModal = () => {
    setVisible((prevState) => !prevState);
  };
  return (
    <View style = {{flex:1}}>
      <TouchableOpacity onPress={HandalsetPasswordModal}>
        <Text>Set Password</Text>
      </TouchableOpacity>
      {visible && (
        <SetpasswordModal visible={visible} HandalsetPasswordModal={HandalsetPasswordModal} navigation = {navigation}  />
      )}
    </View>
  );
};

export default SetPasswordSreen;
