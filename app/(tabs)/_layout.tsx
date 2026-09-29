import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="customers"
        options={{ title: "Customers" }}
      />

      <Tabs.Screen
        name="appointments"
        options={{ title: "Appointments" }}
      />

      {/* Hidden screens */}
      <Tabs.Screen
        name="add-customer"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="add-appointment"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="edit-customer"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="edit-appointment"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="customer-detail"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="add-service"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="edit-service"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="appointment-detail"
        options={{ href: null }}
      />
    </Tabs>
  );
}