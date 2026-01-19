import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchBookmarks } from '../db/model';
import BookMarks from '../Components/BookMarks';

const SavedJobs = () => {
  const [bookmark, setBookmark] = useState([]);
  const [isRefetching, setRefetching] = useState(false);

  const handlefetch = async () => {
    const data = await fetchBookmarks();
    setBookmark(data);
  };

  useEffect(() => {
    handlefetch();
  }, [isRefetching]);

  const onRefresh = useCallback(async () => {
    try {
      setRefetching(true);
      await handlefetch();
    } catch (error) {
      console.log(error);
    } finally {
      setRefetching(false);
    }
  }, [handlefetch, isRefetching]);
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>BookMarks</Text>
      </View>

      <FlatList
        data={bookmark}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <BookMarks items={item} setRefetching={setRefetching} />
        )}
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
    </SafeAreaView>
  );
};

export default SavedJobs;

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
