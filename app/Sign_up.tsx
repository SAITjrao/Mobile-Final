import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { signUp, signIn, signOut } from '../lib/supabase_auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { replace } from 'expo-router/build/global-state/routing';

export default function Sign_up(){
    const [firstName, setfirstName] = useState<string>("");
    const [lastName, setlastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    //check if valid email
    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    //validate all fields are entered before signing up user
    const handleSignUp = async () => {
        let isValid = true;

        if (!email || !validateEmail(email)) {
            alert("Please enter a valid email");
            isValid = false;
        }

        if (!firstName || firstName.length < 3) {
            alert("Please enter a first name that is longer than 3 characters");
            isValid = false;
        } else if (!lastName || lastName.length < 3) {
            alert("Please enter a last name that is longer than 3 characters");
            isValid = false;
        }

        if (!password || password.length < 6) {
            alert("Please enter a password that is 6 or more characters")
            isValid = false;
        }

        if (isValid) {
            try {
                const user = await signUp(email, password, firstName, lastName);
                alert("Thank you for signing up. Please check your email for the verification link.")
                console.log("user", user);
                router.replace('/') //confirm routing structure
            } catch (error) {
                console.error("Error signing up:", error);
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setfirstName}
                placeholder="First Name"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setlastName}
                placeholder="Last Name"
                autoCapitalize="none"
            />
            
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

            <Text>Already have an account?</Text>
            <Pressable onPress={() => {router.replace('/')}} style={styles.pressable}>
                <Text style={styles.button}>Sign In</Text>
            </Pressable>
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
        header: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 16,
        }
    });