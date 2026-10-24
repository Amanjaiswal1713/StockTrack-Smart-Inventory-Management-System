import StatCard from "../StatCard/StatCard";

function DashboardStats({ stats }) {
  return (
    <>
      <StatCard title="Products" value={stats.totalProducts} />

      <StatCard title="Suppliers" value={stats.totalSuppliers} />

      <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} />

      <StatCard title="Low Stock" value={stats.lowStockCount} />
    </>
  );
}

export default DashboardStats;
