import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState, useContext, navigation } from 'react'
import { UserIdContext } from '../../Context/UserIdContext'
import Colours from '../../Utils/Colours'
import { getRoutesByUserId } from '../../../ApiCalls/UserRoutesAPI'
import { UserContext } from '../../Context/UserContext'
import { Card, Button, Icon } from 'react-native-elements'
import ProfileScreen from '../ProfileScreen/ProfileScreen'
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window')

export default function SavedRoutes() {
  const { userId, setUserId } = useContext(UserIdContext)
  const [userRoutes, setUserRoutes] = useState([])
  const { user } = useContext(UserContext)
  const navigation = useNavigation()


  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await getRoutesByUserId(userId)
        if (response && response.routes && user) {
          setUserRoutes(response.routes)
        }
      } catch (error) {
        console.error('Error fetching routes', error)
      }
    }
    fetchRoutes()
  }, [userId])

  const handleLogIn = () => {
    navigation.navigate('ProfileScreen')
  }


  return (
    <ScrollView>

      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, textAlign: 'center', paddingTop: 50, paddingBottom: 30 }}>Saved Routes</Text>


      {user && userRoutes && userRoutes.length > 0 ? (
        <View>
          {userRoutes.map((route, index) => {
            return (
              <View key={index}>
                <Card>
                  <Card.Title style={styles.titleText}>Route Number:{index + 1}</Card.Title>
                  <Card.Divider />
                  <Text><Text style={{ fontWeight: 'bold' }}>Start point:</Text>{route.origin_address}</Text>
                  <Card.Divider />
                  <Text><Text style={{ fontWeight: 'bold' }}>End point:</Text>{route.destination_address}</Text>
                  <Card.Divider />
                  <Text><Text style={{ fontWeight: 'bold' }}>Carbon Usage:</Text>{route.carbon_usage}</Text>
                  <Card.Divider />
                  <Text><Text style={{ fontWeight: 'bold' }}>Mode of transport:</Text>{route.mode_of_transport}</Text>
                  <Card.Divider />
                  <Text><Text style={{ fontWeight: 'bold' }}>Route distance:</Text>{route.route_distance}</Text>
                  <Card.Divider />
                  <Text><Text style={{ fontWeight: 'bold' }}>Route Time:</Text>{route.route_time}</Text>
                </Card>
              </View>)
          })}
        </View>
      ) : (<TouchableOpacity onPress={handleLogIn}>
        <Text style={styles.logoutText}>
          Please Log In
        </Text>
      </TouchableOpacity>)}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  logoutText: {
    marginBottom: 50,
    marginLeft: 100,
    marginRight: 100,
    width: width * 0.5,
    height: height * 0.5,
    fontFamily: 'Poppins-Regular',
    color: Colours.BLACK,
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
    border: ''
  },
  titleText: {
    color: Colours.PRIMARY,
  },
})