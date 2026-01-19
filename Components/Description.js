import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const Description = () => {
  const { details } = useRoute().params;
  console.log(details);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{details.title}</Text>
          <View style={styles.textContainer}>
            <Ionicons
              name="business-outline"
              color="#6b7280"
              size={20}
            ></Ionicons>
            <Text style={styles.company}>{details.companyName}</Text>
          </View>
          <View style={styles.textContainer}>
            <Ionicons
              name="location-outline"
              color="#6b7280"
              size={20}
            ></Ionicons>
            <Text style={styles.location}>{details.location}</Text>
          </View>
          <View style={styles.line}></View>

          <View style={styles.skillContainer}>
            <Text style={styles.header}>Profile Insights</Text>
            <Text style={styles.profile}>
              Here's how your jobs related to your profile
            </Text>

            <View style={styles.textContainer}>
              <Ionicons name="bulb-sharp" color="#6b7280" size={20}></Ionicons>
              <Text style={[styles.header, { marginTop: 5 }]}>Skills</Text>
            </View>
            <View style={styles.skills}>
              {details?.skills?.map((skill, id) => (
                <View key={id} style={styles.skillsTextContainer}>
                  <Text style={styles.skillsText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.jobDetails}>
            <Text style={styles.header}>Job Details</Text>
            <Text style={styles.profile}>
              Here's how your jobs details align with your profile
            </Text>
            <View>
              <View style={styles.textContainer}>
                <Ionicons
                  name="cash-outline"
                  color="#6b7280"
                  size={20}
                ></Ionicons>
                <Text style={[styles.header, { marginTop: 5, fontSize: 16 }]}>
                  Pay
                </Text>
              </View>
              <View style={styles.jdContainer}>
                <Text style={styles.jdText}>100000</Text>
              </View>
            </View>
            <View style={styles.textContainer}>
              <Ionicons
                name="bag-handle-outline"
                color="#6b7280"
                size={20}
              ></Ionicons>
              <Text style={[styles.header, { marginTop: 5, fontSize: 16 }]}>
                Job Type
              </Text>
            </View>
            <View style={styles.jdContainer}>
              <Text style={styles.jdText}>full Time</Text>
            </View>
          </View>
          <View style={[styles.line, { elevation: 1.5, marginTop: 10 }]}></View>

          <View style={styles.description}>
            <Text style={styles.header}>Job Description</Text>
            <Text style={styles.descriptionText}>{details.decription}</Text>
          </View>
          <View style={styles.description}>
            <Text style={styles.header}>Role & Responsibility</Text>
            <Text style={styles.descriptionText}>
              {details.roleResponsibility}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Description;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  container: {
    padding: 10,
    marginTop: 10,
  },
  company: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
  },

  location: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 5,
    marginVertical: 5,
  },
  line: {
    backgroundColor: 'white',
    height: 2,
    elevation: 3,
    marginVertical: 5,
  },
  skillContainer: {
    marginTop: 10,
  },
  header: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  profile: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6b7280',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 10,
  },
  skillsText: {
    color: 'white',
  },
  skillsTextContainer: {
    backgroundColor: '#0672d6',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    marginVertical: 5,
  },
  jobDetails: {
    marginTop: 15,
  },
  jdContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    maxWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    elevation: 1,
  },
  jdText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'gray',
  },
  description: {
    padding: 5,
  },
  descriptionText: {
    fontFamily: 'Poppins-Regular',
    color: 'gray',
  },
});
