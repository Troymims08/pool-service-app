import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useState } from "react";

export default function EditCustomerScreen() {
  const { id, name, address, phone } = useLocalSearchParams<{
    id: string;
    name: string;
    address: string;
    phone: string;
  }>();

  const [newName, setNewName] = useState(name);
  const [newAddress, setNewAddress] = useState(address);
  const [newPhone, setNewPhone] = useState(phone);

  const saveCustomer = async () => {
    if (!newName || !newAddress || !newPhone) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    await updateDoc(doc(db, "customers", id), {
      name: newName,
      address: newAddress,
      phone: newPhone,
    });

    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Edit Customer
      </Text>

      <TextInput
        value={newName}
        onChangeText={setNewName}
        placeholder="Name"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={newAddress}
        onChangeText={setNewAddress}
        placeholder="Address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={newPhone}
        onChangeText={setNewPhone}
        placeholder="Phone"
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Save Changes" onPress={saveCustomer} />
    </View>
  );
}
