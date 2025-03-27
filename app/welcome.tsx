import { View, Text, Pressable, StyleSheet } from "react-native"
import { signOut } from "../lib/supabase_auth"
import { useLocalSearchParams, useRouter } from "expo-router";


export default function Welcome() {
  const { userEmail } = useLocalSearchParams();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <View>
      <Text>Welcome, {userEmail}!</Text>
      <Pressable onPress={handleSignOut} style={styles.pressable}>
        <Text style={styles.button}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    pressable: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 10, 
    },
    button: {
        padding: 10,
        backgroundColor: "green",
        color: "white",
        width: 100,
        textAlign: "center",
        margin: 10,
        borderRadius: 5,
    },
})