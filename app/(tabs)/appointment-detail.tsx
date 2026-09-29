import {
  View,
  Text,
  Button,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AppointmentDetailScreen() {
  const {
    id,
    customerName,
    serviceType,
    date,
    time,
    status,
    notes,
    customerId,
    serviceId,
  } = useLocalSearchParams<{
    id: string;
    customerName: string;
    serviceType: string;
    date: string;
    time: string;
    status: string;
    notes: string;
    customerId: string;
    serviceId: string;
  }>();

  const deleteAppointment = () => {
    if (!id) return;

    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, "appointments", id)
              );

              router.back();
            } catch (error) {
              console.error(
                "Delete appointment error:",
                error
              );

              Alert.alert(
                "Error",
                "Failed to delete appointment."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Appointment
      </Text>

      <View
        style={{
          padding: 15,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {serviceType || "Service"}
        </Text>

        <Text style={{ fontSize: 18, marginBottom: 5 }}>
          Customer: {customerName}
        </Text>

        <Text style={{ marginBottom: 5 }}>
          Date: {date}
        </Text>

        <Text style={{ marginBottom: 5 }}>
          Time: {time || "No time set"}
        </Text>

        <Text style={{ marginBottom: 5 }}>
          Status: {status || "scheduled"}
        </Text>

        {notes ? (
          <Text style={{ marginTop: 10 }}>
            Notes: {notes}
          </Text>
        ) : null}
      </View>

      <Button
        title="Edit Appointment"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/edit-appointment",
            params: {
              id,
              customerId,
              customerName,
              serviceId,
              serviceType,
              date,
              time,
              status,
              notes,
            },
          })
        }
      />

      <View style={{ height: 10 }} />

      <Button
        title="Delete Appointment"
        color="red"
        onPress={deleteAppointment}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Back"
        onPress={() => router.back()}
      />
    </View>
  );
}