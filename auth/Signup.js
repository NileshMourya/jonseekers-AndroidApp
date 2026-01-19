import Loader from '../Components/Loader';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';

import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './style';

const SignupScreen = () => {
  const [email, setEmail] = useState('pool@gmail.com');
  const [password, setPassword] = useState('nilesh7art');
  const [name, setName] = useState('nil');
  const [role, setRole] = useState('jobseeker');
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();
  const handleSignup = async () => {
    if (!email) {
      showMessage({ message: 'Please Enter email No', type: 'danger' });
      return;
    }
    if (!password) {
      showMessage({ message: 'Please Enter Password', type: 'danger' });
      return;
    }
    setLoader(true);
    const payload = {
      email,
      password,
      role,
      name,
    };
    try {
      const response = await axios.post(
        'http://192.168.1.5:8000/api/signup',
        payload,
      );

      if (response.status === 200) {
        console.log(response);
        showMessage({ message: 'Signup Successfull', type: 'success' });
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Login' }],
            }),
          );
        }, 2000);
      }
    } catch (error) {
      console.log('error', error.response);
    } finally {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content"></StatusBar>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>name</Text>
              <TextInput
                placeholder="Enter name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                keyboardType="default"
              />
            </View>

            <View
              style={{
                zIndex: 99,
                marginBottom: 15,
              }}
            >
              <Text style={styles.label}>Role</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={role}
                  onValueChange={itemValue => setRole(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item
                    label="Jobseeker"
                    value="jobseeker"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item label="Recruiter" value="recruiter" />
                  <Picker.Item label="Employee" value="employee" />
                  <Picker.Item label="admin" value="admin" />
                </Picker>
              </View>
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
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <Text style={styles.or}>Or sign in with</Text> */}

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignup}
            >
              <LinearGradient
                colors={['#00c6ff', '#0072ff']}
                style={styles.signInGradient}
              >
                <Text style={styles.signInText}>Signup</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgot}>Already have account?</Text>
            </TouchableOpacity>

            {/* <Text style={styles.or}>Or sign in with</Text> */}

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => navigation.navigate('Login')}
              >
                <FontAwesome6 name="user" size={15} color="#00c6ff" />
                <Text style={styles.socialText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
