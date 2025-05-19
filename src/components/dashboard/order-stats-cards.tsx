"use client";

interface StatsCardsProps {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  value: string;
}

export function OrderStatsCards({
  total,
  pending,
  processing,
  completed,
  value,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard title="Total Orders" value={total} />
      <StatCard title="Pending" value={pending} status="pending" />
      <StatCard title="Processing" value={processing} status="processing" />
      <StatCard title="Completed" value={completed} status="completed" />
      <StatCard title="Total Value" value={`$${value}`} />
    </div>
  );
}

function StatCard({
  title,
  value,
  status,
}: {
  title: string;
  value: string | number;
  status?: "pending" | "processing" | "completed";
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={`${status ? statusColors[status] : "text-gray-500"} rounded-lg shadow p-4`}
    >
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p
        className={`mt-1 text-2xl font-semibold ${
          status ? statusColors[status] : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
