import React, { useEffect, useRef } from 'react'
import { Text } from 'react-native-svg'

const ServiceScreen = () => {
      const renderCount = useRef(0);
      useEffect(() => {
        console.log('service mounted');
        return () => console.log('service unmounted');
      }, []);
      renderCount.current += 1;
    
      console.log(`service rendered ${renderCount.current} times`);
  return (
    <Text>Sercie pafge</Text>
  )
}

export default ServiceScreen