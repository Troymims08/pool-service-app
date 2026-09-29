import { View, Text, TextInput, Button, Alert } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useState } from "react";
import { router } from "expo-router";

export default function AddCustomerScreen() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const addCustomer = async () => {
    if (!name || !address || !phone) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    try {
      await addDoc(collection(db, "customers"), {
        ownerId: user.uid,          // ✅ IMPORTANT
        name,
        address,
        phone,
        createdAt: new Date(),
      });

      router.back();
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Unknown error");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Add Customer
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Save Customer" onPress={addCustomer} />
    </View>
  );
}
