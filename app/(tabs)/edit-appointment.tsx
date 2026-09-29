import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  serviceType: string;
};

export default function EditAppointmentScreen() {
  const {
    id,
    customerId,
    customerName,
    serviceId,
    serviceType,
    date,
    time,
    notes,
    status,
  } = useLocalSearchParams<{
    id: string;
    customerId: string;
    customerName: string;
    serviceId: string;
    serviceType: string;
    date: string;
    time: string;
    notes: string;
    status: string;
  }>();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(
      customerId && customerName
        ? {
            id: customerId,
            name: customerName,
          }
        : null
    );

  const [selectedService, setSelectedService] =
    useState<Service | null>(
      serviceId && serviceType
        ? {
            id: serviceId,
            serviceType: serviceType,
          }
        : null
    );

  const [newDate, setNewDate] = useState(date ?? "");
  const [newTime, setNewTime] = useState(time ?? "");
  const [newNotes, setNewNotes] = useState(notes ?? "");
  const [newStatus, setNewStatus] = useState(
    status ?? "scheduled"
  );

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "customers"),
        where("ownerId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      setCustomers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
      );
    };

    loadCustomers();
  }, []);

  // Load services for selected customer
  useEffect(() => {
    const loadServices = async () => {
      const user = auth.currentUser;

      if (!user || !selectedCustomer) {
        setServices([]);
        return;
      }

      const q = query(
        collection(db, "services"),
        where("ownerId", "==", user.uid),
        where("customerId", "==", selectedCustomer.id)
      );

      const snapshot = await getDocs(q);

      setServices(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          serviceType: doc.data().serviceType,
        }))
      );
    };

    loadServices();
  }, [selectedCustomer]);

  const saveChanges = async () => {
    if (!id) {
      Alert.alert("Error", "Appointment not found.");
      return;
    }

    if (!selectedCustomer) {
      Alert.alert("Error", "Please select a customer.");
      return;
    }

    if (!selectedService) {
      Alert.alert("Error", "Please select a service.");
      return;
    }

    if (!newDate) {
      Alert.alert("Error", "Date is required.");
      return;
    }

    if (!newTime) {
      Alert.alert("Error", "Time is required.");
      return;
    }

    try {
      await updateDoc(doc(db, "appointments", id), {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,

        serviceId: selectedService.id,
        serviceType: selectedService.serviceType,

        date: newDate,
        time: newTime,
        notes: newNotes,
        status: newStatus,
      });

      Alert.alert("Success", "Appointment updated successfully.");

      router.back();
    } catch (error) {
      console.error("Update appointment error:", error);

      Alert.alert(
        "Error",
        "Failed to update appointment."
      );
    }
  };

 return (
  <ScrollView
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
    }}
  >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Edit Appointment
      </Text>

      {/* CUSTOMER */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Customer
      </Text>

      {customers.map((customer) => (
        <View
          key={customer.id}
          style={{ marginBottom: 5 }}
        >
          <Button
            title={customer.name}
            onPress={() => {
              setSelectedCustomer(customer);
              setSelectedService(null);
            }}
            color={
              selectedCustomer?.id === customer.id
                ? "green"
                : undefined
            }
          />
        </View>
      ))}

      {selectedCustomer && (
        <Text style={{ marginVertical: 10 }}>
          Selected: {selectedCustomer.name}
        </Text>
      )}

      {/* SERVICE */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        Service
      </Text>

      {services.length === 0 ? (
        <Text>No services found for this customer.</Text>
      ) : (
        services.map((service) => (
          <View
            key={service.id}
            style={{ marginBottom: 5 }}
          >
            <Button
              title={service.serviceType}
              onPress={() =>
                setSelectedService(service)
              }
              color={
                selectedService?.id === service.id
                  ? "green"
                  : undefined
              }
            />
          </View>
        ))
      )}

      {selectedService && (
        <Text style={{ marginVertical: 10 }}>
          Selected: {selectedService.serviceType}
        </Text>
      )}

      {/* DATE */}
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={newDate}
        onChangeText={setNewDate}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      {/* TIME */}
      <TextInput
        placeholder="Time (example: 10:00 AM)"
        value={newTime}
        onChangeText={setNewTime}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      {/* STATUS */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        Status
      </Text>

      <Button
        title="Scheduled"
        onPress={() => setNewStatus("scheduled")}
        color={
          newStatus === "scheduled"
            ? "green"
            : undefined
        }
      />

      <View style={{ height: 5 }} />

      <Button
        title="Completed"
        onPress={() => setNewStatus("completed")}
        color={
          newStatus === "completed"
            ? "green"
            : undefined
        }
      />

      <View style={{ height: 5 }} />

      <Button
        title="Cancelled"
        onPress={() => setNewStatus("cancelled")}
        color={
          newStatus === "cancelled"
            ? "red"
            : undefined
        }
      />

      {/* NOTES */}
      <TextInput
        placeholder="Notes"
        value={newNotes}
        onChangeText={setNewNotes}
        multiline
        style={{
          borderWidth: 1,
          padding: 10,
          marginTop: 15,
          marginBottom: 20,
          minHeight: 80,
        }}
      />

      <Button
        title="Save Changes"
        onPress={saveChanges}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Cancel"
        onPress={() => router.back()}
      />
      </ScrollView>
);
}