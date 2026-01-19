import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  TextInput,
} from 'react-native';
import { fetchJobs, getTokens } from '../utils/store';
import { CommonActions, useNavigation } from '@react-navigation/native';
import API from '../utils/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobsCard from '../Components/JobsCard';

const Home = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isRefetching, setRefetching] = useState(false);

  const navigation = useNavigation();

  const loadProtectedData = async () => {
    try {
      setLoader(true);
      const token = await getTokens();

      // ✅ Check if token exists first
      if (!token || !token.accessToken || !token.refreshToken) {
        console.log('Token missing or invalid — redirecting to Login');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        );
        return;
      }

      // ✅ Try calling API with accessToken
      let response = await API.get('/getJobs', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      });

      setData(response.data);
    } catch (error) {
      console.log(
        'Error fetching jobs:',
        error?.response?.status || error.message,
      );

      // 🧩 Handle expired access token
      if (error?.response?.status === 401) {
        console.log('Access token expired. Trying refresh...');

        try {
          // ✅ Try refresh token
          const refreshResponse = await API.post(
            '/refresh-token',
            {},
            {
              headers: { Authorization: `Bearer ${token.refreshToken}` },
            },
          );

          console.log('invoking new access token', refreshResponse);
          const newAccessToken = refreshResponse.data?.accessToken;
          if (newAccessToken) {
            console.log('Access token refreshed successfully ✅');

            // 🗂️ Optionally save new accessToken (depends on your getTokens/setTokens system)
            await storeTokens({
              ...token,
              accessToken: newAccessToken,
            });

            // 🔁 Retry the original request
            const retryResponse = await API.get('/getJobs', {
              headers: { Authorization: `Bearer ${token.accessToken}` },
            });

            setData(retryResponse.data);
            return;
          }
        } catch (refreshError) {
          console.log('Refresh token failed ❌:', refreshError.message);

          // 🔐 Redirect to login only if refresh fails
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            }),
          );
        }
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    loadProtectedData();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefetching(true);
      await loadProtectedData();
    } catch (error) {
      console.log(error);
    } finally {
      setRefetching(false);
    }
  }, [loadProtectedData]);
  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="green" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f9fafb" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>Jobseekers</Text>
        </View>
        <View style={styles.searchBoxs}>
          <TextInput
            placeholder="Job title, keyword, company"
            style={styles.input}
          />
          <TextInput placeholder="Location" style={styles.input} />
        </View>
        <Text style={styles.header}>Jobs for you</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <JobsCard items={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor="blue"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },

  logo: { marginTop: 10 },
  logoText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#0672d6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginVertical: 5,
    elevation: 1,
    backgroundColor: 'white',
  },
  searchBoxs: {
    marginTop: 5,
  },
});
