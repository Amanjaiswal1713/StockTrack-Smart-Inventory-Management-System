import DashboardLayout from "../../layouts/DashboardLayout";

function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Low Stock Alert",
    },

    {
      id: 2,
      title: "New Sale Recorded",
    },
  ];

  return (
    <DashboardLayout>
      <h1>Notifications</h1>

      {notifications.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </DashboardLayout>
  );
}

export default Notifications;
