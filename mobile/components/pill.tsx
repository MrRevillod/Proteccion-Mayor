import { View } from "react-native"
import AppText from "./appText"
import Colors from "./colors"

const Pill = ({ text, align }: { text: string, align?: any }) => {
    return (
        <View style={{
            display: "flex",
            alignItems: align || "center",
            borderColor: Colors.green,
            borderWidth: 1,
            borderRadius: 10,
            padding: 5,


        }}>
            <AppText style={{ textAlign: "center" }}>{text}</AppText>
        </View>
    )
}



export default Pill