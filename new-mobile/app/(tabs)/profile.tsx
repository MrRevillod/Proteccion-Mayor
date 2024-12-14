import axios from "axios"
import ProfileInfo from "@/components/ProfileInfo"

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { SENIOR_IMAGE_BASE_URL, DEFAULT_PROFILE_PICTURE } from "@/lib/http"

const ProfileTab = () => {
    const { user } = useAuth()
    const [imageUri, setImageUri] = useState(DEFAULT_PROFILE_PICTURE)

    useEffect(() => {
        const profileImageUri = `${SENIOR_IMAGE_BASE_URL}/users/${user.id}/profile.webp`

        async function fetchImage() {
            try {
                await axios.get(profileImageUri)
                setImageUri(profileImageUri)
            } catch (error) {
                await axios.get(DEFAULT_PROFILE_PICTURE)
                setImageUri(DEFAULT_PROFILE_PICTURE)
            }
        }

        fetchImage()
    }, [])

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.dataContainer}>
                <Text style={styles.title}>{user.name}</Text>
                <ProfileInfo iconName="phone" title="Teléfono" data={"+569128983283"} />
                <ProfileInfo iconName="envelope" title="Correo" data={user.email} />
                <ProfileInfo iconName="map-marker" title="Dirección" data={user.address} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        margin: 15,
        borderRadius: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: -115,
        zIndex: 1,
    },
    dataContainer: {
        flex: 1,
        marginTop: 25,
        alignItems: "center",
        gap: 25,
        width: "80%",
    },
})

export default ProfileTab
