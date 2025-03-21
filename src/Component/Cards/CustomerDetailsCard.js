// import React, { useState } from "react";
// import { StyleSheet, Text, TouchableOpacity } from "react-native";
// import { Card, Avatar } from "react-native-paper";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { fontSize } from "../../Util/UtilApi";

// const CustomerDetailsCard = ({ item, onEdit }) => {
//   const [Opendetails, setOpendetails] = useState(false);
//   const navigation = useNavigation();

//   return (
//     <Card
//       style={styles.card}
//       onPress={() => navigation.navigate("CustomerDetails", { item: item })}
//     >
//       <Card.Title
//         title={item.name}
//         subtitle={item.mobile}
//         titleStyle={styles.title}
//         subtitleStyle={styles.subtitle}
//         left={(props) =>
//           item.profilePicurl ? (
//             <Avatar.Image size={50} source={{ uri: item.profilePicurl }} style={styles.avatar} />
//           ) : (
//             <Avatar.Text size={50} label={item.name ? item.name.charAt(0) : "?"} style={styles.avatarPlaceholder} />
//           )
//         }
//         right={(props) => (
//           <TouchableOpacity
//             onPress={() => onEdit("Edit button pressed", item)}
//             style={styles.editIcon}
//           >
//             <Text>
//               <MaterialIcons name={"edit"} size={24} color={"#1E88E5"} />
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </Card>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     marginVertical: 5,
//     marginHorizontal: 10,
//     paddingVertical: 15,
//     borderRadius: 8,
//     elevation: 3,
//   },
//   avatar: {
//     backgroundColor: "#fff",
//   },
//   avatarPlaceholder: {
//     backgroundColor: "#ccc",
//   },
//   editIcon: {
//     marginRight: 10, // Adds spacing from the edge
//   },
//   title: {
//     fontFamily: "Poppins-Medium",
//     fontSize: fontSize.headingSmall,
//   },
//   subtitle: {
//     fontFamily: "Poppins-Medium",
//     fontSize: fontSize.labelMedium,
//     color: "rgba(0, 0, 0, 0.6)"

//   }
// });

// export default CustomerDetailsCard;

import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fontFamily, fontSize } from "../../Util/UtilApi";
import { API_BASE_URL } from "../../Util/UtilApi";

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