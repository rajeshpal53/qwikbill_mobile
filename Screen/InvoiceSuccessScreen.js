
import { Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
export default function InvoiceSuccessScreen(){

    const route = useRoute();


    return (
        <>
            <Text>{route.params.paymentMode}</Text>
        </>
    );
};