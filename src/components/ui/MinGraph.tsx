import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const MinGraph = item => {
  console.log('mini graph dta ', item?.latestData);

  return (
    <LineChart
      isAnimated
      thickness={0.4}
      color="#1eff00ff"
      //   maxValue={600}
      //   noOfSections={3}
      animateOnDataChange
      height={50}
      initialSpacing={0}
      width={100}
      animationDuration={1000}
      onDataChangeAnimationDuration={300}
      areaChart
      yAxisTextStyle={{ color: 'lightgray' }}
      data={item?.latestData}
      hideDataPoints
      startFillColor={'rgba(83, 209, 58, 1)'}
      endFillColor={'rgba(84, 234, 129, 1)'}
      startOpacity={0.2}
      endOpacity={0}
      //   spacing={22}
      adjustToWidth
    //   backgroundColor="#fff6f6ff"
      rulesColor="gray"
      rulesType="solid"
      //   initialSpacing={10}
      yAxisColor="lightgray"
      xAxisColor="lightgray"
      hideAxesAndRules
      hideYAxisText
      hideRules
      trimYAxisAtTop
      xAxisTextNumberOfLines={0}
      yAxisTextNumberOfLines={0}

    />
  );
};

export default MinGraph;
