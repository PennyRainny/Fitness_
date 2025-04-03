import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';

function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
        Alert.alert('Error', 'All fields are required!');
        return;
    }

    try {
        const response = await fetch('http://10.0.2.2:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        const result = await response.json();
        console.log('Server Response:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        Alert.alert('Success', 'Registration successful!');
    } catch (error) {
        console.error(' Register Error:', error);
        Alert.alert('Error', error.message);
    }
};

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login ');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hey there,</Text>
      <Text style={styles.title}>Create an Account</Text>
      <View style={styles.inputContainer}>
        <Feather name="user" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#000"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Feather name="user" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#000"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Feather name="mail" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Feather name="lock" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
          {isChecked && <View style={styles.checkedCircle} />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          By continuing you accept our Privacy Policy and Terms of Use
        </Text>
      </View>

      <LinearGradient
        colors={['#92A3FD', '#9DCEFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonContainer}
      >
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text style={styles.orText}>or</Text>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialCircle} onPress={handleGoogleLogin}>
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialCircle} onPress={handleFacebookLogin}>
          <FontAwesome name="facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 18,
    color: '#000',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 20,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  buttonContainer: {
    borderRadius: 50,
    padding: 5,
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  socialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 10, // ปรับขนาดตัวอักษร
    color: '#000',
    marginLeft: 10,
  },
  checkedCircle: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: '#000',
  },
});

export default SignUpScreen;