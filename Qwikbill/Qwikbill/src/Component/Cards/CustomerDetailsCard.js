
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { API_BASE_URL, fontFamily, fontSize } from "../../Util/UtilApi";

const CustomerDetailsCard = ({ item, setCustomerData }) => {
  const navigation = useNavigation();
  const profilePicUrl = item.profilePicurl
    ? `${API_BASE_URL}${item.profilePicurl}`
    : null;

  console.log("profile pic url isss ,", profilePicUrl);

  const displayName = item?.user?.name ? item?.user?.name.trim() : "Unknown";
  const firstLetter = displayName.charAt(0).toUpperCase(); // Ensure it's uppercase

  return (
    <View>
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate("CustomerDetails", {
            item,
            setCustomerData:{setCustomerData}
          })
        }
      >
        <Card.Title
          title={displayName}
          subtitle={item?.user?.mobile || "No Mobile"}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
          left={() =>
            profilePicUrl ? (
              <Avatar.Image
                size={50}
                source={{ uri: profilePicUrl }}
                style={styles.avatar}
              />
            ) : (
              <Avatar.Text
                size={55}
                label={firstLetter}
                style={styles.avatarPlaceholder}
              />
            )
          }
          right={() => (
            // <TouchableOpacity onPress={() => onEdit(item)} style={styles.editIcon}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#1E88E5"
            />
            // </TouchableOpacity>
          )}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 10,
    // paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#fff",
  },
  avatar: {
    backgroundColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
  },
  editIcon: {
    marginRight: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: fontSize.labelLarge,
    marginLeft: 10,
    fontFamily: fontFamily.regular,
  },
  subtitle: {
    fontSize: fontSize.labelMedium,
    color: "rgba(0, 0, 0, 0.6)",
    marginLeft: 10,
    fontFamily: fontFamily.regular,
  },
});

export default CustomerDetailsCard;