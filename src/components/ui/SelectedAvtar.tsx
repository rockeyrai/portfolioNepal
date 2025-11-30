import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import userQuerry from "../../services/user"

import avatar1 from "../../assets/avatar/avatar1.webp";
import avatar2 from "../../assets/avatar/avatar2.webp";
import avatar3 from "../../assets/avatar/avatar3.webp";
import avatar4 from "../../assets/avatar/avatar4.webp";
import avatar5 from "../../assets/avatar/avatar5.webp";
import fallback from "../../assets/logo/portfolio.png";

const SelectedAvtar = () => {
  const { data: userPortfoliosResponse = [] } =
    userQuerry.getUserLinkPortfolio(); 
    
    const selectedPortfolio = useSelector(
    (state: RootState) => state.portfolio.selectedPortfolio
  );

  const avatarList = [avatar1, avatar2, avatar3,avatar4,avatar5];
  console.log(userPortfoliosResponse)

  // find index in the portfolio array
  const index = userPortfoliosResponse?.findIndex(
    (p) => p.id === selectedPortfolio?.id
  );

  // choose avatar based on index (cycle)
  const selectedAvatar =
    index >= 0 ? avatarList[index % avatarList.length] : null;

  if (!selectedAvatar) {
    return (
      <View style={styles.profileImageWrapper}>
        <Image source={fallback} style={styles.profileImage} />
      </View>
    );
  }

  return (
    <View style={styles.profileImageWrapper}>
      <Image source={selectedAvatar} style={styles.profileImage} />
    </View>
  );
};

export default SelectedAvtar;

const styles = StyleSheet.create({
  profileImageWrapper: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#141047ff",
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
