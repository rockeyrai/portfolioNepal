import React from "react";
import { Text, View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

type CompanyRouteProp = RouteProp<{ params: { symbol: string } }, "params">;

const CompanyScreen = () => {
  const route = useRoute<CompanyRouteProp>();
  const { symbol } = route.params;

  return (
    <View>
      <Text>Company: {symbol}</Text>
    </View>
  );
};

export default CompanyScreen;
