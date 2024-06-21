import { Text } from "react-native-paper"
function CustomerDetail({detail}) {
    console.log(detail)
  return (
   <Text variant="displayMedium">{detail._id}</Text>
  )
}

export default CustomerDetail
