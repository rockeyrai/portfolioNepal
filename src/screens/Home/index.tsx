import React from 'react'
import { Text } from 'react-native'
import Config from "react-native-config";
import BottomNavLayout from '../../layouts/BottomNav';


const HomeScreen = () => {
  return (
    <BottomNavLayout>
    <Text>{Config.TEST_API}</Text>

    </BottomNavLayout>
  )
}

export default HomeScreen