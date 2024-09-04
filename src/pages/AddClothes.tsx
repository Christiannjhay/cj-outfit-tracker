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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as uuid from "uuid";
import "react-native-get-random-values";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseclient'; 

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
        setImage(uploadUrl); // Update image with the upload URL

        // Save image details to Supabase
        const { data, error } = await supabase
          .from('clothes')
          .insert([{ user_id: user.id, image_url: uploadUrl }]);
        
        if (error) {
          throw error;
        }

        setSelectedImageUri(null);
        Alert.alert("Success", "Image saved successfully!");
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

      <Button title="Choose Image" onPress={pickImage} />

      <Button title="Save" onPress={saveImage} disabled={uploading || !selectedImageUri} />
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
