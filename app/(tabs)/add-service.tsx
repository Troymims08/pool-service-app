import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useState } from "react";

export default function AddServiceScreen() {
  const { customerId, customerName } = useLocalSearchParams<{
    customerId: string;
    customerName: string;
  }>();

  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const saveService = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    if (!customerId) {
      Alert.alert("Error", "Customer not found.");
      return;
    }

    if (!serviceType.trim()) {
      Alert.alert("Missing information", "Please enter a service type.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "services"), {
        ownerId: user.uid,
        customerId,
        serviceType: serviceType.trim(),
        description: description.trim(),
        frequency: frequency.trim(),
        price: price.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Service added successfully.");

      router.back();
    } catch (error) {
      console.error("Error adding service:", error);
      Alert.alert("Error", "Failed to add service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
        Add Service
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Customer: {customerName}
      </Text>

      <Text>Service Type</Text>

      <TextInput
        placeholder="Example: Pool Cleaning"
        value={serviceType}
        onChangeText={setServiceType}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginTop: 5,
          marginBottom: 15,
        }}
      />

      <Text>Description</Text>

      <TextInput
        placeholder="Describe the service"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginTop: 5,
          marginBottom: 15,
          minHeight: 80,
        }}
      />

      <Text>Frequency</Text>

      <TextInput
        placeholder="Example: Weekly"
        value={frequency}
        onChangeText={setFrequency}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginTop: 5,
          marginBottom: 15,
        }}
      />

      <Text>Price</Text>

      <TextInput
        placeholder="Example: 125"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginTop: 5,
          marginBottom: 15,
        }}
      />

      <Text>Notes</Text>

      <TextInput
        placeholder="Additional notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginTop: 5,
          marginBottom: 20,
          minHeight: 80,
        }}
      />

      <Button
        title={saving ? "Saving..." : "Save Service"}
        onPress={saveService}
        disabled={saving}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Cancel"
        onPress={() => router.back()}
      />
    </View>
  );
}