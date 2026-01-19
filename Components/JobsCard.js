import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { createTable, insertData } from '../db/model';
const { width } = Dimensions.get('window');

const JobsCard = ({ items }) => {
  const navigation = useNavigation();
  const [bookmark, setBookmark] = useState(false);
  const handleBookmark = async details => {
    setBookmark(prev => !prev);
    await createTable();
    await insertData(details);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Description', { details: items })}
    >
      <View style={styles.cardHeader}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[styles.title, { maxWidth: '90%' }]}>{items.title}</Text>
          <TouchableOpacity onPress={() => handleBookmark(items)}>
            <Ionicons
              name={`${bookmark ? 'bookmark-sharp' : 'bookmark-outline'}`}
              color="black"
              size={20}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <Text style={styles.company}>{items.companyName}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.location}>📍 {items.location}</Text>
        <Text style={styles.roleType}>{items.jobType || 'Full-Time'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default JobsCard;

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
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: width * 0.9,
    alignSelf: 'center',
  },
  cardHeader: {
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#111827',
  },
  company: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
  },
  roleType: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#10b981',
  },
  logo: { marginTop: 10 },
  logoText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#0672d6',
  },
});
