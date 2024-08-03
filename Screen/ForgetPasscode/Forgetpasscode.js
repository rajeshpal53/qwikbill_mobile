import { functions } from "lodash";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  Provider as PaperProvider,
  Text,
  TextInput,
  Button,
  Card,
} from "react-native-paper";
import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../../Store/AuthContext";
import { createApi } from "../../Util/UtilApi";


function CustomerVerification({loginDetail1,setIsOtp,setOtpValue}){
    const [text,setText]=useState('');
    const genrateOTP=async()=>{
       
        const obj= {email:text}
        console.log(obj)
            if(text===loginDetail1.email){
               const response=await createApi("api/sendotp",obj,{'Content-Type': 'application/json',})
               setOtpValue(response.result)
               console.log(response.result)
                setIsOtp(true)
                
            }
    }   
    return( <View style={styles.scrollViewChild}>   
        <Card style={styles.card}>
            <Card.Content style={styles1.cardContent}>
            <View style={styles.myShopImageContainer}>
                <Image
                  source={require("../../assets/forgetpassword.jpeg")}
                  style={styles.myShopeImage}
                ></Image>
              </View>
              <Text variant="headlineMedium"  style={{ color: "black"  ,marginVertical:10}}>Customer Verification</Text>
              <Text variant="labelSmall"  style={{ color: "grey", textAlign:'center' ,marginVertical:15}}>we will send you one time pass word on this email{loginDetail1&&loginDetail1.email} address</Text>
              <TextInput
                 placeholder="Email Adress"
                 style={{width:"100%", marginVertical:15}}
                value={text}
                onChangeText={(newText) => setText(newText)}
                />
                <Button mode="contained"  style={{marginTop:20}} onPress={genrateOTP}> Genrate OTP</Button>
            </Card.Content>
            </Card>
            </View>)
}
function ValidateOTP({navigation,otpValue}){
    const [otp, setOtp] = useState('');
    const [counter, setCounter] = useState(30);

    useEffect(() => {
      if (counter > 0) {
        const timer = setTimeout(() => setCounter(counter - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [counter]);

    const handleVerifyOtp = () => {
        if(otpValue===otp){
          navigation.navigate("CreateNewPasscode")
          console.log('OTP entered:', otp);
        }else{
          Alert.alert("not a valid otp")
        }

       
    };
  
    const handleResendOtp = () => {
      // Resend OTP logic here
      setCounter(30); // Reset counter
    };
    return (
      <View style={styles.scrollViewChild}>
        <Card style={styles.card}>
        <Card.Content style={styles1.cardContent}>
        <View style={styles.myShopImageContainer}>
                <Image
                  source={require("../../assets/emailOTP.jpg")}
                  style={styles.myShopeImage}
                ></Image>
              </View>
            <Text variant="headlineMedium" style={{marginTop:15}} >OTP Verification</Text>
            <Text style={styles.instruction}>Please check your mobile inbox for OTP</Text>
            <TextInput
              style={{width:"100%", marginVertical:15}}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              
            />
            <Text style={styles.counter}>Your OTP will expire in {counter} sec(s)</Text>
            <Button onPress={handleResendOtp} disabled={counter > 0} labelStyle={styles.resendButton}>
              Didn't Receive The OTP? Resend OTP
            </Button>
            <Button mode="contained" onPress={handleVerifyOtp}>
              Verify OTP
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
};


function Forgetpasscode({navigation}) {
    const [isOtp,setIsOtp]=useState(false)
    const [loginDetail1,setLoginDetail1]=useState(loginDetail)
    const {loginDetail,getData}=useContext(AuthContext)
    const [finalScreen,setFinalScreen]=useState(false)
    const[otpValue,setOtpValue]= useState()
    useEffect(() => {
        async function loginDetailHandler() {
          try {
            const newValue = (await getData("loginDetail")) || "";
    
            setLoginDetail1(newValue);
          } catch {
            console.log("failed get data ");
          } finally {
            // setNewLoading(false);
          }
        }
    
        loginDetailHandler();
      }, [loginDetail]);
      console.log(loginDetail1)
  return (
    <>
      <StatusBar style="light" backgroundColor={"#0c3b73"} />
      <SafeAreaView style={styles.SafeAreaView}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles1.overlay}></View>
          <View style={styles.scrollViewChild}>
            <View
              style={{
                // flex:1,
                // backgroundColor:"white",
                height: "25%",
                width: "100%",
                alignItems: "center",
               marginBottom:12
              }}  
            >
              <View>
                <Image
                  source={require("../../assets/logo-wertone.png")}
                  style={styles.img}
                />
              </View>
              <View
                style={{
                  // backgroundColor:"pink",
                  alignItems: "center",
                }}
              >
                <Text variant="titleLarge" style={{ color: "white" }}>
                  WERTONE
                </Text>
                <Text style={{ color: "white", letterSpacing: 3 }}>
                  Biling Software
                </Text>
              </View> 
            </View>
               {isOtp?(<ValidateOTP navigation={navigation} otpValue={otpValue} />):(<CustomerVerification loginDetail1={loginDetail1} setIsOtp={setIsOtp} setOtpValue={setOtpValue}/>)}
          </View>
          
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0, // Adjust the top value as needed
    // left: 0,
    // right:0,
    // transform: [{ translateX: -75 }, { translateY: -75 }], // Center the overlay
    width: "100%",
    // height: 250,
    height: "45%",
    backgroundColor: "#0c3b73",
    zIndex: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  overlayText: {
    color: "white",
    fontSize: 16,
  },
  cardContent: {
    // backgroundColor: "red",
    paddingTop: 0,
    display: "flex",
    alignItems: "center",
  
   
    // height: "100%",
    flex: 1,
  },
});
const styles = StyleSheet.create({
  card: {
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    
    // backgroundColor: "yellow",
    borderRadius: 0,
  },
  instruction: {
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  counter: {
    fontSize: 16,
    color: 'darkblue',
    textAlign: 'center',
    marginBottom: 16,
  },  resendButton: {
    color: 'grey',
    textAlign: 'center',
    marginBottom: 16,
  },
  img: {
    height: 100,
    width: 100,
    elevation: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  tooltip: {
    backgroundColor: "white",
    borderColor: "lightblue",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  SafeAreaView: {
    flex: 1,
    // position:"absolute",
    // backgroundColor: "pink",
    // minHeight:"100vh",
    // width:"50%",
    // height:,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  myShopeImage: {
    width: "100%",
    height: "100%",
  },
  myShopImageContainer: { width: "30%", height: "20%", marginVertical: 5 },
  scrollViewChild: {
    // backgroundColor: "grey",
    // height: "100%",
    // height:"200px",
    height: 705,
    // display: "flex",
    // flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal:12,
width:"100%",

  },
  scrollViewStyle: {
    // backgroundColor:"blue",
    display: "flex",
    width: "100%",
    height: "100%",

    tooltipContent: {
      backgroundColor: "white",
      borderColor: "lightblue",
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
    },
    tooltipText: {
      color: "#6dbbc7",
    },
    // flex:1
  },
});

export default Forgetpasscode;
