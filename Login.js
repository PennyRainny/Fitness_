import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';
import { Database } from '../Database';
import { hashPassword } from '../hashPassword'; 




function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 


  
//เพิ่มฟังค์ชั่นสำหรับ Login ใช้ฐานข้อมูล Supabase
const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password');
    return;
  }

  setLoading(true);

  try {
    // 1. ดึง user จาก table userinfo
    const { data: users, error: queryError } = await Database
      .from('userinfo')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (queryError) throw queryError;

    const user = users?.[0];

    if (!user) {
      Alert.alert('Login Failed', 'User not found');
      return;
    }

    // 2. ตรวจสอบรหัสผ่าน (hash password ที่กรอกแล้วเปรียบเทียบกับ hash ในฐานข้อมูล)
    const hashedInputPassword = await hashPassword(password);  // ใช้ hashPassword ที่เราสร้างไว้
    const passwordMatch = hashedInputPassword === user.passwordhash;  // เปรียบเทียบ hash

    if (!passwordMatch) {
      Alert.alert('Login Failed', 'Invalid password');
      return;
    }

    // ✅ เข้าระบบสำเร็จ
    Alert.alert('Success', 'Logged in successfully!');
    navigation.navigate('CreateProfile', { email });
  } catch (error) {
    console.error('Login Error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again later.');
  } finally {
    setLoading(false);
  }
};
  //===================================================================================

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

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

      <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Reset password link sent!')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <LinearGradient
        colors={['#92A3FD', '#9DCEFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonContainer}
      >
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
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

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
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
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#92A3FD',
    marginBottom: 20,
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
  signupText: {
    marginTop: 20,
    color: '#92A3FD',
  },
});

export default LoginScreen;
