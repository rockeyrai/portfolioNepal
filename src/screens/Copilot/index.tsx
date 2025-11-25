import React, { useEffect, useRef } from 'react'
import { Text } from 'react-native-svg'

const CopilotScreen = () => {
      const renderCount = useRef(0);
      useEffect(() => {
        console.log('copilto mounted');
        return () => console.log('copilto unmounted');
      }, []);
      renderCount.current += 1;
    
      console.log(`copilto rendered ${renderCount.current} times`);
  return (
    <Text>Coplito</Text>
  )
}

export default CopilotScreen