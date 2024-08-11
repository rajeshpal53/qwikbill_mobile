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
function ProfileSetting({ navigation }) {
  const { loginDetail, getData, isLoading, isAuthenticated, logout } =
    useContext(AuthContext);
  const [loginDetail1, setLoginDetail1] = useState(loginDetail);
  const [newLoading, setNewLoading] = useState(true);
  const isFocused = useIsFocused();
  const logoutHandler = () => {
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
    if (!isAuthenticated) {
      navigation.navigate("StackNavigator", { screen: "login" });
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
  return (
    <View style={styles.container}>
      <Button
       icon={() => <Icon name="log-out-outline" size={20} color="white" />}
        onPress={logoutHandler}
        mode="contained"
        style={styles.logout}
       
      >
        LogOut
      </Button>
      <Card style={styles.card}>
        <Avatar.Image
          size={100}
          source={require("../assets/profile.png")}
          style={styles.avatar}
        />
        <Card.Content style={{ alignSelf: "center" }}>
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
          <Button icon="pencil" mode="contained" labelStyle={styles.buttonText}>
            Edit
          </Button>
          <Button
            icon="lock"
            mode="contained"
            color="blue"
            labelStyle={styles.buttonText}
          >
            Update Password
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
    color: "#fff",
  },
  logout:{ alignSelf: "flex-end", marginBottom: 10, backgroundColor:"#0c3b73"},
  paragraph: {
    marginVertical: 10,
  },
  titleStyle: {
    fontWeight: "bold",
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
