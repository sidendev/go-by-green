import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Colours from '../../Utils/Colours'
import { UserContext } from '../../Context/UserContext'
import { findUser } from '../../../ApiCalls/UserApi'
import { UserIdContext } from '../../Context/UserIdContext'
import LoggedInProfile from './LoggedInProfile'

const { width, height } = Dimensions.get('window')

export default function ProfileScreen() {
  const { userId, setUserId } = useContext(UserIdContext)
  const { user, setUser } = useContext(UserContext)
  const [userName, setUserName] = useState('')
  const [users, setUsers] = useState([])
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(true)
  const [login, setLogin] = useState(null)

  const handleLogin = () => {
    checkingUser()
    if (password === '') {
      setPasswordValid(false)
      Alert.alert('Error: password is required')
    }
  }
  useEffect(() => {
    findUser().then((data) => {
      setUsers(data.users)
    })
    console.log(users, 'line 24<<<<<<<<<<<<<<<<<<')
  }, []);

  const checkingUser = () => {
    let userFound = false

    let userFoundArray = []
    console.log(userFoundArray)


    users.map((user) => {
      if (user.username === userName && user.password === password) {
        userFoundArray.push(user)
        console.log(user, '<<<<<<<<<<<<<<<< line37')
        userFound = true
      }
      return userFoundArray
    })
    if (userFound) {
      console.log(userFoundArray, ' Line 41<<<<<<<<<<<<<<<,')
      setUser(userName)
      setUserId(userFoundArray[0].user_id)
      console.log(userId, 'line 46 userId')
      setLogin(true)
      setUserName('')
      setPassword('')
    } else {
      setUser('')
      setPassword('')
      setLogin(false)
    }
  }

  return (
    !user ? (
      <View>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, textAlign: 'center', paddingTop: 50, paddingBottom: 30 }}>Login</Text>
        <TextInput
          style={{ fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center', paddingTop: 10, borderRadius: 15, marginLeft: 10, marginRight: 10, backgroundColor: '#d3d3d3' }}
          label='Username'
          placeholder='Enter your username'
          value={userName}
          onChangeText={setUserName}
        />
        <Text></Text>
        <TextInput
          style={{ fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center', paddingTop: 10, borderRadius: 15, marginLeft: 10, marginRight: 10, backgroundColor: '#d3d3d3' }}
          label='Password'
          placeholder='Insert password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}


        />
        {login !== null && (
          <View>
            {login ? (
              <Text></Text>
            ) : (
              <Text style={{ marginBottom: 2 }}>Please check login details</Text>
            )}
          </View>
        )}
        <TouchableOpacity style={styles.button}
          onPress={handleLogin}>
          <Text
            style={{
              fontFamily: "outfit-SemiBold",
              color: Colours.WHITE,
              paddingLeft: 10,
              paddingRight: 10,
              fontSize: 25,
              textAlign: 'center'
            }}
          >
            Log in
          </Text>
        </TouchableOpacity>

      </View>) : (<LoggedInProfile />)

  )
}

const styles = StyleSheet.create({
  button: {
    width: width * 0.5, // 50% of the screen width
    height: height * 0.08, // 8% of the screen height
    padding: 10, // Reduced padding
    backgroundColor: Colours.PRIMARY,
    borderRadius: 25, // Reduced border radius
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center', // Centers the content vertically
    marginVertical: height * 0.02, // Vertical margin to position button
    alignSelf: 'center', // Center the button horizontally
    display: 'flex',
  },
});