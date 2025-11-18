import React from "react";
import { Text, TextStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";

interface GradientTextProps {
  children: string;
  style?: TextStyle;
}

export function GradientText({ children, style }: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: "transparent" }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={[
          "rgb(254, 219, 55)", // gold
          "white",
          "rgb(189, 161, 86)",
          "rgb(230, 190, 138)",
          "rgb(93, 74, 31)", // deep brown
        ]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        {/* Invisible text to maintain height */}
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export const GradientIcon = ({ Icon }: { Icon: any }) => (
  <MaskedView maskElement={<Icon size={20} color="white" />}>
    <LinearGradient
      colors={[
        "rgb(254, 219, 55)", // gold
        "white",
        "rgb(189, 161, 86)",
        "rgb(230, 190, 138)",
        "rgb(93, 74, 31)", // deep brown
      ]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{ width: 20, height: 20 }}
    />
  </MaskedView>
);
