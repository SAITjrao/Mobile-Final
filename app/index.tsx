import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { signUp, signIn, signOut } from '../lib/supabase_auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function App() {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            router.replace('/welcome');
        }
    }, [isSignedIn]);

    const handleSignUp = async () => {
        try {
            const user = await signUp(email, password);
            console.log("user", user);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    }

    const handleSignIn = async () => {
        try {
          const user = await signIn(email, password);
          if(user) {
            setIsSignedIn(true);
            router.push({
                pathname: "/welcome",
                params: { 
                  userEmail: user.email,       
                }
              });
          }
        } catch (error) {
          console.error("Error signing in:", error);
        }
    }
    
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            
            <Pressable onPress={handleSignUp} style={styles.pressable}>
                <Text style={styles.button}>Sign Up</Text>
            </Pressable>
            <Pressable onPress={handleSignIn} style={styles.pressable}>
                <Text style={styles.button}>Sign In</Text>
            </Pressable>
            
            {isSignedIn && <Text style={styles.status}>You are signed in!</Text>}
        </View>  
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
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
  status: {
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
  },
});