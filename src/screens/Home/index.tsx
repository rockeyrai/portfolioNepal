import React from 'react'
import { Text } from 'react-native'
import Config from "react-native-config";


const HomeScreen = () => {
  return (
    <Text>{Config.TEST_API}</Text>
  )
}

export default HomeScreen