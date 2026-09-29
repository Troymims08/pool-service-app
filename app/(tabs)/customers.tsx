import { Pressable, View, Text, FlatList, Button, Alert } from "react-native";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";


type Customer = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Listen for auth becoming ready
  const unsubAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "customers"),
      where("ownerId", "==", user.uid)
    );

    const unsubSnap = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Customer, "id">),
        }));
        setCustomers(data);
        setLoading(false);
      },
      (error) => {
        console.log("Customers snapshot error:", error);
        Alert.alert("Firestore error", error.message);
        setLoading(false);
      }
    );

    // cleanup snapshot when auth changes
    return unsubSnap;
  });

  return () => unsubAuth();
}, []);


  const deleteCustomer = (id: string) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "customers", id));
            } catch {
              Alert.alert("Error", "Failed to delete customer");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Customers
      </Text>

      <Button
  title="+ Add Customer"
  onPress={() => router.push("/(tabs)/add-customer")}
/>

      {customers.length === 0 ? (
        <Text>No customers found.</Text>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/customer-detail",
                  params: {
                    customerId: item.id,
                    customerName: item.name,
                    address: item.address,
                    phone: item.phone,
                  },
                })
              }
            >
              <View
                style={{
                  padding: 15,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                <Text>{item.address}</Text>
                <Text>{item.phone}</Text>

                <Button
                  title="Edit"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/edit-customer",
                      params: {
                        id: item.id,
                        name: item.name,
                        address: item.address,
                        phone: item.phone,
                      },
                    })
                  }
                />

                <Button
                  title="Delete"
                  color="red"
                  onPress={() => deleteCustomer(item.id)}
                />
              </View>
            </Pressable>
          )}
        />
      )}

      <Button
        title="Logout"
        onPress={async () => {
          await signOut(auth);
          router.replace("/login");
        }}
      />
    </View>
  );
}
