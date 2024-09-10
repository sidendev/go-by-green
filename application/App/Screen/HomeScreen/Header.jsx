import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Colours from '../../Utils/Colours';
import React, { useContext, useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { UserContext } from '../../Context/UserContext'
import { UserIdContext } from '../../Context/UserIdContext'
import { fetchSpecificUser } from '../../../ApiCalls/SpecificUserApi'
import { useLocation } from '../../Context/LocationContext'

export default function Header() {
  const { setIsSaveIconClicked } = useLocation();

  const handleBookmarkPress = () => {
    setIsSaveIconClicked((prev) => !prev);
  };

  //set state to retrieve the profileurl as a profile icon / put default icon if not logged in

  const { userId } = useContext(UserIdContext)
  const [userProfile, setUserProfile] = useState('')
  //set state to retrieve the profileurl as a profile icon / put default icon if not logged in
  // THIS USEEFFECT FOR GETTING USER PROFILE IMG IS NOT CURRENTLY SET UP
  // useEffect(() => {
  //   fetchSpecificUser(userId).then((data) => {
  //     setUserProfile(data.user.profile_url)
  //   })
  // }, [userId])

  return (
    //   <Image source={require('../../../assets/images/profile-pic.jpg')}
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          // source={{ uri: `${userProfile}` }}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/gobygreen-title.png')}
          style={styles.logo}
        />
      </View>
      <TouchableOpacity style={styles.saveIconContainer} onPress={handleBookmarkPress}>
        <FontAwesome name="bookmark" size={34} color="white" />
      </TouchableOpacity>
      <View style={styles.spacer} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  profileContainer: {
    flex: 0,
    alignItems: 'flex-start',
  },
  saveIconContainer: {
    flex: 0,
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#00BF63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 45,
    resizeMode: 'contain',
  },
});