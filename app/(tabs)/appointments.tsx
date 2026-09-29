import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  Pressable,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { router } from "expo-router";

type Appointment = {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceType: string;
  date: string;
  time: string;
  notes: string;
  status: string;
};

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "appointments"),
      where("ownerId", "==", user.uid),
      orderBy("date", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((appointmentDoc) => ({
          id: appointmentDoc.id,
          ...(appointmentDoc.data() as Omit<
            Appointment,
            "id"
          >),
        }));

        setAppointments(data);
        setLoading(false);
      },
      (error) => {
        console.error("Appointments error:", error);

        Alert.alert(
          "Error",
          "Could not load appointments."
        );

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const deleteAppointment = (id: string) => {
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Appointments
      </Text>

      {appointments.length === 0 ? (
        <Text>No appointments found.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15 }}>
              
              {/* Appointment information */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname:
                      "/(tabs)/appointment-detail",
                    params: {
                      id: item.id,
                      customerId: item.customerId,
                      customerName: item.customerName,
                      serviceId: item.serviceId,
                      serviceType: item.serviceType,
                      date: item.date,
                      time: item.time,
                      status: item.status,
                      notes: item.notes,
                    },
                  })
                }
                style={{
                  padding: 15,
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {item.customerName}
                </Text>

                <Text>
                  Service:{" "}
                  {item.serviceType || "Service"}
                </Text>

                <Text>
                  Date: {item.date}
                </Text>

                <Text>
                  Time:{" "}
                  {item.time || "No time set"}
                </Text>

                <Text>
                  Status:{" "}
                  {item.status || "scheduled"}
                </Text>

                {item.notes ? (
                  <Text>
                    Notes: {item.notes}
                  </Text>
                ) : null}
              </Pressable>

              <View style={{ height: 5 }} />

              {/* Edit */}
              <Button
                title="Edit"
                onPress={() =>
                  router.push({
                    pathname:
                      "/(tabs)/edit-appointment",
                    params: {
                      id: item.id,
                      customerId: item.customerId,
                      customerName: item.customerName,
                      serviceId: item.serviceId,
                      serviceType: item.serviceType,
                      date: item.date,
                      time: item.time,
                      status: item.status,
                      notes: item.notes,
                    },
                  })
                }
              />

              <View style={{ height: 5 }} />

              {/* Delete */}
              <Button
                title="Delete"
                color="red"
                onPress={() =>
                  deleteAppointment(item.id)
                }
              />
            </View>
          )}
        />
      )}

      <View style={{ height: 10 }} />

      <Button
        title="Add Appointment"
        onPress={() =>
          router.push("/(tabs)/add-appointment")
        }
      />
    </View>
  );
}