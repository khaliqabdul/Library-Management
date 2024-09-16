import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLogin } from "../context/LoginProvider";

export default function ImagePickerComponent() {
  const { image, setImage } = useLogin();

  const pickImage = async () => {
    const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status } = response;
    if (status !== "granted") {
      alert("Sorry! we need camera rool permissions to make this work!");
    }
    if (status == "granted") {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        // aspect: [4, 3],
        // quality: 1,
      });
      //   console.log(result);'data:image/jpeg;base64,' +
      if (!result.canceled) {
        const uriImage = result.assets[0].uri;
        const base64 = "data:image/jpeg;base64," + result.assets[0].base64;
        setImage(base64);
      }
    }
  };
  //   console.log(image)
  return (
    <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 100,
    // borderRadius: 50,
  },
});
