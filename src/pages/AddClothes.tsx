import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as uuid from "uuid";
import "react-native-get-random-values";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseclient";
import DropDownPicker from "react-native-dropdown-picker";

const firebaseConfig = {
  apiKey: "AIzaSyDK-dYs6IONmxZ0wQ5gC3FrFdXe3tMvPIw",
  authDomain: "cj-movies.firebaseapp.com",
  databaseURL: "https://cj-movies.firebaseio.com",
  projectId: "cj-movies",
  storageBucket: "cj-movies.appspot.com",
  messagingSenderId: "588731591451",
  appId: "1:588731591451:android:75e0ad3084a6399c2b81be",
};

// Initialize Firebase only once
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function ImagePickerExample() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Tops", value: "Tops" },
    { label: "Bottoms", value: "Bottoms" },
    { label: "Footwear", value: "Footwear" },
  ]);
  useEffect(() => {
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };
    requestPermission();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    if (selectedImageUri && user) {
      try {
        setUploading(true);
        const uploadUrl = await uploadImageAsync(selectedImageUri);
        setImage(uploadUrl);

        const { data, error } = await supabase
          .from("clothes")
          .insert([
            {
              user_id: user.id,
              image_url: uploadUrl,
              description: description,
              category: value,
            },
          ]);

        if (error) {
          throw error;
        }

        setSelectedImageUri(null);
        ToastAndroid.show("Image saved successfully!", ToastAndroid.SHORT);
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Upload failed, sorry :(");
      } finally {
        setUploading(false);
      }
    } else {
      Alert.alert("Error", "No image selected or user not authenticated.");
    }
  };
  return (
    <View style={styles.container}>
      {uploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}

      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>
      <View style={styles.dropContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={styles.dropdown}
          placeholder="Select an option"
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
        />
      </View>
      <TextInput
        className="m-2 w-11/12 rounded-3xl border-2 border-[#081F5C] p-2 px-6 mt-4"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={[
          styles.button,
          styles.saveButton,
          { opacity: uploading || !selectedImageUri ? 0.5 : 1 },
        ]}
        onPress={saveImage}
        disabled={uploading || !selectedImageUri}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadingOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
  imageContainer: {
    marginTop: 30,
    width: 250,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.2,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: 250,
    height: 250,
  },
  saveButton: {
    marginTop: 10,
    width: "91.66%",
    backgroundColor: "#081F5C",
    padding: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#081F5C",
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff", // Change this to your desired text color
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdown: {
    marginTop: 10,
    width: "91.66%",
    borderColor: "#081F5C",
    borderWidth: 2,
    borderRadius: 20,
  },
  dropContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContainer: {
    flex: 1,
    justifyContent: "center",
    borderColor: "#081F5C",
  },
  dropdownText: {
    color: "#000",
  },
  dropdownPlaceholder: {
    color: "#081F5C",
  },
});

async function uploadImageAsync(uri: string) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new TypeError("Network request failed"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuid.v4());
  const result = await uploadBytes(fileRef, blob);

  return await getDownloadURL(fileRef);
}
