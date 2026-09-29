import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useState } from "react";

export default function EditServiceScreen() {
  const {
    serviceId,
    serviceType: initialServiceType,
    description: initialDescription,
    frequency: initialFrequency,
    price: initialPrice,
    notes: initialNotes,
  } = useLocalSearchParams<{
    serviceId: string;
    serviceType: string;
    description: string;
    frequency: string;
    price: string;
    notes: string;
  }>();

  const [serviceType, setServiceType] = useState(initialServiceType || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [frequency, setFrequency] = useState(initialFrequency || "");
  const [price, setPrice] = useState(initialPrice || "");
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);

  const updateService = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    if (!serviceId) {
      Alert.alert("Error", "Service not found.");
      return;
    }

    if (!serviceType.trim()) {
      Alert.alert("Missing information", "Please enter a service type.");
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "services", serviceId), {
        serviceType: serviceType.trim(),
        description: description.trim(),
        frequency: frequency.trim(),
        price: price.trim(),
        notes: notes.trim(),
      });

      Alert.alert("Success", "Service updated successfully.");

      router.back();
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "Failed to update service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Edit Service
      </Text>

      <Text>Service Type</Text>

      <TextInput
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
        title={saving ? "Saving..." : "Save Changes"}
        onPress={updateService}
        disabled={saving}
      />

      <View style={{ height: 10 }} />

      <Button title="Cancel" onPress={() => router.back()} />
    </View>
  );
}