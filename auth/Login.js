import Loader from '../Components/Loader';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import API from '../utils/auth';
import { saveTokens } from '../utils/store';

import { useState } from 'react';
import {
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './style';

const LoginScreen = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('nilesh7art');
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();
  const handleLogin = async () => {
    if (!email) {
      showMessage({ message: 'Please Enter email No', type: 'danger' });
      return;
    }
    if (!password) {
      showMessage({ message: 'Please Enter Password', type: 'danger' });
      return;
    }
    setLoader(true);
    try {
      const response = await API.post('/login', { email, password });

      if (response.status === 200) {
        console.log(response);
        showMessage({ message: 'Login Successfull', type: 'success' });
        const { refreshToken, accessToken } = response.data;

        await saveTokens(accessToken, refreshToken);
      }

      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Tabs' }],
          }),
        );
      }, 2000);
      setLoader(false);
    } catch (error) {
      console.log(error.response.data.message);

      if (error.response.data.status === 400) {
        showMessage({ message: error.response.data.message, type: 'danger' });
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content"></StatusBar>
      {loader && (
        <Modal transparent={true}>
          <Loader />
        </Modal>
      )}

      <View style={styles.container}>
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.question}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.getStarted}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to continue your investments
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#00c6ff', '#0072ff']}
              style={styles.signInGradient}
            >
              <Text style={styles.signInText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.forgot}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* <Text style={styles.or}>Or sign in with</Text> */}

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => navigation.navigate('Signup')}
            >
              <FontAwesome6 name="user" size={15} color="#00c6ff" />
              <Text style={styles.socialText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
