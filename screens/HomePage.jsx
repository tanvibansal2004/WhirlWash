import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Fontisto'
import Icon1 from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const HomePage = () => {
    const [user, setUser] = useState("User");
    const navigation = useNavigation();

  return (
    <SafeAreaView style={{backgroundColor:'white', width:'100%', height:'100%'}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20}}>
            <Text style = {{fontSize : 24, fontWeight:600,}}>Hello, {user}!</Text>
            <View style={{flexDirection:'row', gap:10}}>
                <TouchableOpacity 
                style={{backgroundColor:'#E2E5F4', width:40, height:40, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                    <Icon name="bell" size={24} color="#3D4EB0"/>
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={()=>{
                    navigation.navigate('Rules')
                }}
                style={{backgroundColor:'#E2E5F4', width:40, height:40, borderRadius:10, justifyContent:'center', alignItems:'center'}}>
                    <Icon1 name="document-text-outline" size={26} color="#3D4EB0" style={{}}/>
                </TouchableOpacity>
            </View>
        </View>
        
        <Image source={require('../assets/LNMIIT.png')}
               style ={{width:'85%',marginTop: 20, marginLeft:30, height:'30%', borderRadius:10}}
        />

        <View style={{backgroundColor:'#F5F5F5', height:'30%', width:'85%', borderRadius:5, marginTop:30, marginLeft:30, padding:10}}>
            <Text style={{fontSize:30, fontWeight:400}}>Heading</Text>
            <Text style={{fontSize:16, lineHeight:22, marginTop:5}}>"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi officiis incidunt autem corrupti explicabo deserunt numquam tempora soluta, quibusdam molestias iste quos perferendis ab sapiente beatae doloribus nobis reprehenderit voluptas! Consequuntur totam veniam aspernatur quibusdam repellat voluptate laborum! Porro, possimus!"</Text>
        </View>

        <TouchableOpacity style={{backgroundColor:'#F5F5F5',height:'8%', width:'85%', marginTop:20, borderRadius:10, marginLeft:30, borderWidth:2, borderColor:'black', justifyContent:'center', alignItems:'center', flexDirection:'row', gap:10}}
            onPress={() => navigation.navigate('Machines')}>
            <Image source = {require('../assets/image.png')}
             style = {{width:30, height:30}} />
            <Text style={{color:'grey', fontSize:20, fontWeight:'semibold', fontWeight:600}}>Book Machine</Text>
        </TouchableOpacity>

    </SafeAreaView>
  )
}

export default HomePage

const styles = StyleSheet.create({})