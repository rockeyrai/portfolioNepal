import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useThemeColors } from '../../utils/ColorTheme';
import { Text, View } from 'react-native';



interface DropdownProps {
  filterOptions: { label: string; value: any }[];
  selectedFilter: any;
  setselectedFilter: (value: any) => void;
  dropDownWith: number 
  placeHolder:string
}

const CustomeDropdown: React.FC<DropdownProps> = ({
  filterOptions,
  selectedFilter,
  setselectedFilter,
  dropDownWith,
  placeHolder,
}) => {
  const { colors } = useThemeColors();

  console.log("dorpdown fucntion option",filterOptions)
  return (
    <View style={{width:dropDownWith}}>
    <Dropdown
      data={filterOptions}
      labelField="label"
      valueField="value"
      
      value={selectedFilter}
      onChange={item => setselectedFilter(item.value)}
      placeholder={placeHolder}
      iconColor={colors.text}
      style={{
        // borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: "100%",
        borderColor:colors.dropdown,
        backgroundColor: colors.dropdown,
      }}
      activeColor={colors.tabActive}
      containerStyle={{
        backgroundColor: colors.secondBackground,
        borderRadius: 10,
        borderColor: colors.secondBackground,
        overflow: 'hidden',
      }}
      selectedTextStyle={{ color: colors.text, fontSize: 12 }}
      placeholderStyle={{ color: colors.text }}
      renderItem={item => {
        console.log('itsem', item);
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 4,
            }}
          >
            {/* Example: You can add an icon or colored dot */}
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.secondBackground,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
              }}
            >
              {item?.label}
            </Text>
          </View>
        );
      }}
    />
    </View>

  );
};

export default CustomeDropdown;
