import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SortDownSvg = ({
  width = 24,
  height = 24,
  color = 'black',
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 256 256" fill="none">
    <Path
      d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"
      fill={color}
      //   scale={24 / 256}/
    />
  </Svg>
);

export default SortDownSvg;
