import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  ActivityIndicator,
  Icon,
} from "react-native-paper";
import { AuthContext } from "../Store/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import { createApi } from "../Util/UtilApi";
function ProfileSetting({ navigation }) {
  const { loginDetail, getData, isLoading, isAuthenticated, logout } =
    useContext(AuthContext);
  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const [newLoading, setNewLoading] = useState(true);
  const isFocused = useIsFocused();
  const logoutHandler = async() => {
    try{
      navigation.navigate("StackNavigator", { screen: "login" });
      const response= await createApi("api/logout",{
        "Content-Type": "application/json",
      } )
      console.log(response)
      logout();
      if (isLoading) {
        return (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        );
      }
      if (!isAuthenticated||response.success) {
        navigation.navigate("StackNavigator", { screen: "login" });
      }
    }catch(err){
      console.error("failed to logout",err)
    }
   
  };
  useEffect(() => {
    async function loginDetailHandler() {
      try {
        const newValue = (await getData("loginDetail")) || "";

        setLoginDetail1(newValue);
      } catch {
        console.log("failed get data ");
      } finally {
        setNewLoading(false);
      }
    }

    loginDetailHandler();
  }, [isFocused, loginDetail]);
  const login = loginDetail1;
  if (newLoading) {
    return <ActivityIndicator size="large" />;
  }
  const editProfileHandler=()=>{
    navigation.navigate("editProfile",{login:login})
  }
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View>
        <Avatar.Text
          size={100}
          label={login.name?.charAt(0)}
          style={styles.avatar}
        />
   

        </View>
      
        <Card.Content style={{ alignSelf: "center",margin:20}}>
          <Title
            style={styles.titleStyle}
          >{`${login.name} ${login.surname}`}</Title>
          {/* <Paragraph style={styles.paragraph}>ID: {login._id}</Paragraph> */}
          <Paragraph style={styles.paragraph}>First Name: {login.name}</Paragraph>
          <Paragraph style={styles.paragraph}>
            Surname: {login.surname}
          </Paragraph>
          <Paragraph style={styles.paragraph}>Email: {login.email}</Paragraph>
          <Paragraph style={styles.paragraph}>Role: {login.role}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button icon="pencil" mode="contained" buttonColor="#26a0df" labelStyle={styles.buttonText} onPress={editProfileHandler}>
            Edit
          </Button>
          <Button
       icon={() => <Icon name="log-out-outline" size={20} color="white" />}
        buttonColor="#26a0df"
        onPress={logoutHandler}
        mode="contained"
        labelStyle={styles.buttonText}
       
      >
        LogOut
      </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingHorizontal:10
  },
  buttonText: {
    color: "white",
  },
  card: {
    width: "100%",
    height:"100%",
    color: "#fff",
    
    justifyContent:"center"
  },
  logout:{ alignSelf: "flex-end", marginBottom: 10, backgroundColor:"#0c3b73"},
  paragraph: {
    marginVertical: 10,
    fontSize:15,
    paddingVertical:5
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize:25,
    marginBottom: 10,
    alignSelf: "center",
  },
  iconButton: {
    backgroundColor: "#fff",
  },
  iconButton2: {
    backgroundColor: "#fff",
  },
  avatar: {
    justifySelf: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
});

export default ProfileSetting;
