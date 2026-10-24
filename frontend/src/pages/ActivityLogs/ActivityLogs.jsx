import DashboardLayout from "../../layouts/DashboardLayout";

function ActivityLogs() {
  const logs = [
    {
      id: 1,
      action: "Added Product",
      date: "Today",
    },

    {
      id: 2,
      action: "Recorded Sale",
      date: "Today",
    },
  ];

  return (
    <DashboardLayout>
      <h1>Recent Activity</h1>

      {logs.map((log) => (
        <div key={log.id}>{log.action}</div>
      ))}
    </DashboardLayout>
  );
}

export default ActivityLogs;
