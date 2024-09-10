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
  }, []);

  const checkingUser = () => {
    let userFound = false

    let userFoundArray = []
    console.log(userFoundArray)


    users.map((user) => {
      if (user.username === userName && user.password === password) {
        userFoundArray.push(user)
        userFound = true
      }
      return userFoundArray
    })
    if (userFound) {
      setUser(userName)
      setUserId(userFoundArray[0].user_id)
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
      <View style={styles.container}>
        <Text style={styles.headerText}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Enter your username'
            value={userName}
            onChangeText={setUserName}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Enter your password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        {login === false && (
          <Text style={styles.errorText}>Please check login details</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <LoggedInProfile />
    )
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.WHITE,
    padding: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colours.GOBYGREEN_GREEN,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: Colours.WHITE,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colours.PRIMARY,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    padding: 15,
    height: 55,
  },
  button: {
    backgroundColor: Colours.GOBYGREEN_GREEN,
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colours.WHITE,
    fontSize: 18,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});