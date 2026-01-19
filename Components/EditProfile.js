import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from './style';
import Ionicons from '@react-native-vector-icons/ionicons';
import API from '../utils/auth';
import { getTokens } from '../utils/store';
import { showMessage } from 'react-native-flash-message';
import { useProfile } from '../Store/userContext';

const EditProfileModal = ({ existingProfile }) => {
  const [name, setName] = useState(existingProfile?.username || '');
  const [location, setLocation] = useState(existingProfile?.location || '');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [skills, setSkills] = useState(existingProfile?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [gitLink, setGitLink] = useState(
    existingProfile?.socialLinks?.github || '',
  );
  const [role, setRole] = useState(existingProfile?.role || '');
  const [linkedinLink, setLinkedinLink] = useState(
    existingProfile?.socialLinks?.linkedin || '',
  );

  const { setEdit } = useProfile();

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = skill => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = async () => {
    try {
      const response = await API.post('/profile-update', {
        username: name,
        role: role,
        bio: bio,
        location: location,
        skills: skills,
        socialLinks: {
          github: gitLink,
          linkedin: linkedinLink,
        },
      });

      if (response.status === 200) {
        showMessage({
          message: 'Profile updated successfully',
          type: 'success',
        });
        setEdit(false);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <View style={styles.overlay}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      > */}
      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Enter your name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Role</Text>
            <TextInput
              placeholder="Enter your role"
              style={styles.input}
              value={role}
              onChangeText={setRole}
            />
          </View>

          {/* Location */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              placeholder="Enter your location"
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Bio */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              placeholder="Tell something about yourself"
              style={[styles.input, { height: 80 }]}
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          {/* Skills Section */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Skills</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                placeholder="Add a skill"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                value={skillInput}
                onChangeText={setSkillInput}
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity style={styles.addBtn} onPress={addSkill}>
                <Ionicons name="add-sharp" color="#fff" size={18} />
              </TouchableOpacity>
            </View>

            {/* Skill Tags */}
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                  <TouchableOpacity
                    onPress={() => removeSkill(skill)}
                    style={styles.removeSkill}
                  >
                    <Ionicons name="close-outline" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={[styles.inputWrapper, { marginTop: 10 }]}>
              <Text style={styles.label}>GitHub Link</Text>
              <TextInput
                placeholder=""
                style={[styles.input]}
                value={gitLink}
                onChangeText={setGitLink}
              />
            </View>
            <View style={[styles.inputWrapper, { marginTop: 10 }]}>
              <Text style={styles.label}>LinkedIn Link</Text>
              <TextInput
                placeholder=""
                style={[styles.input]}
                value={linkedinLink}
                onChangeText={setLinkedinLink}
              />
            </View>
          </View>
        </ScrollView>

        {/* Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

export default EditProfileModal;
