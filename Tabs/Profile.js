import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useProfile } from '../Store/userContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfile from '../Components/EditProfile';
import { pick, types } from '@react-native-documents/picker';
import { showMessage } from 'react-native-flash-message';
import API from '../utils/auth';
const { width } = Dimensions.get('window');

const ProfileSection = () => {
  const { profile, isEdit, setEdit, handleLogout } = useProfile();
  const { bio, location, skills, socialLinks, username } = profile;
  const [resumeData, setresumeData] = useState('');
  const pickAndConvertFile = async () => {
    try {
      // 1️⃣ Pick a single file
      const result = await pick({
        type: [types.allFiles], // pick any file type
      });

      // result is an array, take the first file
      const file = result[0];

      if (!file) {
        Alert.alert('No file selected');
        return;
      }

      // 2️⃣ Get file path

      if (file.size > 2 * 1024 * 1024) {
        // 2 MB limit
        alert('File too large (max 2MB)');
        return;
      }

      const formData = new FormData();
      formData.append('resume', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'resume.pdf',
      });

      setresumeData(formData);

      // 4️⃣ Send to backend (example)
    } catch (err) {
      console.log(err);
    }
  };

  const handleResumeUpload = async () => {
    console.log(resumeData);
    try {
      const response = await API.post('/resume-upload', resumeData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);
      if (response.status === 200) {
        showMessage({
          message: 'resume uploaded successfully',
          type: 'success',
        });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        visible={isEdit}
        onRequestClose={() => setEdit(false)}
        animationType="slide"
      >
        <EditProfile existingProfile={profile} />
      </Modal>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={1}
          onPress={() => setEdit(true)}
        >
          <Ionicons name="pencil-sharp" size={20}></Ionicons>
        </TouchableOpacity>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                profile.avatar ||
                'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{username}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(socialLinks.github)}
            >
              <Ionicons name="logo-github" size={20} color="#fff" />
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#0672d6' }]}
              onPress={() => Linking.openURL(socialLinks.linkedin)}
            >
              <Ionicons name="logo-linkedin" size={20} color="#fff" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.resumeContainer]}
            onPress={pickAndConvertFile}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}
            >
              <Text style={styles.resumeText}>Resume</Text>
              <Text style={[styles.resumeText, { color: '#0672d6' }]}>
                update
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                padding: 10,
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Ionicons name="folder-sharp" size={40} color="orange" />
              <Text style={[{ color: 'gray' }]}>
                {`${
                  socialLinks.resumeLink
                    ? profile.username?.toUpperCase()
                    : 'upload resume'
                } resume`}
              </Text>
            </View>
          </TouchableOpacity>
          {resumeData && (
            <TouchableOpacity
              style={styles.btn}
              onPress={handleResumeUpload}
              activeOpacity={1}
            >
              <Text style={styles.socialText}>upload</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogout}
          activeOpacity={1}
        >
          <Text style={styles.socialText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  editButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 3,
    borderColor: '#0672d6',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 12,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#444',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E0F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#0672d6',
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24292E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  socialText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  resumeText: { fontFamily: 'Poppins-Regular', fontSize: 15 },
  resumeContainer: {
    marginTop: 20,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderStyle: 'dashed',
  },
  btn: {
    backgroundColor: '#0672d6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileSection;
