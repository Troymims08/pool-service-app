import { View, Text, FlatList, Button, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

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

type Service = {
  id: string;
  customerId: string;
  serviceType: string;
  description: string;
  frequency: string;
  price: string;
  notes: string;
};

export default function CustomerDetailScreen() {
  const { customerId, customerName, address, phone } =
    useLocalSearchParams<{
      customerId: string;
      customerName: string;
      address: string;
      phone: string;
    }>();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  // Load appointments
  useEffect(() => {
    const user = auth.currentUser;

    if (!user || !customerId) {
      setLoadingAppointments(false);
      return;
    }

    const q = query(
      collection(db, "appointments"),
      where("ownerId", "==", user.uid),
      where("customerId", "==", customerId),
      orderBy("date", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Appointment, "id">),
        }));

        setAppointments(data);
        setLoadingAppointments(false);
      },
      (error) => {
        console.log("Appointments error:", error);
        Alert.alert("Error", "Could not load appointments.");
        setLoadingAppointments(false);
      }
    );

    return unsub;
  }, [customerId]);

  // Load services
  useEffect(() => {
    const user = auth.currentUser;

    if (!user || !customerId) {
      setLoadingServices(false);
      return;
    }

    const q = query(
      collection(db, "services"),
      where("ownerId", "==", user.uid),
      where("customerId", "==", customerId)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Service, "id">),
        }));

        setServices(data);
        setLoadingServices(false);
      },
      (error) => {
        console.log("Services error:", error);
        Alert.alert("Error", "Could not load services.");
        setLoadingServices(false);
      }
    );

    return unsub;
  }, [customerId]);

  // Delete service
  const deleteService = (serviceId: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
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
              await deleteDoc(doc(db, "services", serviceId));
            } catch (error) {
              console.error("Error deleting service:", error);
              Alert.alert("Error", "Failed to delete service.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Customer Information */}
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {customerName}
      </Text>

      <Text>{address}</Text>
      <Text>{phone}</Text>

      <View style={{ height: 20 }} />

      {/* Services */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Services
      </Text>

      {loadingServices ? (
        <Text>Loading services...</Text>
      ) : services.length === 0 ? (
        <Text>No services added yet.</Text>
      ) : (
        services.map((service) => (
          <View
            key={service.id}
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {service.serviceType}
            </Text>

            {service.description ? (
              <Text>{service.description}</Text>
            ) : null}

            {service.frequency ? (
              <Text>Frequency: {service.frequency}</Text>
            ) : null}

            {service.price ? (
              <Text>Price: ${service.price}</Text>
            ) : null}

            {service.notes ? (
              <Text>Notes: {service.notes}</Text>
            ) : null}

            <View style={{ height: 10 }} />

            <Button
              title="Edit"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/edit-service",
                  params: {
                    serviceId: service.id,
                    serviceType: service.serviceType,
                    description: service.description,
                    frequency: service.frequency,
                    price: service.price,
                    notes: service.notes,
                  },
                })
              }
            />

            <View style={{ height: 5 }} />

            <Button
              title="Delete"
              color="red"
              onPress={() => deleteService(service.id)}
            />
          </View>
        ))
      )}

      <Button
        title="Add Service"
        onPress={() =>
          router.push({
            pathname: "/(tabs)/add-service",
            params: {
              customerId,
              customerName,
            },
          })
        }
      />

      <View style={{ height: 25 }} />

      {/* Appointments */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Appointments
      </Text>

      {loadingAppointments ? (
        <Text>Loading appointments...</Text>
      ) : appointments.length === 0 ? (
        <Text>No appointments for this customer.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
             <Text style={{ fontSize: 18, fontWeight: "bold" }}>
  {item.serviceType || "Service"}
</Text>

<Text>Date: {item.date}</Text>

<Text>Time: {item.time || "No time set"}</Text>

<Text>Status: {item.status || "scheduled"}</Text>

{item.notes ? <Text>Notes: {item.notes}</Text> : null}
            </View>
          )}
        />
      )}

      <View style={{ height: 10 }} />

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}