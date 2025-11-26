import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import CustomeDropdown from '../../../components/ui/CustomeDropdown';
import { useThemeColors } from '../../../utils/ColorTheme';
import { ArrowUpIcon } from 'lucide-react-native';

const PortfolioList = () => {
  const filterOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Weeak', value: 'Weeak' },
    { label: 'Month', value: 'Month' },
  ];
  const [selectedFilter, setSelectedFilter] = useState<
    'Today' | 'Weeak' | 'Month'
  >('Today');
  const { colors } = useThemeColors();
  const [toggleFilter, setToggleFilter] = useState('Best');
  return (
    <View style={{ backgroundColor: colors.background,width:"100%" }}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',

        }}
      >
        <View
          style={{
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap:8,
            backgroundColor:"red"
          }}
        >
            {/* <View style={{width:}}>

            </View> */}
          <CustomeDropdown
            filterOptions={filterOptions}
            selectedFilter={selectedFilter}
            setselectedFilter={setSelectedFilter}
            dropDownWith={80}
          />
          <Pressable
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              gap:4
            }}
          >
            <Text style={{color:colors.text}}>{toggleFilter}</Text>
            <ArrowUpIcon />
          </Pressable>
        </View>
        <View>
          <Text style={{color:colors.text}}>See more</Text>
        </View>
      </View>
    </View>
  );
};

export default PortfolioList;
