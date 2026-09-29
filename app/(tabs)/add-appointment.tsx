import { View, Text, Button, TextInput, Alert } from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { router } from "expo-router";

type Customer = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  serviceType: string;
};

export default function AddAppointmentScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "customers"),
        where("ownerId", "==", user.uid)
      );

      const snap = await getDocs(q);

      setCustomers(
        snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
      );
    };

    loadCustomers();
  }, []);

  // Load services when customer is selected
  useEffect(() => {
    const loadServices = async () => {
      const user = auth.currentUser;

      if (!user || !selectedCustomer) {
        setServices([]);
        setSelectedService(null);
        return;
      }

      const q = query(
        collection(db, "services"),
        where("ownerId", "==", user.uid),
        where("customerId", "==", selectedCustomer.id)
      );

      const snap = await getDocs(q);

      setServices(
        snap.docs.map((doc) => ({
          id: doc.id,
          serviceType: doc.data().serviceType,
        }))
      );

      setSelectedService(null);
    };

    loadServices();
  }, [selectedCustomer]);

  const saveAppointment = async () => {
    if (!selectedCustomer || !selectedService || !date || !time) {
      Alert.alert(
        "Missing info",
        "Please select a customer, service, date, and time."
      );
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        ownerId: user.uid,

        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,

        serviceId: selectedService.id,
        serviceType: selectedService.serviceType,

        date,
        time,
        notes,

        status: "scheduled",

        createdAt: new Date(),
      });

      Alert.alert("Success", "Appointment created!");

      router.back();
    } catch (error) {
      console.error("Error saving appointment:", error);

      Alert.alert("Error", "Failed to save appointment.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Add Appointment
      </Text>

      {/* CUSTOMER */}
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Select Customer
      </Text>

      {customers.map((customer) => (
        <View key={customer.id} style={{ marginBottom: 5 }}>
          <Button
            title={customer.name}
            onPress={() => setSelectedCustomer(customer)}
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
          Selected Customer: {selectedCustomer.name}
        </Text>
      )}

      {/* SERVICE */}
      {selectedCustomer && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 15,
            }}
          >
            Select Service
          </Text>

          {services.length === 0 ? (
            <Text style={{ marginTop: 10 }}>
              No services found for this customer.
            </Text>
          ) : (
            services.map((service) => (
              <View key={service.id} style={{ marginBottom: 5 }}>
                <Button
                  title={service.serviceType}
                  onPress={() => setSelectedService(service)}
                  color={
                    selectedService?.id === service.id
                      ? "green"
                      : undefined
                  }
                />
              </View>
            ))
          )}
        </>
      )}

      {selectedService && (
        <Text style={{ marginVertical: 10 }}>
          Selected Service: {selectedService.serviceType}
        </Text>
      )}

      {/* DATE */}
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      {/* TIME */}
      <TextInput
        placeholder="Time (example: 10:00 AM)"
        value={time}
        onChangeText={setTime}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      {/* NOTES */}
      <TextInput
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Button
        title="Save Appointment"
        onPress={saveAppointment}
      />
    </View>
  );
}