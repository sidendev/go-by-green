import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { UserIdContext } from '../../Context/UserIdContext'
import React, { useContext, useEffect, useState } from 'react'
import { fetchSpecificUser } from '../../../ApiCalls/SpecificUserApi'
import { UserContext } from '../../Context/UserContext'
import Colours from '../../Utils/Colours'
import { getRoutesByUserId } from '../../../ApiCalls/UserRoutesAPI'
import { Feather } from '@expo/vector-icons';



const { width, height } = Dimensions.get('window')

export default function LoggedInProfile() {
    const { userId } = useContext(UserIdContext)
    const [specificUser, setSpecificUser] = useState({})
    const {user, setUser} = useContext(UserContext)
    const [userRoutes, setUserRoutes] = useState([])
   

    useEffect(() => {
        fetchSpecificUser(userId).then((data) => {
            setSpecificUser(data.user)
            console.log(data.user, 'loggedinprofile<<<<<<<<<<<<<<<<<,')
        })
    }, [userId])

    const handleLogOut = () => {
        setUser(null)
        console.log(user)
    }

    useEffect(()=>{
        const fetchRoutes = async () => {
          try{
            const response = await getRoutesByUserId(userId)
            if(response && response.routes && user){
              setUserRoutes(response.routes)
            }
          }catch(error){
            console.error('Error fetching routes', error)
          }
        }
        fetchRoutes()
      },[userId])


  return (
    <View style={styles.profileLayout}>
    <Feather name="settings" size={24} color="black" style={{marginLeft:300}}/>
    <Text style={styles.usernameText}>{specificUser.username} </Text>
    <View style={styles.imageContainer}>
        <Image
            source={{ uri:`${specificUser.profile_url}` }}
            style={styles.profileImage}
        />
    </View>
    <View style={styles.statsContainer}>
        <View style={styles.statItem}>
        <Text style={styles.statLabel}>Total Routes:</Text>
            <Text style={styles.statValue}>{userRoutes.length}</Text>
        </View>
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>Carbon saved:</Text>
            <Text style={styles.statValue}>{specificUser.total_carbon} kg*</Text>
        </View>
    </View>
    <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{specificUser.name}</Text>
    </View>
    <Text style={{marginTop:230}}>* This is calculated by the difference between your green route CO2 emission and the average emission of cars at 108.1g CO2/km </Text>
    <TouchableOpacity onPress={handleLogOut}>
        <Text style={styles.logoutText}>
            Log out
        </Text>
    </TouchableOpacity>
</View>
);
}

const styles = StyleSheet.create({
profileLayout: {
flex: 1,
alignItems: 'center',
backgroundColor: Colours.WHITE,
},
usernameText: {
fontFamily: 'Poppins-Bold',
fontSize: 24,
color: Colours.PRIMARY,
marginBottom: 10,
},
imageContainer: {
justifyContent: 'center',
alignItems: 'center',
marginBottom: 20,
},
profileImage: {
height: 120,
width: 120,
borderRadius: 60,
},
statsContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
width: '80%',
marginBottom: 20,
},
statItem: {
alignItems: 'center',
},
statLabel: {
fontFamily: 'Poppins-Bold',
fontSize: 16,
color: Colours.PRIMARY,
},
statValue: {
fontFamily: 'Poppins-Bold',
fontSize: 30,
color: Colours.BLACK,
},
infoContainer: {
alignItems: 'center',
marginBottom: 20,
},
infoText: {
fontFamily:'Poppins-Regular',
fontSize: 18,
color: Colours.BLACK,
marginBottom: 5,
},
logoutText: {
width:width*0.5,
height:height*0.5,
fontFamily:'Poppins-Regular',
color: Colours.BLACK,
fontSize: 20,
textAlign: 'center',
border:'',
padding:10
},
})

