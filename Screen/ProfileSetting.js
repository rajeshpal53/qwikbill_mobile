
import { useContext } from 'react';
import { StyleSheet,View } from 'react-native';
import { Card, Title, Paragraph,Button,Avatar } from 'react-native-paper';
import { AuthContext } from '../Store/AuthContext';
function ProfileSetting() {
    const{loginDetail}=useContext(AuthContext)
  return (
    <View style={styles.container}>
    <Card style={styles.card}>
    <Avatar.Image 
          size={100} 
          source={require("../assets/profile.png")} 
          style={styles.avatar}
        />
        <Card.Content style={{alignSelf:'center'}}>
          <Title style={styles.titleStyle}>{`${loginDetail.name} ${loginDetail.surname}`}</Title>
          <Paragraph style={styles.paragraph}>ID: {loginDetail._id}</Paragraph>
          <Paragraph style={styles.paragraph}>Name: {loginDetail.name}</Paragraph>
          <Paragraph style={styles.paragraph}>Surname: {loginDetail.surname}</Paragraph>
          <Paragraph style={styles.paragraph}>Email: {loginDetail.email}</Paragraph>
          <Paragraph style={styles.paragraph}>Role: {loginDetail.role}</Paragraph>
        </Card.Content>
        <Card.Actions>
        <Button
          icon="pencil"
          mode="contained"
        
          labelStyle={styles.buttonText}
        >
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
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,


  },
  buttonText: {
    color: 'white',
  },
  card: {
    width: '100%',
    color:"#fff"
  },
  paragraph:{
    marginVertical:10,
 
  },
  titleStyle:{
 
    fontWeight: "bold",
    marginBottom:10,
    alignSelf:"center"
  },
  iconButton: {
    backgroundColor: '#fff',
  },
  iconButton2:{
    backgroundColor:"#fff"
  },
  avatar:{
    justifySelf:"center",
    alignSelf:'center',
    marginVertical:10
  }
});

export default ProfileSetting
